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
function formatQueryParams(input: Record<string, unknown>) {
  const params = new URLSearchParams();

  Object.entries(input).forEach(([key, value]) => {
    if (value == null) return;

    // Handle order object specially
    if (key === "order" && typeof value === "object" && !Array.isArray(value)) {
      Object.entries(value as Record<string, unknown>).forEach(
        ([orderKey, orderValue]) => {
          if (orderValue != null) {
            params.append(`order[${orderKey}]`, JSON.stringify(orderValue));
          }
        },
      );
    }
    // Handle arrays
    else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null) {
          params.append(`${key}[]`, JSON.stringify(item));
        }
      });
    }
    // Handle objects
    else if (typeof value === "object") {
      params.append(key, JSON.stringify(value));
    }
    // Handle primitives
    else {
      params.append(key, JSON.stringify(value));
    }
  });

  return params;
}

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
