"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { useLastUpdates } from "~/app/_components/hooks/mangadex";
import { useMangadex } from "~/app/_components/contexts/mangadex";

import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Constants } from "~/app/constants";
import { FaClock } from "react-icons/fa";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import { DataLoader } from "~/app/_components/DataLoader";
import { Utils } from "~/app/_components/utils";
import useReadingHistory from "~/app/_components/hooks/useReadingHistory";
import { ReadingHistory } from "~/app/_components/types";
import Pagination from "../Pagination";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/app/_components/shadcn/hover-card";
import { Skeleton } from "~/app/_components/shadcn/skeleton";

const MangaTile = (props: {
  id: string;
  title: string;
  thumbnail: string;
  chapters: ExtendChapter[];
  readedChapters: ReadingHistory;
}) => {
  const { mangaStatistics, mangas } = useMangadex();
  const readedChaptersId = props.readedChapters?.chapterId ?? null;
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <div className="group">
      <figure className="clearfix">
        <div className="relative mb-2">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                title={props.title}
                href={Constants.Routes.nettrom.manga(props.id)}
              >
                <AspectRatio
                  ratio={Constants.Nettrom.MANGA_COVER_RATIO}
                  className="overflow-hidden rounded-lg group-hover:shadow-lg"
                >
                  <div className="absolute bottom-0 left-0 z-[1] h-3/5 w-full bg-gradient-to-t from-neutral-900 from-[15%] to-transparent transition-all duration-500 group-hover:h-3/4"></div>
                  <img
                    src={props.thumbnail}
                    className="lazy h-full w-full object-cover transition duration-500 group-hover:scale-[102%]"
                    data-original={props.thumbnail}
                    alt={props.title}
                  />
                </AspectRatio>
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              className="w-[500px] rounded-lg border-border bg-background p-6"
              side="right"
            >
              <div className="flex">
                <div className="w-[200px] flex-none">
                  <img
                    className="h-[250px] w-full rounded object-cover"
                    src={props.thumbnail}
                    alt={props.title}
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    Total: {mangas[props.id]?.attributes.lastChapter || "??"}
                  </div>
                </div>
                <div className="ml-6 max-h-[250px] flex-1 space-y-6 overflow-y-auto">
                  <h3 className="line-clamp-2 text-2xl font-semibold text-foreground">
                    {props.title}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {Utils.Mangadex.getOriginalMangaTitle(mangas[props.id])}
                  </p>
                  {mangas[props.id]?.attributes.description?.en && (
                    <div className="border-b border-muted-foreground pb-2">
                      <p className="inline text-lg text-foreground">
                        {showFullDescription
                          ? mangas[props.id]?.attributes.description?.en ||
                            "No description available"
                          : `${mangas[props.id]?.attributes.description?.en?.slice(0, 150) || "No description available"}... `}
                        <button
                          className="ml-1 inline-flex text-base text-blue-500 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowFullDescription(!showFullDescription);
                          }}
                        >
                          {showFullDescription ? "Ẩn bớt" : "Xem thêm"}
                        </button>
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-lg font-medium text-foreground">
                      Chapters
                    </h4>
                    <ul className="space-y-1">
                      {props.chapters.map((chapter) => (
                        <li key={chapter.id} className="text-lg">
                          <Link
                            href={Constants.Routes.nettrom.chapter(chapter.id)}
                            className={twMerge(
                              "transition hover:text-primary",
                              readedChaptersId === chapter.id
                                ? "text-muted-foreground"
                                : "text-foreground",
                            )}
                          >
                            {Utils.Mangadex.getChapterTitle(chapter)}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {Utils.Date.formatNowDistance(
                                new Date(chapter.attributes.readableAt),
                              )}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
          <div className="absolute bottom-0 left-0 z-[2] w-full px-2 py-1.5">
            <h3 className="mb-2 line-clamp-2 text-[14px] font-semibold leading-tight text-white transition group-hover:line-clamp-4">
              {props.title}
            </h3>
            <span className="flex items-center justify-between gap-[4px] text-[11px] text-muted-foreground">
              <span className="flex items-center gap-[4px]">
                <i className="fa fa-star"></i>
                {Utils.Number.formatViews(
                  Math.round(
                    (mangaStatistics[props.id]?.rating?.bayesian || 0) * 10,
                  ) / 10,
                )}
              </span>
              <span className="flex items-center gap-[4px]">
                <i className="fa fa-comment" />
                {Utils.Number.formatViews(
                  mangaStatistics[props.id]?.comments?.repliesCount || 0,
                )}
              </span>
              <span className="flex items-center gap-[4px]">
                <i className="fa fa-heart" />
                {Utils.Number.formatViews(
                  mangaStatistics[props.id]?.follows || 0,
                )}
              </span>
            </span>
          </div>
        </div>
        <figcaption>
          <ul className="flex flex-col gap-[4px]">
            {props.chapters.slice(0, 3).map((chapter) => (
              <li
                className="flex items-center justify-between gap-x-2 text-[12px]"
                key={chapter.id}
              >
                <Link
                  href={Constants.Routes.nettrom.chapter(chapter.id)}
                  title={Utils.Mangadex.getChapterTitle(chapter)}
                  className={
                    readedChaptersId === chapter.id
                      ? "text-web-titleDisabled hover:text-web-titleLighter flex-grow overflow-hidden text-ellipsis whitespace-nowrap transition"
                      : "text-web-title hover:text-web-titleLighter flex-grow overflow-hidden text-ellipsis whitespace-nowrap transition"
                  }
                >
                  {Utils.Mangadex.getChapterTitle(chapter)}
                </Link>
                <span className="whitespace-nowrap text-base leading-[13px] text-muted-foreground">
                  {Utils.Date.formatNowDistance(
                    new Date(chapter.attributes.readableAt),
                  )
                    .replace("khoảng", "")
                    .replace("vài", "")
                    .trim() + " trước"}
                </span>
              </li>
            ))}
          </ul>
        </figcaption>
      </figure>
    </div>
  );
};

const NewUpdatesSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-[20px] lg:grid-cols-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg">
            <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[90%]" />
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="space-y-1.5">
                {Array(3)
                  .fill(0)
                  .map((_, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between gap-2"
                    >
                      <Skeleton className="h-3 w-[70%]" />
                      <Skeleton className="h-3 w-[20%]" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default function NewUpdates({
  title,
  groupId,
}: {
  title?: string;
  groupId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = Number(params?.get("page")) ?? 0;
  const [totalPage, setTotalPage] = useState(0);
  const { history } = useReadingHistory();
  const { chapters, isLoading, error, total } = useLastUpdates({
    page,
    groupId,
  });
  const { mangas, updateMangas, updateMangaStatistics } = useMangadex();
  const updates: Record<string, ExtendChapter[]> = {};

  if (chapters) {
    for (const chapter of chapters) {
      const mangaId = chapter.manga?.id;
      if (!mangaId) continue;
      if (!updates[mangaId]) {
        updates[mangaId] = [];
      }
      updates[mangaId].push(chapter);
    }
  }

  useEffect(() => {
    if (chapters?.length > 0) {
      updateMangas({
        ids: chapters.filter((c) => !!c?.manga?.id).map((c) => c.manga!.id),
      });
    }
  }, [chapters]);

  useEffect(() => {
    if (chapters?.length > 0) {
      updateMangaStatistics({
        manga: chapters.filter((c) => !!c?.manga?.id).map((c) => c.manga!.id!),
      });
    }
  }, [chapters]);

  useEffect(() => {
    if (!total) return;
    setTotalPage(Math.ceil(total / Constants.Mangadex.LAST_UPDATES_LIMIT));
  }, [total]);

  return (
    <div className="Module Module-163" id="new-updates">
      <div className="ModuleContent">
        <div className="items">
          <div className="relative">
            <h1 className="my-0 mb-5 flex items-center gap-3 text-[20px] text-[#2980b9]">
              <FaClock />
              <span>{title ?? "Truyện mới cập nhật"}</span>
            </h1>
            {/* <Link
              className="filter-icon"
              title="Tìm truyện nâng cao"
              href={routes.nettrom.search}
            >
              <i className="fa fa-filter"></i>
            </Link> */}
          </div>
          <DataLoader
            isLoading={isLoading}
            error={error}
            skeleton={<NewUpdatesSkeleton />}
          >
            <div className={`grid grid-cols-2 gap-[20px] lg:grid-cols-4`}>
              {Object.entries(updates).map(([mangaId, chapterList]) => {
                const coverArt = Utils.Mangadex.getCoverArt(mangas[mangaId]);
                const mangaTitle = Utils.Mangadex.getMangaTitle(
                  mangas[mangaId],
                );
                const readedChapters = history[mangaId];
                return (
                  <MangaTile
                    id={mangaId}
                    key={mangaId}
                    thumbnail={coverArt}
                    title={mangaTitle}
                    chapters={chapterList}
                    readedChapters={readedChapters as ReadingHistory}
                  />
                );
              })}
            </div>
          </DataLoader>
        </div>
        <Pagination
          onPageChange={(event: any) => {
            router.push(`${pathname}?page=${event.selected}#new-updates`);
          }}
          pageCount={totalPage}
          forcePage={page}
          marginPagesDisplayed={1}
          pageRangeDisplayed={2}
        />
      </div>
    </div>
  );
}
