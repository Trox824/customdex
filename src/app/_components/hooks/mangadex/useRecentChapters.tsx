"use client";

import { useMemo } from "react";
import useLastUpdates from "./useLastUpdates";
import { ExtendChapter } from "~/app/_components/types/mangadex";

export default function useRecentChapters(page: number = 0, groupId?: string) {
  const { chapters, isLoading, error, total } = useLastUpdates({
    page,
    groupId,
  });

  const recentChaptersByManga = useMemo(() => {
    const mangaMap = new Map<string, ExtendChapter[]>();

    chapters.forEach((chapter) => {
      const mangaId = chapter.relationships.find((r) => r.type === "manga")?.id;
      if (!mangaId) return;

      if (!mangaMap.has(mangaId)) {
        mangaMap.set(mangaId, []);
      }

      const mangaChapters = mangaMap.get(mangaId)!;
      if (mangaChapters.length < 3) {
        mangaChapters.push(chapter);
      }
    });

    return Array.from(mangaMap.values());
  }, [chapters]);

  return {
    recentChaptersByManga,
    isLoading,
    error,
    total,
  };
}
