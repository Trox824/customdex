"use client";

import { useMemo } from "react";
import { api } from "~/trpc/react";
import { ExtendManga, MangaList } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import { type GetSearchMangaRequestOptions } from "~/api/mangadex/manga";
import { Includes } from "~/api/mangadex/static";

export default function useSearchManga(
  options: Omit<GetSearchMangaRequestOptions, "offset">,
  { enable = true }: { enable?: boolean } = {},
) {
  // Avoid invalid Vietnamese characters
  if (options.title) {
    options.title = encodeURIComponent(options.title);
  }
  if (!options.includes) {
    options.includes = [Includes.COVER_ART];
  }

  // Narrow the type of includes to match the expected type
  const includes = options.includes as (
    | Includes.MANGA
    | Includes.COVER_ART
    | Includes.AUTHOR
    | Includes.ARTIST
  )[];

  const { data, error, isLoading } = api.mangadex.getSearchManga.useQuery(
    { ...options, includes }, // Spread and use narrowed includes
    {
      enabled: enable,
    },
  );

  const mangaList = useMemo(() => {
    if (data?.data) {
      return data.data.map(
        (m) => Utils.Mangadex.extendRelationship(m) as ExtendManga,
      );
    }
    return [];
  }, [data]);

  return { data, error, isLoading, mangaList };
}
