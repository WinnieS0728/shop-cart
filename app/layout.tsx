import type { Metadata } from "next";
import SmoothScrollProvider from "@/providers/smooth scroll";
import { EdgeStoreProvider } from "@/libs/edgestore";
import { ToastContainer } from "react-toastify";


import 'react-toastify/dist/ReactToastify.css';
import "./globals.scss";
import Header from "@/components/layouts/header";

import localFont from 'next/font/local'

const myFont = localFont({
  src: '../public/fonts/ChenYuluoyan-Thin.woff2'
})

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
      <body className={myFont.className}>
        <SmoothScrollProvider>
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
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
