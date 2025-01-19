"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaClock } from "react-icons/fa";
import { useMangadex } from "~/app/_components/contexts/mangadex";
import { DataLoader } from "~/app/_components/DataLoader";
import { Utils } from "~/app/_components/utils";
import useReadingHistory from "~/app/_components/hooks/useReadingHistory";
import { ReadingHistory } from "~/app/_components/types";
import Pagination from "../Pagination";
import { Skeleton } from "~/app/_components/shadcn/skeleton";
import { MangaHoverCard } from "~/app/_components/nettrom/MangaHoverCard";
import { BsGrid, BsGrid3X3, BsListUl } from "react-icons/bs";
import { api } from "~/trpc/react";
import { MangadexApi } from "~/api";

interface MangaTileProps {
  id: string;
  title: string;
  thumbnail: string;
  chapters: any[];
  readedChapters: ReadingHistory;
  description: string;
  tags: any[];
  className?: string;
}

const MangaTile = ({
  id,
  title,
  thumbnail,
  description,
  tags,
  className,
}: MangaTileProps) => {
  const { mangaStatistics } = useMangadex();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const stats = mangaStatistics[id];
  const renderStats = () => (
    <span className="flex items-center justify-between gap-[4px] text-[11px] text-muted-foreground">
      <span className="flex items-center gap-[4px]">
        <i className="fa fa-star"></i>
        {Utils.Number.formatViews(
          Math.round((stats?.rating?.bayesian || 0) * 10) / 10,
        )}
      </span>
      <span className="flex items-center gap-[4px]">
        <i className="fa fa-comment" />
        {Utils.Number.formatViews(stats?.comments?.repliesCount || 0)}
      </span>
      <span className="flex items-center gap-[4px]">
        <i className="fa fa-heart" />
        {Utils.Number.formatViews(stats?.follows || 0)}
      </span>
    </span>
  );

  return (
    <div className="group">
      <figure className="clearfix">
        <div className="relative mb-2">
          <MangaHoverCard
            id={id}
            title={title}
            thumbnail={thumbnail}
            tags={tags}
            readedChaptersId={null}
            showFullDescription={isDescriptionExpanded}
            description={description}
            setShowFullDescription={setIsDescriptionExpanded}
          />

          <div className="absolute bottom-0 left-0 z-[2] w-full px-2 py-1.5">
            <h3 className="mb-2 line-clamp-2 text-[14px] font-semibold leading-tight text-white transition group-hover:line-clamp-4">
              {title}
            </h3>
            {renderStats()}
          </div>
        </div>
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
            </div>
          </div>
        ))}
    </div>
  );
};

const LayoutToggle = ({
  layout,
  setLayout,
}: {
  layout: "grid" | "large" | "table";
  setLayout: (layout: "grid" | "large" | "table") => void;
}) => {
  return (
    <div className="inline-flex rounded-lg bg-secondary p-1">
      <button
        onClick={() => setLayout("large")}
        className={`rounded-md px-3 py-1.5 text-sm transition-all ${
          layout === "large"
            ? "bg-white text-black shadow"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BsGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setLayout("grid")}
        className={`rounded-md px-3 py-1.5 text-sm transition-all ${
          layout === "grid"
            ? "bg-white text-black shadow"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BsGrid3X3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => setLayout("table")}
        className={`rounded-md px-3 py-1.5 text-sm transition-all ${
          layout === "table"
            ? "bg-white text-black shadow"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <BsListUl className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function NewUpdates({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = Number(params?.get("page")) ?? 0;
  const [totalPage, setTotalPage] = useState(0);
  const { history } = useReadingHistory();
  const [layout, setLayout] = useState<"grid" | "large" | "table">("grid");
  const { updateMangaStatistics } = useMangadex();

  const { data, isLoading, error } = api.mangadex.getSearchManga.useQuery<any>({
    limit: 32,
    offset: page * 32,
    availableTranslatedLanguage: ["vi"],
    contentRating: [
      MangadexApi.Static.MangaContentRating.SAFE,
      MangadexApi.Static.MangaContentRating.SUGGESTIVE,
      MangadexApi.Static.MangaContentRating.EROTICA,
      MangadexApi.Static.MangaContentRating.PORNOGRAPHIC,
    ],
    order: { latestUploadedChapter: MangadexApi.Static.Order.DESC },
    includes: [MangadexApi.Static.Includes.COVER_ART],
    hasAvailableChapters: "1",
  });

  const mangas =
    data?.data?.map((manga: any) => {
      const relationships = manga.relationships || [];
      const coverArtRel = relationships.find(
        (rel: any) => rel.type === "cover_art",
      );
      const fileName = coverArtRel?.attributes?.fileName;
      const coverUrl = fileName
        ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
        : null;

      return {
        ...manga,
        coverFileName: fileName,
        coverUrl,
      };
    }) || [];

  useEffect(() => {
    if (!mangas?.length) return;
    const ids = mangas
      .filter((manga: any) => manga?.id)
      .map((manga: any) => manga.id);

    if (ids.length > 0) {
      updateMangaStatistics({ manga: ids });
    }
  }, [mangas, updateMangaStatistics]);

  useEffect(() => {
    if (!data?.total) return;
    const limit = 30;
    setTotalPage(Math.ceil(data.total / limit));
  }, [data?.total]);

  return (
    <div className="Module Module-163" id="new-updates">
      <div className="ModuleContent">
        <div className="items">
          <div className="relative mb-5 flex items-center justify-between">
            <h1 className="my-0 flex items-center gap-3 text-[20px] text-[#2980b9]">
              <FaClock />
              <span>{title ?? "Truyện mới cập nhật"}</span>
            </h1>
            <LayoutToggle layout={layout} setLayout={setLayout} />
          </div>
          <DataLoader
            isLoading={isLoading}
            error={error}
            skeleton={<NewUpdatesSkeleton />}
          >
            <div
              className={`${
                layout === "table"
                  ? "divide-y divide-gray-200 border-b border-t border-gray-200"
                  : `grid gap-[20px] ${
                      layout === "grid"
                        ? "grid-cols-2 lg:grid-cols-4"
                        : "grid-cols-1 lg:grid-cols-2"
                    }`
              }`}
            >
              {mangas.map((manga: any) => (
                <div
                  key={manga.id}
                  className={`${
                    layout === "table"
                      ? "flex items-center gap-4 py-4 transition-colors hover:bg-gray-50"
                      : ""
                  }`}
                >
                  {layout === "table" ? (
                    <>
                      <div className="h-40 w-32 flex-shrink-0">
                        <img
                          src={manga.coverUrl}
                          alt={manga.attributes.title.en}
                          className="h-full w-full rounded object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-[600px] flex-grow">
                        <h3 className="text-2xl font-medium text-gray-900">
                          {manga.attributes.title.en}
                        </h3>
                        <p className="text-xl text-gray-500">
                          Latest chapter • Updated {/* Add formatted date */}
                        </p>
                      </div>
                    </>
                  ) : (
                    <MangaTile
                      id={manga.id}
                      title={manga.attributes.title.en}
                      thumbnail={manga.coverUrl}
                      description={
                        manga.attributes.description.vi ||
                        manga.attributes.description.en
                      }
                      chapters={[]}
                      tags={manga.attributes.tags}
                      readedChapters={history[manga.id] as ReadingHistory}
                      className={`transition-colors hover:bg-gray-100`}
                    />
                  )}
                </div>
              ))}
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
