import Link from "next/link";
import { format } from "date-fns";
import { useChapterContext } from "~/app/_components/contexts/chapter";
import { Utils } from "~/app/_components/utils";
import { Constants } from "~/app/constants";
import { DataLoader } from "~/app/_components/DataLoader";
import { ChapterControlBar } from "./chapter-control-bar";
import { useMemo } from "react";
import { FaClock } from "react-icons/fa";

export default function ChapterControl() {
  const {
    manga,
    chapter,
    canNext,
    canPrev,
    next,
    prev,
    chapters,
    goTo,
    others,
    chapterId,
  } = useChapterContext();

  const mangaTitle = useMemo(() => {
    return Utils.Mangadex.getMangaTitle(manga);
  }, [manga]);
  const chapterTitle = useMemo(() => {
    return Utils.Mangadex.getChapterTitle(chapter);
  }, [chapter]);

  return (
    <DataLoader
      isLoading={!chapter}
      loadingText="Đang tải thông tin chương..."
      error={null}
    >
      <div className="flex flex-col gap-0 text-center">
        <h1 className="mb-4 mt-0 text-center">
          <Link
            className="text-web-title hover:text-web-titleLighter mb-2 text-[20px] transition"
            href={Constants.Routes.nettrom.manga(manga?.id || "")}
          >
            {mangaTitle}
          </Link>{" "}
          <p className="my-0 text-[15px] leading-none text-foreground">
            {chapterTitle}{" "}
          </p>
        </h1>
        <p className="mb-5 text-center">
          <span className="text-[14px] text-muted-foreground">
            <FaClock className="mr-2 inline" />
            Cập nhật lúc:{" "}
            <span className="">
              {chapter &&
                format(
                  new Date(chapter.attributes.publishAt),
                  "HH:mm dd/MM/yyyy",
                )}
            </span>
          </span>
        </p>
        <i></i>
      </div>
      <div className="reading-control">
        {others.length > 0 && (
          <div className="mrb5">
            Chuyển sang đọc bản dịch nhóm khác
            <div className="mrt10">
              {others.map((other, idx) => (
                <Link
                  rel="nofollow"
                  key={other}
                  data-server={1}
                  className="loadchapter btn btn-primary btn-success mrb5"
                  href={Constants.Routes.nettrom.chapter(other)}
                >
                  Nhóm {idx}
                </Link>
              ))}
            </div>
          </div>
        )}
        <ChapterControlBar></ChapterControlBar>
        <div className="mb-4"></div>
      </div>
    </DataLoader>
  );
}
