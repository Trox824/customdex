import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as Mangadex from "~/api/mangadex";
import fetch from "node-fetch";

// Create enum validation schema for includes
const includesEnum = z.enum([
  Mangadex.Static.Includes.SCANLATION_GROUP,
  Mangadex.Static.Includes.MANGA,
  Mangadex.Static.Includes.USER,
]);

// A helper to format query params
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

export const chapterRouter = createTRPCRouter({
  getChapterById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        // use includesEnum here
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      const params = formatQueryParams(input);
      const response = await mangadexFetch(`/chapter/${input.id}?${params}`);
      return response;
    }),

  getChapterList: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        manga: z.string().optional(),
        title: z.string().optional(),
        groups: z.array(z.string()).optional(),
        uploader: z.string().optional(),
        volume: z.string().optional(),
        chapter: z.string().optional(),
        translatedLanguage: z.array(z.string()).optional(),
        // use includesEnum here too
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      const params = formatQueryParams(input);
      const response = await mangadexFetch(`/chapter?${params}`);
      return response;
    }),
});
