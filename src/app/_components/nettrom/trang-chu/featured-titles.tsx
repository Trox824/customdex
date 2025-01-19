"use client";

import { useEffect } from "react";
import { useFeaturedTitles } from "~/app/_components/hooks/mangadex";
import { useMangadex } from "~/app/_components/contexts/mangadex";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import { Constants } from "~/app/constants";
import { FaClock, FaFire } from "react-icons/fa";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { DataLoader } from "~/app/_components/DataLoader";
import { Utils } from "~/app/_components/utils";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Skeleton } from "~/app/_components/shadcn/skeleton";
import { Manga } from "~/app/_components/types/mangadex";
export default function FeaturedTitles() {
  const { mangaList: featuredTitles, isLoading, error } = useFeaturedTitles();
  const { addMangas } = useMangadex();
  console.log(featuredTitles);
  useEffect(() => {
    if (featuredTitles.length > 0) addMangas(featuredTitles);
  }, [featuredTitles, addMangas]);

  const FeaturedTitlesSkeleton = () => {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[80%]" />
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-3 w-[40%]" />
                  <Skeleton className="h-3 w-[30%]" />
                </div>
              </div>
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-base flex items-center gap-4 text-[20px] text-[#2980b9]">
        <FaFire />
        Truyện đề cử
      </h2>
      <div className="relative">
        <DataLoader
          isLoading={isLoading}
          error={error}
          skeleton={<FeaturedTitlesSkeleton />}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay, A11y]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation={{
              nextEl: ".featured-next-btn",
              prevEl: ".featured-prev-btn",
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
              renderBullet: (index, className) => {
                return `<span class="${className}"></span>`;
              },
              el: null,
            }}
            breakpoints={{
              360: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
            }}
            loop
            className="featured-titles-swiper"
          >
            {featuredTitles.map((manga: Manga) => {
              const title = Utils.Mangadex.getMangaTitle(manga);
              return (
                <SwiperSlide key={manga.id}>
                  <div key={manga.id} className={`item group bg-cover`}>
                    <Link
                      href={Constants.Routes.nettrom.manga(manga.id)}
                      title={title}
                      className="transtion relative block h-full w-full"
                    >
                      <AspectRatio
                        ratio={Constants.Nettrom.MANGA_COVER_RATIO}
                        className="w-full overflow-hidden rounded-lg transition group-hover:shadow-lg"
                      >
                        <div className="relative h-full w-full">
                          <div className="absolute bottom-0 left-0 z-[1] h-2/5 w-full bg-gradient-to-t from-neutral-900 from-[10%] to-transparent transition-all duration-500 group-hover:h-3/5"></div>
                          <img
                            src={Utils.Mangadex.getCoverArt(manga)}
                            alt={title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[102%]"
                          />
                        </div>
                      </AspectRatio>
                      <div className="absolute bottom-0 left-0 z-[2] w-full px-3 py-2 transition-all">
                        <h3 className="mb-1 line-clamp-2 text-[16px] font-semibold leading-tight text-white group-hover:line-clamp-4">
                          {title}
                        </h3>
                        <Link
                          href={Constants.Routes.nettrom.manga(manga.id)}
                          className="text-web-title hover:text-web-titleLighter text-white transition"
                        >
                          {manga.relationships.find((r) => r.type === "author")
                            ?.attributes?.name || ""}
                        </Link>
                        <p className="time mb-0 mt-1 flex h-0 items-center gap-2 overflow-hidden text-[12px] text-muted-foreground group-hover:h-auto">
                          <FaClock />{" "}
                          <span>
                            {formatDistance(
                              new Date(manga.attributes.updatedAt),
                              new Date(),
                              { locale: vi },
                            )}{" "}
                            trước
                          </span>
                        </p>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button
            className="featured-prev-btn absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-r-lg bg-black/50 px-4 py-8 text-white transition hover:bg-black/70"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            className="featured-next-btn absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-l-lg bg-black/50 px-4 py-8 text-white transition hover:bg-black/70"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </DataLoader>
      </div>
    </div>
  );
}
