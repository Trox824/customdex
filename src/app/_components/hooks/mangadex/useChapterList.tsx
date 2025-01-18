import useSWR from "swr";
import * as Mangadex from "../../../../api/mangadex";
import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import { Constants } from "~/app/constants";

export const chaptersPerPage = Constants.Mangadex.CHAPTER_LIST_LIMIT;

export default function useChapterList(
  mangaId: string,
  options: Mangadex.Manga.GetMangaIdFeedRequestOptions,
) {
  // rewrite
  options.translatedLanguage = ["vi"];
  options.includes = [
    Mangadex.Static.Includes.SCANLATION_GROUP,
    Mangadex.Static.Includes.USER,
  ];
  options.order = {
    volume: Mangadex.Static.Order.DESC,
    chapter: Mangadex.Static.Order.DESC,
  };
  options.contentRating = [
    Mangadex.Static.MangaContentRating.EROTICA,
    Mangadex.Static.MangaContentRating.PORNOGRAPHIC,
    Mangadex.Static.MangaContentRating.SAFE,
    Mangadex.Static.MangaContentRating.SUGGESTIVE,
  ];
  options.limit = chaptersPerPage;
  if (options.offset && options.offset > 10000) {
    options.offset = 10000 - options.limit;
  }
  const { data, isLoading, error } = useSWR([mangaId, options], () =>
    Mangadex.Manga.getMangaIdFeed(mangaId, options),
  );

  data?.data.data.forEach(
    (c) => Utils.Mangadex.extendRelationship(c) as ExtendChapter,
  );

  return {
    chapters: (data?.data.data || []) as ExtendChapter[],
    data,
    isLoading,
    error,
  };
}
