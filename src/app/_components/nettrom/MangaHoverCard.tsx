"use client";

import Link from "next/link";

import { ExtendChapter } from "~/app/_components/types/mangadex";
import { Constants } from "~/app/constants";
import { Utils } from "~/app/_components/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/app/_components/shadcn/hover-card";
import { AspectRatio } from "~/app/_components/shadcn/aspect-ratio";
import { twMerge } from "tailwind-merge";
import { useMangadex } from "~/app/_components/contexts/mangadex";

interface MangaHoverCardProps {
  id: string;
  title: string;
  thumbnail: string;
  chapters: ExtendChapter[];
  readedChaptersId: string | null;
  showFullDescription: boolean;
  setShowFullDescription: (value: boolean) => void;
}

export const MangaHoverCard: React.FC<MangaHoverCardProps> = ({
  id,
  title,
  thumbnail,
  chapters,
  readedChaptersId,
  showFullDescription,
  setShowFullDescription,
}) => {
  const { mangas } = useMangadex();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link title={title} href={Constants.Routes.nettrom.manga(id)}>
          <AspectRatio
            ratio={Constants.Nettrom.MANGA_COVER_RATIO}
            className="overflow-hidden rounded-lg group-hover:shadow-lg"
          >
            <div className="absolute bottom-0 left-0 z-[1] h-3/5 w-full bg-gradient-to-t from-neutral-900 from-[15%] to-transparent transition-all duration-500 group-hover:h-3/4"></div>
            <img
              src={thumbnail}
              className="lazy h-full w-full object-cover transition duration-500 group-hover:scale-[102%]"
              data-original={thumbnail}
              alt={title}
            />
          </AspectRatio>
        </Link>
      </HoverCardTrigger>
      <HoverCardContent
        className="border-border bg-background w-[500px] rounded-lg p-6"
        side="right"
      >
        <div className="flex">
          <div className="w-[200px] flex-none">
            <img
              className="h-[250px] w-full rounded object-cover"
              src={thumbnail}
              alt={title}
            />
            <div className="text-muted-foreground mt-2 text-sm">
              Total: {mangas[id]?.attributes.lastChapter || "??"}
            </div>
          </div>
          <div className="ml-6 max-h-[250px] flex-1 space-y-6 overflow-y-auto">
            <h3 className="text-foreground line-clamp-2 text-2xl font-semibold">
              {title}
            </h3>
            <p className="text-muted-foreground text-lg">
              {Utils.Mangadex.getOriginalMangaTitle(mangas[id])}
            </p>
            {mangas[id]?.attributes.description?.en && (
              <div className="border-muted-foreground border-b pb-2">
                <p className="text-foreground inline text-lg">
                  {showFullDescription
                    ? mangas[id].attributes.description.en
                    : `${mangas[id].attributes.description.en.slice(0, 150)}... `}
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
            <div className="ml-6 max-h-[250px] flex-1 space-y-6 overflow-y-auto">
              <h4 className="text-foreground text-lg font-medium">Chapters</h4>
              <ul className="space-y-1">
                {Array.isArray(chapters) &&
                  chapters.map((chapter) => (
                    <li key={chapter.id} className="text-lg">
                      <Link
                        href={Constants.Routes.nettrom.chapter(chapter.id)}
                        className={twMerge(
                          "hover:text-primary transition",
                          readedChaptersId === chapter.id
                            ? "text-muted-foreground"
                            : "text-foreground",
                        )}
                      >
                        {Utils.Mangadex.getChapterTitle(chapter)}
                        <span className="text-muted-foreground ml-2 text-sm">
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
  );
};
