import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LCK Tracker — LCK 프로 솔로랭크 트래커",
  description:
    "LCK 프로게이머들의 솔로랭크 실시간 전적, 티어, LP를 한눈에 확인하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={`${geist.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen`}>
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">
              LCK Tracker
            </Link>
            <div className="flex gap-4 text-sm" />
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">{children}</main>
        <footer className="text-center text-xs text-gray-400 dark:text-gray-600 py-8 px-4">
          <p>
            LCK Tracker is not endorsed by Riot Games and does not reflect the
            views of Riot Games or anyone officially involved in producing or
            managing League of Legends.
          </p>
          <p className="mt-2">
            <Link
              href="https://sites.google.com/view/lck-tracker-privacy/home"
              className="underline"
            >
              개인정보 처리방침
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
