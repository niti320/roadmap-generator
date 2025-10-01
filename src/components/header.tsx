
"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex justify-center flex-1 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-headline font-bold sm:inline-block">
              roadmap-generator
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
