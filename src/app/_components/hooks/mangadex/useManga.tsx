"use client";

import useSWR from "swr";
import { MangadexApi } from "~/api";

export interface UseMangaOptions {
  page?: number;
  limit?: number;
  // Add other filters if needed
}

export interface UseMangaResult {
  mangas: any[]; // Define a more specific type based on your Manga type
  total: number;
  isLoading: boolean;
  error: any;
}

export default function useManga(
  options: UseMangaOptions = {},
): UseMangaResult {
  const { page = 0, limit = 32 } = options;
  const offset = page * limit;

  const { data, error } = useSWR(
    ["newly-updated-vietnamese-manga", page, limit],
    () =>
      MangadexApi.Manga.getSearchManga({
        limit,
        offset,
        availableTranslatedLanguage: ["vi"],
        contentRating: [
          MangadexApi.Static.MangaContentRating.SAFE,
          MangadexApi.Static.MangaContentRating.SUGGESTIVE,
          MangadexApi.Static.MangaContentRating.EROTICA,
          MangadexApi.Static.MangaContentRating.PORNOGRAPHIC,
        ],
        order: { latestUploadedChapter: MangadexApi.Static.Order.DESC },
        includes: [MangadexApi.Static.Includes.COVER_ART],
        hasAvailableChapters: "1",
      }),
  );

  // Process the manga data to ensure cover art URL is properly formatted
  const processedMangas =
    data?.data?.data?.map((manga: any) => {
      const relationships = manga.relationships || [];
      const coverArtRel = relationships.find(
        (rel: any) => rel.type === "cover_art",
      );
      const fileName = coverArtRel?.attributes?.fileName;

      // Construct the cover URL if filename exists
      const coverUrl = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
        : null;

      return {
        ...manga,
        coverFileName: fileName,
        coverUrl, // Add the computed cover URL here
      };
    }) || [];

  return {
    mangas: processedMangas,
    total: data?.data?.total || 0,
    isLoading: !data && !error,
    error,
  };
}
