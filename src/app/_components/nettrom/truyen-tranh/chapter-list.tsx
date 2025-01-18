import Link from "next/link";

import { Utils } from "~/app/_components/utils";
import { Constants } from "~/app/constants";
import { DataLoader } from "~/app/_components/DataLoader";
import { ChapterList, ExtendChapter } from "~/app/_components/types/mangadex";
import Pagination from "../Pagination";

export default function ListChapter({
  mangaId,
  ...props
}: {
  mangaId: string;
  onPageChange?: (page: number) => void;
  page: number;
  data?: ChapterList;
  items: ExtendChapter[];
}) {
  return (
    <div id="nt_listchapter">
      <h2 className="font-base mb-4 flex items-center gap-4 border-b-2 border-[#2980b9] pb-1 text-[20px] text-[#2980b9]">
        <i className="fa fa-list"></i>
        <span>Danh sách chương</span>
      </h2>
      <DataLoader
        isLoading={!props.data}
        loadingText="Đang tải danh sách chương"
        error={null}
      >
        <div className="rounded-xl p-4">
          <div className="heading text-muted-foreground grid grid-cols-[5fr_4fr_3fr] pb-4">
            <div className="no-wrap pl-4">Tên chương</div>
            <div className="no-wrap text-center">Cập nhật</div>
            <div className="no-wrap pr-4 text-right">Nhóm dịch</div>
          </div>
          <nav className="rounded-xl border px-4">
            <ul className="flex flex-col gap-2 py-2 text-[12px]">
              {props.items.map((chapter, index) => (
                <li
                  key={chapter.id}
                  className={`grid grid-cols-[5fr_4fr_3fr] gap-2 py-2 ${index < props.items.length - 1 ? "border-b border-dashed border-gray-400" : ""}`}
                >
                  <div className="" key={chapter.id}>
                    <Link
                      className="text-web-title hover:text-web-titleLighter transition"
                      href={Constants.Routes.nettrom.chapter(chapter.id)}
                    >
                      {Utils.Mangadex.getChapterTitle(chapter)}
                    </Link>
                  </div>
                  <div className="no-wrap text-muted-foreground text-center">
                    {Utils.Date.formatDateTime(
                      new Date(chapter.attributes.readableAt),
                    )}
                  </div>
                  {chapter.scanlation_group?.attributes && (
                    <Link
                      href={Constants.Routes.nettrom.scanlationGroup(
                        chapter.scanlation_group.id,
                      )}
                      className="text-web-title hover:text-web-titleLighter text-right transition"
                    >
                      {chapter.scanlation_group.attributes.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </DataLoader>
      <div className="flex items-center justify-between gap-4">
        <Pagination
          onPageChange={(event: any) => {
            props.onPageChange?.(event.selected);
          }}
          pageCount={
            Math.floor(
              (props.data?.total || 0) / Constants.Mangadex.CHAPTER_LIST_LIMIT,
            ) + 1
          }
          forcePage={props.page}
        />
        <p className="text-muted-foreground mb-0 ml-auto py-4">
          Đã hiển thị{" "}
          <span className="text-foreground">
            {(props.data?.offset || 0) + (props.data?.data.length || 0)} /{" "}
            {props.data?.total}
          </span>{" "}
          chương
        </p>
      </div>
    </div>
  );
}
