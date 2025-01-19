"use client";

import { api } from "~/trpc/react";
import { Includes } from "~/api/mangadex/static";
import { MangaContentRating } from "~/api/mangadex/static";
export interface UseMangaOptions {
  page?: number;
  limit?: number;
}
export interface UseMangaResult {
  mangas: any[];
  total: number;
  isLoading: boolean;
  error: any;
}
export default function useManga(
  options: UseMangaOptions = {},
): UseMangaResult {
  const { page = 0, limit = 32 } = options;

  const { data, error, isLoading } = api.mangadex.getSearchManga.useQuery({
    page,
    limit,
    availableTranslatedLanguage: ["vi"],
    contentRating: [
      MangaContentRating.SAFE,
      MangaContentRating.SUGGESTIVE,
      MangaContentRating.EROTICA,
      MangaContentRating.PORNOGRAPHIC,
    ],
    order: { latestUploadedChapter: "desc" },
    includes: [Includes.COVER_ART],
    hasAvailableChapters: "1",
  });

  return {
    mangas: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
  };
}
