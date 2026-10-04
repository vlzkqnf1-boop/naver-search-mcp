import { NaverSearchClient } from "../clients/naver-search.client.js";
import { resolveDateRange } from "../utils/date.utils.js";
import {
  DatalabSearch,
  DatalabShopping,
  DatalabShoppingDevice,
  DatalabShoppingGender,
  DatalabShoppingAge,
  DatalabShoppingKeywords,
  DatalabShoppingKeywordDevice,
  DatalabShoppingKeywordGender,
  DatalabShoppingKeywordAge,
} from "../schemas/datalab.schemas.js";

function getClient() {
  return NaverSearchClient.getInstance();
}

export const datalabToolHandlers: Record<string, (args: any) => Promise<any>> = {
  datalab_search: (args) => {
    console.error(
      "datalab_search called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleSearchTrend(args);
  },

  datalab_shopping_category: (args) => {
    console.error(
      "datalab_shopping_category called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingCategoryTrend(args);
  },

  datalab_shopping_by_device: (args) => {
    console.error(
      "datalab_shopping_by_device called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingByDeviceTrend(args);
  },

  datalab_shopping_by_gender: (args) => {
    console.error(
      "datalab_shopping_by_gender called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingByGenderTrend(args);
  },

  datalab_shopping_by_age: (args) => {
    console.error(
      "datalab_shopping_by_age called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingByAgeTrend(args);
  },

  datalab_shopping_keywords: (args) => {
    console.error(
      "datalab_shopping_keywords called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingKeywordsTrend(args);
  },

  datalab_shopping_keyword_by_device: (args) => {
    console.error(
      "datalab_shopping_keyword_by_device called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingKeywordByDeviceTrend(args);
  },

  datalab_shopping_keyword_by_gender: (args) => {
    console.error(
      "datalab_shopping_keyword_by_gender called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingKeywordByGenderTrend(args);
  },

  datalab_shopping_keyword_by_age: (args) => {
    console.error(
      "datalab_shopping_keyword_by_age called with args:",
      JSON.stringify(args, null, 2)
    );
    return handleShoppingKeywordByAgeTrend(args);
  },
};

export async function handleSearchTrend(params: DatalabSearch) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().searchTrend({
    ...params,
    startDate,
    endDate,
  });
}

export async function handleShoppingCategoryTrend(
  params: DatalabShopping
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingCategory({
    ...params,
    startDate,
    endDate,
  });
}

export async function handleShoppingByDeviceTrend(
  params: DatalabShoppingDevice
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingByDevice({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    device: params.device,
  });
}

export async function handleShoppingByGenderTrend(
  params: DatalabShoppingGender
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingByGender({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    gender: params.gender,
  });
}

export async function handleShoppingByAgeTrend(
  params: DatalabShoppingAge
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingByAge({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    ages: params.ages,
  });
}

export async function handleShoppingKeywordsTrend(
  params: DatalabShoppingKeywords
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingKeywords({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
  });
}

export async function handleShoppingKeywordByDeviceTrend(
  params: DatalabShoppingKeywordDevice
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingKeywordByDevice({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    device: params.device,
  });
}

export async function handleShoppingKeywordByGenderTrend(
  params: DatalabShoppingKeywordGender
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingKeywordByGender({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    gender: params.gender,
  });
}

export async function handleShoppingKeywordByAgeTrend(
  params: DatalabShoppingKeywordAge
) {
  const { startDate, endDate } = resolveDateRange(
    params.startDate,
    params.endDate
  );

  return getClient().datalabShoppingKeywordByAge({
    startDate,
    endDate,
    timeUnit: params.timeUnit,
    category: params.category,
    keyword: params.keyword,
    ages: params.ages,
  });
}
