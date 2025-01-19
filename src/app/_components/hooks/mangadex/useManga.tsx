"use client";

import { api } from "~/trpc/react";
import * as Mangadex from "~/api/mangadex";

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
  const offset = page * limit;

  const { data, error, isLoading } = api.mangadex.getSearchManga.useQuery<any>({
    limit,
    offset,
    availableTranslatedLanguage: ["vi"],
    contentRating: [
      Mangadex.Static.MangaContentRating.SAFE,
      Mangadex.Static.MangaContentRating.SUGGESTIVE,
      Mangadex.Static.MangaContentRating.EROTICA,
      Mangadex.Static.MangaContentRating.PORNOGRAPHIC,
    ],
    order: { latestUploadedChapter: Mangadex.Static.Order.DESC },
    includes: [Mangadex.Static.Includes.COVER_ART],
    hasAvailableChapters: "1",
  });

  // Process the manga data to ensure cover art URL is properly formatted
  const processedMangas =
    data?.data?.map((manga: any) => {
      const relationships = manga.relationships || [];
      const coverArtRel = relationships.find(
        (rel: any) => rel.type === "cover_art",
      );
      const fileName = coverArtRel?.attributes?.fileName;
      const coverUrl = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
        : null;

      return {
        ...manga,
        coverFileName: fileName,
        coverUrl,
      };
    }) || [];

  return {
    mangas: processedMangas,
    total: data?.total || 0,
    isLoading,
    error,
  };
}
