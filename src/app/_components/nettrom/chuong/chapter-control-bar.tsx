import { FC } from "react";
import { useChapterContext } from "~/app/_components/contexts/chapter";
import { Select } from "../Select";
import { twMerge } from "tailwind-merge";
import { useScrollDirection } from "~/app/_components/hooks/useScrollDirection";
import { Button } from "../Button";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaEllipsisV,
  FaList,
} from "react-icons/fa";
import useScrollOffset from "~/app/_components/hooks/useScrollOffset";
import Link from "next/link";
import { Constants } from "~/app/constants";

export const ChapterControlBar: FC<{}> = (props) => {
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
  const scrollDirection = useScrollDirection();
  const { isAtBottom, isAtTop } = useScrollOffset();

  return (
    <>
      <div
        className={twMerge(
          `fixed bottom-0 left-0 z-10 mx-auto flex w-full translate-y-0 flex-nowrap items-center justify-center gap-x-1 transition-all duration-500 sm:p-2`,
          scrollDirection === "down" && !isAtBottom && "translate-y-full",
        )}
      >
        <div
          className={twMerge(
            "flex w-full items-center gap-2 bg-neutral-900 p-2 shadow-2xl sm:max-w-[500px] sm:rounded-2xl sm:p-4",
          )}
        >
          <Button
            disabled={isAtTop}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            icon={<FaArrowUp />}
            className="h-16 w-16 shrink-0 rounded-full text-[40px] [&_svg]:size-8"
          ></Button>
          <Link href={Constants.Routes.nettrom.manga(manga?.id || "")}>
            <Button
              variant={"ghost"}
              className="h-16 w-16 shrink-0 bg-transparent text-[40px] [&_svg]:size-8"
              icon={<FaList />}
            ></Button>
          </Link>
          <Button
            disabled={!canPrev}
            onClick={() => prev()}
            icon={<FaArrowLeft />}
            className="h-16 w-16 shrink-0 rounded-lg text-[40px] [&_svg]:size-8"
          ></Button>
          <Select
            classNames={{
              trigger: "h-16 grow rounded-lg text-white",
              content: "max-h-[500px] w-[95vw] sm:w-full",
            }}
            value={chapterId || "Đang tải..."}
            onValueChange={(value) => {
              goTo(value);
            }}
            items={chapters.map((item) => {
              return {
                label:
                  item.volume !== "none"
                    ? `Tập ${item.volume} Chương ${item.chapter}`
                    : item.chapter !== "none"
                      ? `Chương ${item.chapter}`
                      : "Oneshot",
                value: item.id,
              };
            })}
          ></Select>
          <Button
            disabled={!canNext}
            icon={<FaArrowRight />}
            onClick={() => next()}
            className="h-16 w-16 shrink-0 rounded-lg text-[40px] [&_svg]:size-8"
          ></Button>
          <Button
            onClick={() => alert("Chức năng này đang được phát triển")}
            variant={"ghost"}
            className="h-16 w-16 shrink-0 bg-transparent text-[40px] [&_svg]:size-8"
            icon={<FaEllipsisV />}
          ></Button>
        </div>
      </div>
    </>
  );
};
