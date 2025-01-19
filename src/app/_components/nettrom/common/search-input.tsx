"use client";

import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utils } from "~/app/_components/utils";
import useDebounce from "~/app/_components/hooks/useDebounce";
import { useSearchManga } from "~/app/_components/hooks/mangadex";
import * as Mangadex from "../../../../api/mangadex";
import { Constants } from "~/app/constants";
import { Spinner } from "@nextui-org/react";

export default function SearchInput() {
  const params = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState(params?.get("title") || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedTitle = useDebounce(title, 500);

  const { mangaList, isLoading } = useSearchManga(
    {
      title: debouncedTitle,
      includes: [
        Mangadex.Static.Includes.ARTIST,
        Mangadex.Static.Includes.AUTHOR,
        Mangadex.Static.Includes.COVER_ART,
      ],
    },
    { enable: !!debouncedTitle },
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const options = Utils.Mangadex.normalizeParams(
      params ?? (new URLSearchParams() as ReadonlyURLSearchParams),
    );
    options.title = title;
    router.push(Utils.Url.getSearchNetTromUrl(options));
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-[500px]">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div
          className={`flex items-center rounded-xl border bg-white p-2 transition-all duration-200 ${
            isFocused ? "border-primary shadow-lg" : "border-gray-200"
          }`}
          animate={{ scale: isFocused ? 1.01 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <SearchIcon className="ml-2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full border-none bg-transparent px-4 py-2 text-xl outline-none placeholder:text-gray-400"
            placeholder="Tìm truyện..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => {
              setIsOpen(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
          {title && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mr-2 rounded-full p-1 hover:bg-gray-100"
              onClick={() => setTitle("")}
              type="button"
            >
              <ClearIcon className="h-4 w-4 text-gray-400" />
            </motion.button>
          )}
        </motion.div>
      </form>

      <AnimatePresence>
        {isOpen && title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-xl"
          >
            <div className="max-h-[480px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-xl text-gray-500">
                    Đang tìm kiếm...
                  </span>
                </div>
              ) : mangaList.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {mangaList.map((manga) => {
                    const title = Utils.Mangadex.getMangaTitle(manga);
                    const altTitles = Utils.Mangadex.getMangaAltTitles(manga);
                    const cover = Utils.Mangadex.getCoverArt(manga);
                    return (
                      <motion.a
                        key={manga.id}
                        href={Constants.Routes.nettrom.manga(manga.id)}
                        className="flex gap-4 p-4 no-underline transition-colors hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <img
                          src={cover}
                          alt={title}
                          className="h-32 w-24 rounded-lg object-cover shadow-sm"
                          loading="lazy"
                        />
                        <div className="flex flex-col gap-1">
                          <h3 className="whitespace-normal text-xl font-medium text-gray-900">
                            {title}
                          </h3>
                          <p className="whitespace-normal text-xl text-gray-500">
                            {altTitles.slice(0, 2).join(", ")}
                          </p>
                          <p className="text-xs text-gray-400">
                            {manga.author?.attributes?.name || "N/A"} •{" "}
                            {manga.artist?.attributes?.name || "N/A"}
                          </p>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xl text-gray-500">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const ClearIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
