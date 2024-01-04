import type { Metadata } from "next";
import SmoothScrollProvider from "@/providers/smooth scroll";
import { EdgeStoreProvider } from "@/libs/edgestore";
import { ToastContainer } from "react-toastify";
import localFont from "next/font/local";
import Header from "@/components/layouts/header";
import ReactQueryProvider from "@/providers/react query";


import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";


const handWritingFont = localFont({
  src: "../public/fonts/ChenYuluoyan-Thin.woff2",
});

export const metadata: Metadata = {
  title: {
    template: "%s | shop",
    default: "shop",
  },
  description: "shop cart practice next14 tailwindcss mongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <ReactQueryProvider>
            <EdgeStoreProvider>
              <Header />
              {children}
              <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </EdgeStoreProvider>
          </ReactQueryProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
