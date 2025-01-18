import { Metadata, ResolvingMetadata } from "next";
import { ChapterContextProvider } from "~/app/_components/contexts/chapter";
import { MangadexApi } from "~/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ChapterContextProvider>
      <div className="row">
        <div className="full-width col-sm-12">{children}</div>
      </div>
    </ChapterContextProvider>
  );
}
