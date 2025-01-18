"use client";

import Link from "next/link";

import useReadingHistory from "~/app/_components/hooks/useReadingHistory";
import { Constants } from "~/app/constants";
export default function HistoryList() {
  const { history, removeHistory } = useReadingHistory();

  return (
    <div className="items visited-comics-page Module Module-273">
      <div className="row visited-list">
        {Object.entries(history).map(([mangaId, manga]) => (
          <div className="item" key={mangaId}>
            <figure className="clearfix">
              <div className="image">
                <Link
                  title={manga.mangaTitle}
                  href={Constants.Routes.nettrom.manga(mangaId)}
                >
                  <img
                    className="lazy center"
                    alt={manga.mangaTitle}
                    data-original={manga.cover}
                    src={manga.cover}
                  />
                </Link>
                <div className="view">
                  <a
                    className="visited-remove"
                    onClick={() => removeHistory(mangaId)}
                  >
                    <i className="fa fa-times" /> Xóa
                  </a>
                </div>
              </div>
              <figcaption>
                <h3>
                  <Link
                    title={manga.mangaTitle}
                    href={Constants.Routes.nettrom.manga(mangaId)}
                  >
                    {manga.mangaTitle}
                  </Link>
                </h3>
                <ul>
                  <li className="chapter clearfix">
                    <Link
                      href={Constants.Routes.nettrom.chapter(manga.chapterId)}
                    >
                      Đọc tiếp {manga.chapterTitle}{" "}
                      <i className="fa fa-angle-right" />
                    </Link>
                  </li>
                </ul>
              </figcaption>
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}
