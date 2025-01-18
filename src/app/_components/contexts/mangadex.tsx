"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { uniq } from "lodash";

import {
  ExtendManga,
  GetMangasStatisticResponse,
  MangaList,
  MangaResponse,
  MangaStatistic,
} from "../../_components/types/mangadex";
import * as Mangadex from "../../../api/mangadex";
import { Utils } from "../../_components/utils";

export type Mangas = { [k: string]: ExtendManga };
export type MangaStatistics = Record<string, MangaStatistic>;

export const MangadexContext = createContext<{
  mangas: Mangas;
  mangaStatistics: MangaStatistics;
  updateMangas: (
    options: Mangadex.Manga.GetSearchMangaRequestOptions,
  ) => Promise<void>;
  updateMangaStatistics: (
    options: Mangadex.Statistic.GetMangasStatisticRequestOptions,
  ) => Promise<void>;
  addMangas: (mangaList: ExtendManga[]) => void;
}>({
  mangas: {},
  mangaStatistics: {},
  updateMangas: () => new Promise(() => null),
  updateMangaStatistics: () => new Promise(() => null),
  addMangas: ([]) => null,
});

export const MangadexContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mangas, setMangas] = useState<Mangas>({});
  const [mangaStatistics, setMangaStatistics] = useState<MangaStatistics>({});

  const updateMangas = useCallback(
    async (options: Mangadex.Manga.GetSearchMangaRequestOptions) => {
      if (!options.includes) {
        options.includes = [Mangadex.Static.Includes.COVER_ART];
      }
      if (options.ids) {
        options.ids = uniq(
          options.ids.filter((id) => {
            if (!mangas[id]) return true;
            if (options.includes?.length === 1) return false;
            if (
              options.includes?.includes(Mangadex.Static.Includes.AUTHOR) &&
              !mangas[id].author?.attributes
            )
              return true;
            if (
              options.includes?.includes(Mangadex.Static.Includes.ARTIST) &&
              !mangas[id].artist?.attributes
            )
              return true;
            return false;
          }),
        );
      }
      if (!options.includes.includes(Mangadex.Static.Includes.COVER_ART)) {
        options.includes.push(Mangadex.Static.Includes.COVER_ART);
      }

      // nothing to update
      if (options.ids?.length === 0) return;

      // only one
      if (options.ids?.length === 1) {
        const mangaId = options.ids[0] as string;
        const { data } = await Mangadex.Manga.getMangaId(mangaId, {
          includes: options.includes,
        });
        if (data && (data as MangaResponse).data) {
          setMangas((prevMangas) => {
            prevMangas[mangaId] = Utils.Mangadex.extendRelationship(
              (data as MangaResponse).data,
            ) as ExtendManga;
            return { ...prevMangas };
          });
        }
        return;
      }

      // rewrite
      options.limit = 100;
      options.contentRating = [
        Mangadex.Static.MangaContentRating.EROTICA,
        Mangadex.Static.MangaContentRating.PORNOGRAPHIC,
        Mangadex.Static.MangaContentRating.SAFE,
        Mangadex.Static.MangaContentRating.SUGGESTIVE,
      ];
      try {
        const { data } = await Mangadex.Manga.getSearchManga(options);
        if (data && (data as MangaList).data) {
          setMangas((prevMangas) => {
            for (const manga of (data as MangaList).data) {
              prevMangas[manga.id] = Utils.Mangadex.extendRelationship(
                manga,
              ) as ExtendManga;
            }
            return { ...prevMangas };
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [mangas, setMangas],
  );

  const addMangas = useCallback(
    (mangaList: ExtendManga[]) => {
      setMangas((prevMangas) => {
        for (const manga of mangaList) {
          prevMangas[manga.id] = Utils.Mangadex.extendRelationship(
            manga,
          ) as ExtendManga;
        }
        return { ...prevMangas };
      });
    },
    [setMangas],
  );

  const updateMangaStatistics = useCallback(
    async (options: Mangadex.Statistic.GetMangasStatisticRequestOptions) => {
      options.manga = uniq(options.manga.filter((id) => !mangaStatistics[id]));
      if (options.manga.length === 0) return;
      try {
        const { data } = await Mangadex.Statistic.getMangasStatistic(options);
        if (data && (data as GetMangasStatisticResponse).statistics) {
          setMangaStatistics((prev) => ({
            ...prev,
            ...(data as GetMangasStatisticResponse).statistics,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [mangaStatistics, setMangaStatistics],
  );

  return (
    <MangadexContext.Provider
      value={{
        mangas,
        updateMangas,
        mangaStatistics,
        updateMangaStatistics,
        addMangas,
      }}
    >
      {children}
    </MangadexContext.Provider>
  );
};

export const useMangadex = () => useContext(MangadexContext);
