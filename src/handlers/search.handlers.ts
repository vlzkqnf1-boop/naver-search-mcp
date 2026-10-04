import { NaverSearchClient } from "../clients/naver-search.client.js";
import { NaverLocalSearchParams } from "../schemas/search.schemas.js";
import { SearchArgs } from "../schemas/search.schemas.js";
import { SearchArgsSchema } from "../schemas/search.schemas.js";

function getClient() {
  return NaverSearchClient.getInstance();
}

export const searchToolHandlers: Record<string, (args: any) => Promise<any>> = {
  search_webkr: (args) => {
    console.error(
      "search_webkr called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleWebKrSearch(SearchArgsSchema.parse(args));
  },

  search_news: (args) => {
    console.error(
      "search_news called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleNewsSearch(SearchArgsSchema.parse(args));
  },

  search_blog: (args) => {
    console.error(
      "search_blog called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleBlogSearch(SearchArgsSchema.parse(args));
  },

  search_image: (args) => {
    console.error(
      "search_image called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleImageSearch(SearchArgsSchema.parse(args));
  },

  search_kin: (args) => {
    console.error(
      "search_kin called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleKinSearch(SearchArgsSchema.parse(args));
  },

  search_encyc: (args) => {
    console.error(
      "search_encyc called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleEncycSearch(SearchArgsSchema.parse(args));
  },

  search_local: (args) => {
    console.error(
      "search_local called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleLocalSearch(args);
  },

  search_cafearticle: (args) => {
    console.error(
      "search_cafearticle called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleCafeArticleSearch(SearchArgsSchema.parse(args));
  },
};

export async function handleEncycSearch(params: SearchArgs) {
  return getClient().search("encyc", params);
}

export async function handleImageSearch(params: SearchArgs) {
  return getClient().search("image", params);
}

export async function handleKinSearch(params: SearchArgs) {
  return getClient().search("kin", params);
}

export async function handleLocalSearch(params: NaverLocalSearchParams) {
  return getClient().searchLocal(params);
}

export async function handleNewsSearch(params: SearchArgs) {
  return getClient().search("news", params);
}

export async function handleBlogSearch(params: SearchArgs) {
  return getClient().search("blog", params);
}

export async function handleCafeArticleSearch(params: SearchArgs) {
  return getClient().search("cafearticle", params);
}

export async function handleWebKrSearch(args: SearchArgs) {
  return getClient().search("webkr", args);
}
