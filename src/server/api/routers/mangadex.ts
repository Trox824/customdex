import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as Mangadex from "~/api/mangadex";
import fetch from "node-fetch";

// Create enum validation schemas based on MangaDex types
const contentRatingEnum = z.enum([
  Mangadex.Static.MangaContentRating.SAFE,
  Mangadex.Static.MangaContentRating.SUGGESTIVE,
  Mangadex.Static.MangaContentRating.EROTICA,
  Mangadex.Static.MangaContentRating.PORNOGRAPHIC,
]);

const includesEnum = z.enum([
  Mangadex.Static.Includes.MANGA,
  Mangadex.Static.Includes.COVER_ART,
  Mangadex.Static.Includes.AUTHOR,
  Mangadex.Static.Includes.ARTIST,
]);

const orderEnum = z.enum([Mangadex.Static.Order.DESC]);

// Helper function to properly format query parameters for MangaDex API
const formatQueryParams = (input: any) => {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "order" && typeof value === "object") {
      // Handle order object specially
      Object.entries(value).forEach(([orderKey, orderValue]) => {
        params.append(`order[${orderKey}]`, String(orderValue));
      });
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((v) => {
        params.append(`${key}[]`, String(v));
      });
    } else if (typeof value === "object") {
      // Handle other objects
      Object.entries(value).forEach(([objKey, objValue]) => {
        params.append(`${key}[${objKey}]`, String(objValue));
      });
    } else {
      // Handle primitive values
      params.append(key, String(value));
    }
  });

  return params;
};

const mangadexFetch = async (endpoint: string, options: any = {}) => {
  const baseUrl = "https://api.mangadex.org";
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "User-Agent": "MangaDex/1.0.0 (nthung2k4@gmail.com)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      `MangaDex API error: ${response.statusText}${
        error ? ` - ${JSON.stringify(error)}` : ""
      }`,
    );
  }

  return response.json();
};

export const mangadexRouter = createTRPCRouter({
  getSearchManga: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        availableTranslatedLanguage: z.array(z.string()).optional(),
        contentRating: z.array(contentRatingEnum).optional(),
        order: z
          .object({
            latestUploadedChapter: z
              .enum([Mangadex.Static.Order.DESC])
              .optional(),
          })
          .optional(),
        includes: z.array(includesEnum).optional(),
        hasAvailableChapters: z.enum(["0", "1", "true", "false"]).optional(),
      }),
    )
    .query(async ({ input }) => {
      const params = formatQueryParams(input);
      const response = await mangadexFetch(`/manga?${params}`);
      return response;
    }),

  getMangaById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        includes: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      const qs = new URLSearchParams();
      if (input.includes) {
        input.includes.forEach((include) => qs.append("includes[]", include));
      }

      const response = await mangadexFetch(`/manga/${input.id}?${qs}`);
      return response;
    }),

  searchManga: publicProcedure
    .input(
      z.object({
        title: z.string().optional(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        availableTranslatedLanguage: z.array(z.string()).optional(),
        contentRating: z.array(contentRatingEnum).optional(),
        order: z
          .object({
            latestUploadedChapter: orderEnum.optional(),
            followedCount: orderEnum.optional(),
            rating: orderEnum.optional(),
            createdAt: orderEnum.optional(),
          })
          .optional(),
        includes: z.array(includesEnum).optional(),
        hasAvailableChapters: z.enum(["0", "1", "true", "false"]).optional(),
        createdAtSince: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const qs = new URLSearchParams();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => qs.append(key + "[]", String(v)));
          } else if (typeof value === "object") {
            qs.append(key, JSON.stringify(value));
          } else {
            qs.append(key, String(value));
          }
        }
      });

      const response = await mangadexFetch(`/manga?${qs}`);
      return response;
    }),
});
