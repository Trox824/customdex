"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";

import { useMangadex } from "~/app/_components/contexts/mangadex";
import { AppApi, MangadexApi } from "~/api";
import Iconify from "~/app/_components/iconify";
import { useCheckFollowed } from "~/app/_components/hooks/core";
import { Utils } from "~/app/_components/utils";
import ChapterList from "./chapter-list";
import { Constants } from "~/app/constants";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import { Button } from "../Button";
import { DataLoader } from "~/app/_components/DataLoader";
import { useChapterList } from "~/app/_components/hooks/mangadex";
import { useRouter } from "next/router";
import FirstChapterButton from "./first-chapter-button";
import ExternalLinks from "./external-links";
import Markdown from "../Markdown";

export default function Manga({
  mangaId,
  initialManga,
}: {
  mangaId: string;
  initialManga?: any;
}) {
  const { mangas, updateMangas, updateMangaStatistics, mangaStatistics } =
    useMangadex();
  const manga = mangas[mangaId] || initialManga;
  const { data: followed, mutate } = useCheckFollowed(mangaId);
  const title = Utils.Mangadex.getMangaTitle(manga);
  const altTitles = Utils.Mangadex.getMangaAltTitles(manga);
  const url = Constants.Routes.nettrom.manga(mangaId);
  const [page, setPage] = useState(0);
  const { data, chapters, error } = useChapterList(mangaId, {
    offset: page * Constants.Mangadex.CHAPTER_LIST_LIMIT,
  });
  const chapterListData = useMemo(() => data?.data, [data]);
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogin = () => {
    router.push(Constants.Routes.loginWithRedirect(window.location.pathname));
  };

  const followManga = useCallback(async () => {
    try {
      const response = await AppApi.Series.followOrUnfollow(mangaId);
      const followed = response.series_uuid !== undefined;
      toast(followed ? "Theo dõi thành công" : "Bỏ theo dõi thành công");
      await mutate();
    } catch {
      toast("Đã có lỗi xảy ra");
    }
  }, [mutate, mangaId]);

  useEffect(() => {
    updateMangas({
      ids: [mangaId],
      includes: [
        MangadexApi.Static.Includes.ARTIST,
        MangadexApi.Static.Includes.AUTHOR,
      ],
    });
    updateMangaStatistics({ manga: [mangaId] });
  }, [mangaId]);

  return (
    <DataLoader
      isLoading={!manga}
      loadingText="Đang tải thông tin truyện..."
      error={error}
    >
      <article id="" className="dark:text-foreground">
        <div className="mb-[16px]">
          <h1 className="font-base my-0 mb-4 text-center text-[25px] leading-tight">
            {title}
          </h1>
          <span className="text-muted-foreground block text-center">
            <i className="fa fa-clock mr-2" />
            <span className="italic">
              <span className="hidden lg:inline">Cập nhật lúc: </span>
              <span className="">
                {manga?.attributes?.updatedAt
                  ? Utils.Date.formatNowDistance(
                      new Date(manga?.attributes?.updatedAt),
                    )
                      .replace("khoảng", "")
                      .replace("vài", "")
                      .trim() + " trước"
                  : ""}
              </span>
            </span>
          </span>
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-10">
          <div className="">
            <div className="relative w-full">
              <AspectRatio
                className="overflow-hidden rounded-lg shadow-lg"
                ratio={Constants.Nettrom.MANGA_COVER_RATIO}
              >
                <img
                  className="h-full w-full object-cover"
                  src={Utils.Mangadex.getCoverArt(manga)}
                  alt={title}
                />
              </AspectRatio>
            </div>
          </div>
          <div>
            <ul className="[&>li]:grid [&>li]:lg:grid-cols-[1fr_2fr]">
              {altTitles.length > 0 && (
                <li className="">
                  <p className="name text-muted-foreground mb-2 lg:mb-0">
                    <i className="fa fa-plus-square mr-2"></i> Tên khác
                  </p>
                  <p className="other-name inline-flex flex-wrap gap-4 pl-10 lg:pl-0">
                    {altTitles.map((altTitle: any, idx: any) => {
                      return <span key={idx}>{altTitle}</span>;
                    })}
                  </p>
                </li>
              )}
              <li className="author">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-user mr-2"></i> Tác giả
                </p>
                <p className="pl-10 lg:pl-0">
                  {manga?.author?.attributes
                    ? manga?.author?.attributes.name
                    : "N/A"}{" "}
                  <span className="text-muted-foreground">/</span>{" "}
                  {manga?.artist?.attributes
                    ? manga?.artist?.attributes.name
                    : "N/A"}
                </p>
              </li>
              <li className="status">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-rss mr-2"></i> Tình trạng
                </p>
                <p className="pl-10 lg:pl-0">
                  {Utils.Mangadex.translateStatus(manga?.attributes.status)}
                </p>
              </li>
              <li className="kind">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-tags mr-2"></i> Thể loại
                </p>
                <p className="pl-10 lg:pl-0">
                  {manga?.attributes.tags.map((tag: any, idx: any) => (
                    <>
                      <Link
                        key={tag.id}
                        href={`${Constants.Routes.nettrom.search}?includedTags=${tag.id}`}
                        className="text-web-title hover:text-web-titleLighter transition"
                      >
                        {tag.attributes.name.en}
                      </Link>
                      {idx !== manga?.attributes.tags.length - 1 && (
                        <span
                          key={"divider_" + idx}
                          className="text-muted-foreground"
                        >
                          ,{" "}
                        </span>
                      )}
                    </>
                  ))}
                </p>
              </li>
              <li className="">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-eye mr-2"></i> Lượt xem
                </p>
                <p className="pl-10 lg:pl-0">N/A</p>
              </li>
              <li className="">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-chain mr-2"></i> Nguồn
                </p>
                {manga && (
                  <ExternalLinks
                    links={manga.attributes.links}
                    mangaId={manga.id}
                  />
                )}
              </li>
              <li className="rating">
                <p className="name text-muted-foreground mb-2 lg:mb-0">
                  <i className="fa fa-star mr-2"></i> Đánh giá
                </p>
                <p className="text-muted-foreground inline-flex w-full justify-center gap-8 pl-10 lg:pl-0">
                  <span>
                    <i className="fa fa-star mr-2"></i>
                    <span className="block sm:inline">
                      <span className="text-foreground">
                        {mangaStatistics[mangaId]?.rating.bayesian.toFixed(2) ||
                          10}
                      </span>
                      <span className="mx-2">/</span>
                      <span itemProp="bestRating">10</span>
                    </span>
                  </span>
                  <span>
                    <i className="fa fa-heart mr-2" />
                    <span className="text-foreground block sm:inline">
                      {Utils.Number.formatViews(
                        mangaStatistics[mangaId]?.follows || 0,
                      )}
                    </span>
                  </span>
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div className="detail-info mb-10">
          <div className="mt-4 grid sm:grid-cols-[1fr_2fr] sm:gap-10">
            <div></div>
            <div className="grid flex-wrap gap-4 sm:flex sm:grid-cols-2">
              <FirstChapterButton mangaId={mangaId} />
              <Button
                className="w-full border-red-500 text-red-500 hover:bg-red-300/10 hover:text-red-500 sm:w-auto"
                icon={
                  <Iconify icon={followed ? "fa:times-circle" : "fa:heart"} />
                }
                variant={"outline"}
                onClick={followManga}
              >
                <span>{followed ? "Bỏ theo dõi" : "Theo dõi"}</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="detail-content mb-10">
          <h2 className="font-base mb-4 flex items-center gap-4 border-b-2 border-[#2980b9] pb-1 text-[20px] text-[#2980b9]">
            <i className="fa fa-pen"></i>
            <span>Nội dung</span>
          </h2>

          <div className="w-full">
            <Markdown
              content={
                (isExpanded
                  ? manga?.attributes?.description.vi ||
                    manga?.attributes?.description.en ||
                    ""
                  : (
                      manga?.attributes?.description.vi ||
                      manga?.attributes?.description.en ||
                      ""
                    ).slice(0, 300)) +
                (isExpanded ||
                (
                  manga?.attributes?.description.vi ||
                  manga?.attributes?.description.en ||
                  ""
                ).length <= 300
                  ? ""
                  : isExpanded
                    ? ` [Thu gọn]`
                    : "... [Xem thêm]")
              }
              onClick={(event) => {
                if (
                  event?.target instanceof HTMLElement &&
                  (event.target.textContent === "[Xem thêm]" ||
                    event.target.textContent === "[Thu gọn]")
                ) {
                  setIsExpanded(!isExpanded);
                }
              }}
            />
          </div>
        </div>
        <ChapterList
          mangaId={mangaId}
          page={page}
          onPageChange={setPage}
          data={chapterListData}
          items={chapters}
        />
      </article>
    </DataLoader>
  );
}
