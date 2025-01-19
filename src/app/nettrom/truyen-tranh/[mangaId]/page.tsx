import TopTitles from "~/app/_components/nettrom/trang-chu/top-titles";
import Manga from "~/app/_components/nettrom/truyen-tranh/manga";

export default function TruyenTranh({
  params,
}: {
  params: { mangaId: string };
}) {
  return (
    <div className="mt-20 grid gap-[40px] lg:grid-cols-[2fr_1fr]">
      <div>{/* <Manga mangaId={params.mangaId} /> */}</div>
      <div>
        <TopTitles />
      </div>
    </div>
  );
}
