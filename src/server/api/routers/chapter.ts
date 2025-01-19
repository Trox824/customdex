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
    throw new Error(`MangaDex API error: ${response.statusText}`);
  }

  return response.json();
};

export const chapterRouter = createTRPCRouter({
  getChapterById: publicProcedure
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

      const response = await mangadexFetch(`/chapter/${input.id}?${qs}`);
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
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      const qs = new URLSearchParams();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => qs.append(key + "[]", v));
          } else {
            qs.append(key, String(value));
          }
        }
      });

      const response = await mangadexFetch(`/chapter?${qs}`);
      return response;
    }),
});
