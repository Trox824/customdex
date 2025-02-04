import { GetMangasStatisticResponse } from "~/app/_components/types/mangadex";
import * as util from "./util";

export type GetMangasStatisticRequestOptions = {
  manga: string[];
};

export const getMangasStatistic = function (
  options?: GetMangasStatisticRequestOptions,
) {
  const qs = util.buildQueryStringFromOptions(options);
  const path = `/statistics/manga${qs}`;

  return util.createHttpsRequestPromise<GetMangasStatisticResponse>(
    "GET",
    path,
  );
};

export const getGroupStatistic = function (groupId: string) {
  const path = `/statistics/group/${groupId}`;

  return util.createHttpsRequestPromise<GetMangasStatisticResponse>(
    "GET",
    path,
  );
};
