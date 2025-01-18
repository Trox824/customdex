"use client";

import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { MangadexContextProvider } from "~/app/_components/contexts/mangadex";
import Gtag from "~/app/_components/gtag";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "@fortawesome/fontawesome-free/css/all.css";
export const LayoutWrapper = ({
  children,
  ...props
}: PropsWithChildren & {
  id: string;
}) => {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body data-layout-id={props.id}>
        <MangadexContextProvider>{children}</MangadexContextProvider>
        <ToastContainer />
        <Gtag />
      </body>
    </html>
  );
};
