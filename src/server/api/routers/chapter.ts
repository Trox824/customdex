import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import * as Mangadex from "~/api/mangadex";

// Create enum validation schema for includes
const includesEnum = z.enum([
  Mangadex.Static.Includes.SCANLATION_GROUP,
  Mangadex.Static.Includes.MANGA,
  Mangadex.Static.Includes.USER,
]);

export const chapterRouter = createTRPCRouter({
  getChapterById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await Mangadex.Chapter.getChapterId(input.id, {
          includes: input.includes,
        });
        // Return the full response to match the expected structure
        return response;
      } catch (error) {
        console.error("Error fetching chapter:", error);
        throw error;
      }
    }),

  getChapterList: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
        ids: z.array(z.string()).optional(),
        title: z.string().optional(),
        groups: z.array(z.string()).optional(),
        uploader: z.string().optional(),
        manga: z.string().optional(),
        volume: z.string().optional(),
        chapter: z.string().optional(),
        translatedLanguage: z.array(z.string()).optional(),
        includes: z.array(includesEnum).optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await Mangadex.Chapter.getChapter(input);
        return response;
      } catch (error) {
        console.error("Error fetching chapter list:", error);
        throw error;
      }
    }),
});
