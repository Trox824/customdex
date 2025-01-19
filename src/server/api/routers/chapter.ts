import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MangadexApi } from "~/api";
import { Includes, Order } from "~/api/mangadex/static";

export const chapterRouter = createTRPCRouter({
  // Get chapter by ID
  getChapter: publicProcedure
    .input(
      z.object({
        id: z.string(),
        includes: z
          .array(z.enum([Includes.MANGA, Includes.SCANLATION_GROUP]))
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await MangadexApi.Chapter.getChapterId(
          input.id,
          input.includes ? { includes: input.includes } : undefined,
        );
        if (!response || !response.data) {
          throw new Error("No data returned from MangaDex");
        }
        return response.data;
      } catch (error) {
        console.error("Chapter fetch error:", error);

        if (error instanceof Error) {
          throw new Error(`Failed to fetch chapter: ${error.message}`);
        }
        throw new Error("Failed to fetch chapter: Unknown error");
      }
    }),

  // Get chapter list/feed for a manga
  getMangaFeed: publicProcedure
    .input(
      z.object({
        mangaId: z.string(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        translatedLanguage: z.array(z.string()).optional(),
        order: z
          .object({
            volume: z.enum([Order.ASC, Order.DESC]).optional(),
            chapter: z.enum([Order.ASC, Order.DESC]).optional(),
          })
          .optional(),
        includes: z
          .array(z.enum([Includes.SCANLATION_GROUP, Includes.USER]))
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const { mangaId, ...options } = input;

      // Handle offset limit
      if (options.offset && options.offset > 10000) {
        options.offset = 10000 - (options.limit || 10);
      }

      try {
        const response = await MangadexApi.Manga.getMangaIdFeed(
          mangaId,
          options,
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch chapter feed");
      }
    }),

  // Get chapter pages from AtHome server
  getChapterPages: publicProcedure
    .input(
      z.object({
        chapterId: z.string(),
        forcePort443: z.boolean().optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await MangadexApi.AtHome.getAtHomeServerChapterId(
          input.chapterId,
          { forcePort443: input.forcePort443 },
        );

        const { baseUrl, chapter } = response.data;

        // Process pages URLs
        const pages = chapter.data.map(
          (originalData) => `${baseUrl}/data/${chapter.hash}/${originalData}`,
        );

        return {
          pages,
          chapter: response.data.chapter,
        };
      } catch (error) {
        throw new Error("Failed to fetch chapter pages");
      }
    }),
});
