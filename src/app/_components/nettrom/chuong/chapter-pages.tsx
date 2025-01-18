import { useChapterPages } from "~/app/_components/hooks/mangadex";
import LazyImages from "./lazy-images";
import useWindowSize from "~/app/_components/hooks/useWindowSize";
import { useChapterContext } from "~/app/_components/contexts/chapter";
import { DataLoader } from "~/app/_components/DataLoader";
import { Button } from "../Button";
export default function ChapterPages() {
  const { height } = useWindowSize();

  const { chapterId, canNext, canPrev, next, prev } = useChapterContext();

  const { pages, isLoading } = useChapterPages(chapterId);
  return (
    <div className="flex flex-col items-center">
      <DataLoader
        isLoading={isLoading}
        loadingText="Đang tải nội dung chương..."
        error={null}
      >
        <div className="reading-detail box_doc">
          <LazyImages images={pages} threshold={(height || 1000) * 3} />
        </div>
      </DataLoader>
      <div className="mb-2 mt-4 flex flex-col gap-2">
        <Button disabled={!canNext} onClick={next}>
          Chương tiếp theo
        </Button>
        <Button disabled={!canPrev} onClick={prev}>
          Chương trước
        </Button>
      </div>
    </div>
  );
}
