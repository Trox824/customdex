"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import { ExtendManga } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import type * as Mangadex from "~/api/mangadex";
import { MangadexApi } from "../../../../../src/api";

function transformOptions(
  options: Mangadex.Manga.GetSearchMangaRequestOptions,
) {
  return {
    ...options,
    includes: options.includes as (
      | Mangadex.Static.Includes.MANGA
      | Mangadex.Static.Includes.COVER_ART
      | Mangadex.Static.Includes.AUTHOR
      | Mangadex.Static.Includes.ARTIST
    )[],
    order: options.order && {
      latestUploadedChapter: options.order
        .latestUploadedChapter as Mangadex.Static.Order.DESC,
      followedCount: options.order.followedCount as Mangadex.Static.Order.DESC,
    },
  };
}

export default function useSearchManga(
  options: Mangadex.Manga.GetSearchMangaRequestOptions,
  { enable }: { enable: boolean } = { enable: true },
) {
  // avoid invalid vietnamese characters
  if (options.title) {
    options.title = encodeURIComponent(options.title);
  }
  if (!options.includes) {
    options.includes = [MangadexApi.Static.Includes.COVER_ART];
  }
  if (options.offset && options.offset > 10000) {
    options.offset = 10000 - (options.limit || 10);
  }

  const { data, error, isLoading } = api.mangadex.searchManga.useQuery<any>(
    transformOptions(options),
    { enabled: enable },
  );

  const mangaList = useMemo(() => {
    if (data?.result === "ok") {
      return data.data.map(
        (m: any) => Utils.Mangadex.extendRelationship(m) as ExtendManga,
      );
    }
    return [];
  }, [data]);

  return { data, error, isLoading, mangaList };
}
