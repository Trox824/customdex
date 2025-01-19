"use client";

import Link from "next/link";
import { api } from "~/trpc/react";

import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Constants } from "~/app/constants";
import { Utils } from "~/app/_components/utils";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import { twMerge } from "tailwind-merge";
import { useMangadex } from "~/app/_components/contexts/mangadex";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { MangadexApi } from "~/api";

interface MangaHoverCardProps {
  id: string;
  title: string;
  thumbnail: string;
  readedChaptersId: string | null;
  showFullDescription: boolean;
  description: string;
  setShowFullDescription: (value: boolean) => void;
  tags: any[];
}

export const MangaHoverCard: React.FC<MangaHoverCardProps> = ({
  id,
  title,
  thumbnail,
  readedChaptersId,
  showFullDescription,
  description,
  setShowFullDescription,
  tags,
}) => {
  const { mangas } = useMangadex();

  const { data: chapterData } = api.chapter.getChapterList.useQuery<any>({
    limit: 5,
    offset: 0,
    manga: id,
    includes: [MangadexApi.Static.Includes.SCANLATION_GROUP],
  });

  const chapters: ExtendChapter[] = (
    chapterData?.data && Array.isArray(chapterData.data) ? chapterData.data : []
  ) as ExtendChapter[];

  return (
    <HoverCardPrimitive.Root openDelay={150} closeDelay={150}>
      <HoverCardPrimitive.Trigger asChild>
        <Link title={title} href={Constants.Routes.nettrom.manga(id)}>
          <AspectRatio
            ratio={Constants.Nettrom.MANGA_COVER_RATIO}
            className="overflow-hidden rounded-lg group-hover:shadow-lg"
          >
            <div className="absolute bottom-0 left-0 z-[1] h-3/5 w-full bg-gradient-to-t from-neutral-900 from-[15%] to-transparent transition-all duration-300 group-hover:h-3/4"></div>
            <img
              src={thumbnail}
              className="lazy h-full w-full object-cover transition duration-300 group-hover:scale-[102%]"
              data-original={thumbnail}
              alt={title}
            />
          </AspectRatio>
        </Link>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Content
        className="z-50 w-[500px] rounded-lg border bg-white p-4 shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        side="right"
        align="start"
        sideOffset={5}
      >
        <div className="flex">
          <div className="w-[200px] flex-none">
            <img
              className="h-[250px] w-full rounded object-cover"
              src={thumbnail}
              alt={title}
            />
          </div>
          <div className="ml-6 max-h-[250px] flex-1 space-y-3 overflow-y-auto">
            <h3 className="line-clamp-2 text-2xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-lg text-muted-foreground">
              {Utils.Mangadex.getOriginalMangaTitle(mangas[id])}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary"
                >
                  {tag.attributes.name.en}
                </span>
              ))}
            </div>
            {description && (
              <div className="border-b border-muted-foreground pb-2">
                <p className="inline text-lg text-foreground">
                  {showFullDescription || description.length < 350
                    ? description
                    : `${description.slice(0, 350)}... `}
                  {description.length >= 350 && (
                    <button
                      className="ml-1 inline-flex text-base text-blue-500 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowFullDescription(!showFullDescription);
                      }}
                    >
                      {showFullDescription ? "Show Less" : "Show More"}
                    </button>
                  )}
                </p>
              </div>
            )}
            <div className="max-h-[250px] flex-1 space-y-2 overflow-y-auto">
              <h4 className="text-xl font-medium text-foreground">
                Latest Chapters
              </h4>
              <ul className="ml-1 space-y-1">
                {Array.isArray(chapters) &&
                  chapters.slice(0, 5).map((chapter) => (
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
                          )
                            .replace("khoảng", "")
                            .replace("vài", "")
                            .replace("hơn", "")
                            .trim() + " trước"}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  );
};
