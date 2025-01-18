"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchManga } from "~/app/_components/hooks/mangadex";
import { useMangadex } from "~/app/_components/contexts/mangadex";
import { Utils } from "~/app/_components/utils";
import Pagination from "../Pagination";
import MangaResultsSkeleton from "./manga-results-skeleton";

export default function MangaResults() {
  const router = useRouter();
  const params = useSearchParams();
  const options = params ? Utils.Mangadex.normalizeParams(params) : {};
  const { mangaList, data, isLoading } = useSearchManga(options);
  const { updateMangaStatistics, mangaStatistics, addMangas } = useMangadex();
  const [showFullDescriptions, setShowFullDescriptions] = useState<{
    [key: string]: boolean;
  }>({});
  const offset = params?.get("offset") ? parseInt(params.get("offset")!) : 0;
  const total = data ? data.total : 0;
  const limit = params?.get("limit") ? parseInt(params.get("limit")!) : 24;
  const page = Math.floor(offset / limit);

  const goToPage = (toPage: number) => {
    options.offset = toPage * limit;
    router.push(Utils.Url.getSearchNetTromUrl(options));
  };

  useEffect(() => {
    if (mangaList.length > 0) {
      addMangas(mangaList);
      updateMangaStatistics({ manga: mangaList.map((m) => m.id) });
    }
  }, [mangaList, addMangas, updateMangaStatistics]);

  if (isLoading) return <MangaResultsSkeleton />;

  return (
    <div
      className={`Module Module-223 ${mangaList.length > 0 ? "min-h-0" : "min-h-screen"}`}
      id="results"
    >
      <div className="ModuleContent">
        <div className="items">
          <div className="grid grid-cols-2 gap-[20px] lg:grid-cols-4">
            {mangaList.map((manga) => {
              const mangaId = manga.id;

              return (
                <div className="group" key={mangaId}>
                  <figure className="clearfix">
                    <div className="relative mb-2">
                      <div className="absolute bottom-0 left-0 z-[2] w-full px-2 py-1.5">
                        <h3 className="mb-2 line-clamp-2 text-[14px] font-semibold leading-tight text-white transition group-hover:line-clamp-4">
                          {Utils.Mangadex.getMangaTitle(manga)}
                        </h3>
                        <span className="text-muted-foreground flex items-center justify-between gap-[4px] text-[11px]">
                          <span className="flex items-center gap-[4px]">
                            <i className="fa fa-star"></i>
                            {Utils.Number.formatViews(
                              Math.round(
                                (mangaStatistics[mangaId]?.rating?.bayesian ||
                                  0) * 10,
                              ) / 10,
                            )}
                          </span>
                          <span className="flex items-center gap-[4px]">
                            <i className="fa fa-comment" />
                            {Utils.Number.formatViews(
                              mangaStatistics[mangaId]?.comments
                                ?.repliesCount || 0,
                            )}
                          </span>
                          <span className="flex items-center gap-[4px]">
                            <i className="fa fa-heart" />
                            {Utils.Number.formatViews(
                              mangaStatistics[mangaId]?.follows || 0,
                            )}
                          </span>
                        </span>
                      </div>
                    </div>
                  </figure>
                </div>
              );
            })}
          </div>
        </div>
        <Pagination
          onPageChange={(event: any) => {
            goToPage(event.selected);
          }}
          pageCount={Math.floor(total / limit)}
          forcePage={page}
        />
      </div>
    </div>
  );
}
