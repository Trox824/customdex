import useSWR from "swr/immutable";
import * as Mangadex from "../../../../api/mangadex";

export default function useChapterPages(chapterId: string | null) {
  const { data, isLoading, error } = useSWR(
    chapterId ? ["chapter-pages", chapterId] : null,
    () =>
      Mangadex.AtHome.getAtHomeServerChapterId(chapterId!, {
        forcePort443: false,
      }),
  );
  const successData =
    data &&
    (data.data as Mangadex.AtHome.GetAtHomeServerChapterIdResponse)?.chapter;
  const pages = successData
    ? successData.data.map(
        (originalData) =>
          `${(data.data as Mangadex.AtHome.GetAtHomeServerChapterIdResponse).baseUrl}/data/${successData.hash}/${originalData}`,
      )
    : [];

  return { pages, isLoading, error };
}
