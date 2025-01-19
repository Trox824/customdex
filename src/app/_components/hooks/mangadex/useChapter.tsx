import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Utils } from "~/app/_components/utils";
import { MangadexApi } from "~/api";

export default function useChapter(chapterId: string | null) {
  const { data, isLoading, error } = api.chapter.getChapterById.useQuery(
    {
      id: chapterId!,
      includes: [MangadexApi.Static.Includes.SCANLATION_GROUP],
    },
    {
      enabled: !!chapterId,
      retry: false,
      refetchOnWindowFocus: false,
    },
  );

  const [chapter, setChapter] = useState<ExtendChapter | null>(null);

  useEffect(() => {
    if (!data?.data?.data) return;
    setChapter(
      Utils.Mangadex.extendRelationship(data.data.data) as ExtendChapter,
    );
  }, [data]);

  return {
    chapter,
    data,
    isLoading,
    error,
  };
}
