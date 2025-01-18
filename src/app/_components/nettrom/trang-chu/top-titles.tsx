"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { MangadexApi } from "~/api";
import { useMangadex } from "~/app/_components/contexts/mangadex";
import { useSearchManga } from "~/app/_components/hooks/mangadex";
import { FaClock, FaHeart, FaStar, FaTrophy } from "react-icons/fa";
import { ExtendManga } from "~/app/_components/types/mangadex";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/app/_components/shadcn/tabs";
import { DataLoader } from "~/app/_components/DataLoader";
import { Utils } from "~/app/_components/utils";
import { Constants } from "~/app/constants";
import { twMerge } from "tailwind-merge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/app/_components/shadcn/hover-card";
import { Skeleton } from "~/app/_components/shadcn/skeleton";

const loadingText = "Đang tải dữ liệu bảng xếp hạng...";

const MangaTile = (props: {
  manga: ExtendManga;
  title: string;
  order: number;
  hideCounter?: boolean;
  counter?: number;
  icon?: React.ReactNode;
}) => {
  const inTop3 = useMemo(() => {
    return props.order < 3;
  }, [props.order]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <li className="relative flex w-full gap-[8px] py-2" key={props.manga.id}>
      <div className="absolute left-4 top-0 flex h-[64px] w-8 items-center justify-center text-right">
        <span
          className={twMerge(
            `fn-order text-[64px] font-black leading-none text-muted-foreground/30 pos${props.order + 1}`,
            inTop3 && "text-muted-foreground",
          )}
        >
          {props.order + 1}
        </span>
      </div>
      <div className="flex grow items-start gap-4 pl-12">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link
              className="relative w-[64px] shrink-0 rounded shadow-[-5px_0_20px_rgba(0,0,0,0.5)]"
              title={props.title}
              href={Constants.Routes.nettrom.manga(props.manga.id)}
            >
              <AspectRatio ratio={1} className="overflow-hidden rounded">
                <img
                  className="lazy h-full w-full object-cover"
                  src={Utils.Mangadex.getCoverArt(props.manga)}
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
                  src={Utils.Mangadex.getCoverArt(props.manga)}
                  alt={props.title}
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  Total: {props.manga.attributes.lastChapter || "??"}
                </div>
              </div>
              <div className="ml-6 max-h-[250px] flex-1 space-y-6 overflow-y-auto">
                <h3 className="line-clamp-2 text-2xl font-semibold text-foreground">
                  {props.title}
                </h3>
                <p className="text-lg text-muted-foreground">
                  {Utils.Mangadex.getOriginalMangaTitle(props.manga)}
                </p>
                {props.manga.attributes.description?.en && (
                  <div className="border-b border-muted-foreground pb-2">
                    <p className="inline text-lg text-foreground">
                      {showFullDescription
                        ? props.manga.attributes.description.en
                        : `${props.manga.attributes.description.en.slice(0, 150)}... `}
                      <button
                        className="ml-1 inline-flex text-base text-blue-500 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowFullDescription(!showFullDescription);
                        }}
                      >
                        {showFullDescription ? "Show Less" : "Show More"}
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <div className="grow">
          <h3>
            <Link
              href={Constants.Routes.nettrom.manga(props.manga.id)}
              className="line-clamp-2 font-semibold transition hover:no-underline"
            >
              {props.title}
            </Link>
          </h3>
          {!props.hideCounter && (
            <span className="mt-1 flex shrink-0 items-center gap-2 text-muted-foreground">
              {props.icon}
              {Utils.Number.formatViews(props.counter || 0)}
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

const TopTitlesSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array(7)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="relative flex items-start gap-4 pl-12">
            <Skeleton className="absolute left-4 top-0 h-16 w-8 bg-muted/5" />
            <Skeleton className="h-16 w-16 shrink-0 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[85%]" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-[20%]" />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default function TopTitles({ groupId }: { groupId?: string }) {
  const {
    mangaList: topMangaList,
    isLoading: topMangaListLoading,
    error: topMangaListError,
  } = useSearchManga({
    limit: 20,
    includes: [MangadexApi.Static.Includes.COVER_ART],
    order: {
      followedCount: MangadexApi.Static.Order.DESC,
    },
    contentRating: [
      MangadexApi.Static.MangaContentRating.SAFE,
      MangadexApi.Static.MangaContentRating.SUGGESTIVE,
    ],
    hasAvailableChapters: "true",
    availableTranslatedLanguage: ["vi"],
    group: groupId ? groupId : undefined,
  });
  const {
    mangaList: newMangaList,
    isLoading: newMangaListLoading,
    error: newMangaListError,
  } = useSearchManga({
    limit: 20,
    includes: [MangadexApi.Static.Includes.COVER_ART],
    order: {
      createdAt: MangadexApi.Static.Order.DESC,
    },
    contentRating: [
      MangadexApi.Static.MangaContentRating.SAFE,
      MangadexApi.Static.MangaContentRating.SUGGESTIVE,
    ],
    hasAvailableChapters: "true",
    availableTranslatedLanguage: ["vi"],
    group: groupId ? groupId : undefined,
  });
  const {
    mangaList: favoriteMangaList,
    isLoading: favoriteMangaListLoading,
    error: favoriteMangaListError,
  } = useSearchManga({
    limit: 20,
    includes: [MangadexApi.Static.Includes.COVER_ART],
    order: {
      rating: MangadexApi.Static.Order.DESC,
    },
    contentRating: [
      MangadexApi.Static.MangaContentRating.SAFE,
      MangadexApi.Static.MangaContentRating.SUGGESTIVE,
    ],
    hasAvailableChapters: "true",
    availableTranslatedLanguage: ["vi"],
    group: groupId ? groupId : undefined,
  });

  const { addMangas, updateMangaStatistics, mangaStatistics } = useMangadex();

  useEffect(() => {
    if (topMangaList.length > 0) {
      addMangas(topMangaList);
      updateMangaStatistics({ manga: topMangaList.map((m) => m.id) });
    }
  }, [topMangaList]);

  useEffect(() => {
    if (favoriteMangaList.length > 0) {
      addMangas(favoriteMangaList);
      updateMangaStatistics({ manga: favoriteMangaList.map((m) => m.id) });
    }
  }, [favoriteMangaList]);

  return (
    <div className="">
      <div className="">
        <div className="">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-web-title flex items-center gap-4 text-[20px] font-medium">
              <FaTrophy />
              Bảng xếp hạng tháng này
            </h2>
          </div>
          <Tabs defaultValue="top" className="w-full">
            <TabsList className="mb-4 grid h-[48px] grid-cols-3 space-x-2 border border-muted-foreground bg-white/10 p-2">
              <TabsTrigger
                value="top"
                className="flex h-full items-center gap-3 rounded text-[12px] hover:bg-gray-300 data-[state=active]:text-white"
              >
                <FaStar />
                Top
              </TabsTrigger>
              <TabsTrigger
                value="favorite"
                className="flex h-full items-center gap-3 rounded text-[12px] hover:bg-gray-300 data-[state=active]:text-white"
              >
                <FaHeart />
                Yêu thích
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="flex h-full items-center gap-3 rounded text-[12px] hover:bg-gray-300 data-[state=active]:text-white"
              >
                <FaClock />
                Mới
              </TabsTrigger>
            </TabsList>
            <TabsContent value="top">
              <DataLoader
                isLoading={topMangaListLoading}
                error={topMangaListError}
                loadingText={loadingText}
                skeleton={<TopTitlesSkeleton />}
              >
                <div className="h-[700px] overflow-y-auto">
                  <ul className="flex flex-col gap-4">
                    {topMangaList.map((manga, index) => {
                      const title = Utils.Mangadex.getMangaTitle(manga);
                      return (
                        <MangaTile
                          order={index}
                          key={manga.id}
                          title={title}
                          manga={manga}
                          icon={<FaStar />}
                          counter={mangaStatistics[manga.id]?.follows || 0}
                        ></MangaTile>
                      );
                    })}
                  </ul>
                </div>
              </DataLoader>
            </TabsContent>
            <TabsContent value="favorite">
              <DataLoader
                isLoading={favoriteMangaListLoading}
                error={favoriteMangaListError}
                loadingText={loadingText}
                skeleton={<TopTitlesSkeleton />}
              >
                <div className="h-[700px] overflow-y-auto">
                  <ul className="flex flex-col gap-4">
                    {favoriteMangaList.map((manga, index) => {
                      const title = Utils.Mangadex.getMangaTitle(manga);
                      return (
                        <MangaTile
                          order={index}
                          key={manga.id}
                          title={title}
                          manga={manga}
                          icon={<FaHeart />}
                          counter={
                            Math.round(
                              (mangaStatistics[manga.id]?.rating?.bayesian ||
                                0) * 10,
                            ) / 10
                          }
                        ></MangaTile>
                      );
                    })}
                  </ul>
                </div>
              </DataLoader>
            </TabsContent>
            <TabsContent value="new">
              <DataLoader
                isLoading={newMangaListLoading}
                error={newMangaListError}
                loadingText={loadingText}
                skeleton={<TopTitlesSkeleton />}
              >
                <div className="h-[700px] overflow-y-auto">
                  <ul className="flex flex-col gap-4">
                    {newMangaList.map((manga, index) => {
                      const title = Utils.Mangadex.getMangaTitle(manga);
                      return (
                        <MangaTile
                          order={index}
                          key={manga.id}
                          title={title}
                          manga={manga}
                          hideCounter
                        ></MangaTile>
                      );
                    })}
                  </ul>
                </div>
              </DataLoader>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
