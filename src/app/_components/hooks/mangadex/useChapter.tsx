"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import { Includes } from "~/api/mangadex/static";

export default function useChapter(chapterId: string | null) {
  const { data, isLoading, error } = api.chapter.getChapter.useQuery(
    {
      id: chapterId!,
      includes: [Includes.SCANLATION_GROUP],
    },
    {
      enabled: !!chapterId,
      retry: 3,
      retryDelay: 1000,
    },
  );

  const [chapter, setChapter] = useState<ExtendChapter | null>(null);

  useEffect(() => {
    if (!data?.data) return;

    try {
      const extendedChapter = Utils.Mangadex.extendRelationship(
        data.data,
      ) as ExtendChapter;
      setChapter(extendedChapter);
    } catch (err) {
      console.error("Error extending chapter relationships:", err);
    }
  }, [data]);

  return {
    chapter,
    data,
    isLoading,
    error,
    isError: !!error,
  };
}
