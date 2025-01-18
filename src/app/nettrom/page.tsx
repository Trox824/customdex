import { Suspense } from "react";
import FeaturedTitles from "~/app/_components/nettrom/trang-chu/featured-titles";
import NewUpdates from "~/app/_components/nettrom/trang-chu/new-updated-titles";
import ReadingHistory from "~/app/_components/nettrom/trang-chu/reading-history";
import TopTitles from "~/app/_components/nettrom/trang-chu/top-titles";

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col gap-[40px] rounded-lg bg-white/70 p-4">
        <FeaturedTitles />
        <div className="grid gap-[40px] lg:grid-cols-[2fr_1fr]">
          <div>
            <NewUpdates />
          </div>
          <div className="flex flex-col gap-[20px]">
            <ReadingHistory />
            <TopTitles />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
