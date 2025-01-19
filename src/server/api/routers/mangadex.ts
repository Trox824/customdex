import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MangadexApi } from "~/api";
import { MangaContentRating, Includes } from "~/api/mangadex/static";

// Configure headers for MangaDex API requests
const USER_AGENT = "NettromReader/1.0.0 (your@email.com)";

// Add this to your MangadexApi util functions or modify them to accept headers
const headers = {
  "User-Agent": USER_AGENT,
};

export const mangadexRouter = createTRPCRouter({
  // Get manga list with search and filters
  getSearchManga: publicProcedure
    .input(
      z.object({
        page: z.number().default(0),
        limit: z.number().default(32),
        title: z.string().optional(),
        availableTranslatedLanguage: z.array(z.string()).optional(),
        contentRating: z
          .array(
            z.enum([
              MangaContentRating.SAFE,
              MangaContentRating.SUGGESTIVE,
              MangaContentRating.EROTICA,
              MangaContentRating.PORNOGRAPHIC,
            ]),
          )
          .optional(),
        order: z.record(z.string(), z.string()).optional(),
        includes: z
          .array(
            z.enum([
              Includes.MANGA,
              Includes.COVER_ART,
              Includes.AUTHOR,
              Includes.ARTIST,
              // Add other Includes values as needed
            ]),
          )
          .optional(),
        hasAvailableChapters: z.enum(["0", "1", "true", "false"]).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { page, limit, ...rest } = input;
      const offset = page * limit;

      try {
        const response = await MangadexApi.Manga.getSearchManga({
          limit,
          offset,
          ...rest,
        });

        // Process the manga data to add cover URLs
        const processedData = response.data.data.map((manga: any) => {
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
        });

        return {
          data: processedData,
          total: response.data.total,
        };
      } catch (error) {
        throw new Error("Failed to fetch manga from MangaDex");
      }
    }),

  // Get manga by ID
  getMangaById: publicProcedure
    .input(
      z.object({
        id: z.string(),
        includes: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await MangadexApi.Manga.getMangaId(
          input.id,
          input.includes ? { includes: input.includes as any } : undefined,
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch manga details");
      }
    }),

  // Get manga chapters feed
  getMangaFeed: publicProcedure
    .input(
      z.object({
        mangaId: z.string(),
        limit: z.number().optional(),
        offset: z.number().optional(),
        translatedLanguage: z.array(z.string()).optional(),
        order: z.record(z.string(), z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      const { mangaId, ...options } = input;
      try {
        const response = await MangadexApi.Manga.getMangaIdFeed(
          mangaId,
          options,
        );
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch manga chapters");
      }
    }),

  // Get manga tags
  getTags: publicProcedure.query(async () => {
    try {
      const response = await MangadexApi.Manga.getMangaTag();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch manga tags");
    }
  }),
});
