"use client";

import { api } from "~/trpc/react";

export default function useChapterPages(chapterId: string | null) {
  const { data, isLoading, error } = api.chapter.getChapterPages.useQuery(
    {
      chapterId: chapterId!,
      forcePort443: false,
    },
    {
      enabled: !!chapterId,
    },
  );

  return {
    pages: data?.pages ?? [],
    isLoading,
    error,
  };
}
