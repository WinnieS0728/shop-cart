import { EdgeStoreProvider } from "@/providers/edgestore";
import SmoothScrollProvider from "@/providers/smooth scroll";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";

import MySessionProvider from "@/providers/session";
import { getServerSession } from "next-auth";
import "react-loading-skeleton/dist/skeleton.css";
import "react-toastify/dist/ReactToastify.css";
import "./globals.scss";

import { authOptions } from "@/libs/next auth";
import TrpcProvider from "@/providers/trpc provider";
import Header from "@/components/layouts/header";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <SmoothScrollProvider>
        <TrpcProvider>
          <EdgeStoreProvider>
            <MySessionProvider session={session}>
              <body>
                <Header />
                <main>{children}</main>
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
              </body>
            </MySessionProvider>
          </EdgeStoreProvider>
        </TrpcProvider>
      </SmoothScrollProvider>
    </html>
  );
}
