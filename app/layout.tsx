"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Wrapper from "./Provider/Wrapper";
import LeftSideBar from "./components/LeftSideBar";
import RightSideBar from "./components/RightSideBar";
import { usePathname } from "next/navigation";
import { Context } from "./context/Context";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const isAuthPage =
    pathName === "/pages/login" || pathName === "/pages/register";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Wrapper>
          <Context>
            <Toaster position="top-center" />

            <div className="w-full">
              {isAuthPage ? (
                <div className="w-full">{children}</div>
              ) : (
                <div className="w-full flex gap-1 overflow-y-hidden md:overflow-y-auto">
                  <div className="w-[10%] md:w-[20%]">
                    <LeftSideBar />
                  </div>

                  <div className="w-[80%] md:w-[60%]">{children}</div>
                  <div className="w-[10%] md:w-[20%]">
                    <RightSideBar />
                  </div>
                </div>
              )}
            </div>
          </Context>
        </Wrapper>
      </body>
    </html>
  );
}
