import http, { IncomingMessage, ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {
  createNaverSearchServer,
  configSchema,
  resetServerInstance,
} from "./index.js";

const PORT = Number(process.env.PORT || 3000);

const config = configSchema.parse({
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
  NCP_APIGW_API_KEY_ID: process.env.NCP_APIGW_API_KEY_ID,
  NCP_APIGW_API_KEY: process.env.NCP_APIGW_API_KEY,
});

const transports: Record<string, StreamableHTTPServerTransport> = {};

async function readJson(req: IncomingMessage): Promise<any> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8");

  if (!raw) {
    return undefined;
  }

  return JSON.parse(raw);
}

function setCors(res: ServerResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Mcp-Session-Id, MCP-Protocol-Version"
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Mcp-Session-Id, MCP-Protocol-Version"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
}

async function closeExistingSessions() {
  for (const sessionId of Object.keys(transports)) {
    try {
      await transports[sessionId].close();
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error);
    }

    delete transports[sessionId];
  }

  resetServerInstance();
}

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    setCors(res);

    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (req.url === "/healthz") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("ok");
      return;
    }

    if (req.url !== "/mcp") {
      res.statusCode = 404;
      res.end("Not Found");
      return;
    }

    try {
      const sessionIdHeader = req.headers["mcp-session-id"];
      const sessionId =
        typeof sessionIdHeader === "string" ? sessionIdHeader : undefined;

      if (req.method === "POST") {
        const body = await readJson(req);

        let transport: StreamableHTTPServerTransport;

        if (sessionId && transports[sessionId]) {
          transport = transports[sessionId];
        } else if (!sessionId && isInitializeRequest(body)) {
          await closeExistingSessions();

          transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),

            onsessioninitialized: (newSessionId) => {
              console.log(`MCP session initialized: ${newSessionId}`);
              transports[newSessionId] = transport;
            },
          });

          transport.onclose = () => {
            const sid = transport.sessionId;

            if (sid) {
              delete transports[sid];
            }
          };

          const mcpServer = createNaverSearchServer({ config });

          await mcpServer.connect(transport);
          await transport.handleRequest(req, res, body);
          return;
        } else if (sessionId && !transports[sessionId]) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              jsonrpc: "2.0",
              error: {
                code: -32001,
                message: "Session not found",
              },
              id: null,
            })
          );
          return;
        } else {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              jsonrpc: "2.0",
              error: {
                code: -32000,
                message: "Bad Request: No valid MCP session",
              },
              id: null,
            })
          );
          return;
        }

        await transport.handleRequest(req, res, body);
        return;
      }

      if (req.method === "GET") {
        if (!sessionId || !transports[sessionId]) {
          res.statusCode = 404;
          res.end("Session not found");
          return;
        }

        await transports[sessionId].handleRequest(req, res);
        return;
      }

      if (req.method === "DELETE") {
        if (!sessionId || !transports[sessionId]) {
          res.statusCode = 404;
          res.end("Session not found");
          return;
        }

        await transports[sessionId].handleRequest(req, res);
        return;
      }

      res.statusCode = 405;
      res.end("Method Not Allowed");
    } catch (error) {
      console.error("MCP HTTP error:", error);

      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: {
              code: -32603,
              message: "Internal server error",
            },
            id: null,
          })
        );
      }
    }
  }
);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`NAVER MCP Streamable HTTP server running on port ${PORT}`);
  console.log(`MCP endpoint: /mcp`);
  console.log(`Health endpoint: /healthz`);
});
