import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as Mangadex from "~/api/mangadex";

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
      console.log(input);
      const response = await Mangadex.Manga.getSearchManga(input);
      return response.data;
    }),

  getMangaById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      const response = await Mangadex.Manga.getMangaId(input.id, {
        includes: input.includes,
      });
      return response.data;
    }),

  searchManga: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        title: z.string().optional(),
        availableTranslatedLanguage: z.array(z.string()).optional(),
        contentRating: z.array(contentRatingEnum).optional(),
        order: z
          .object({
            latestUploadedChapter: z
              .enum([Mangadex.Static.Order.DESC])
              .optional(),
            followedCount: z.enum([Mangadex.Static.Order.DESC]).optional(),
          })
          .optional(),
        includes: z.array(includesEnum).optional(),
        hasAvailableChapters: z.enum(["0", "1", "true", "false"]).optional(),
        createdAtSince: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const response = await Mangadex.Manga.getSearchManga(input);
      return response.data;
    }),
});
