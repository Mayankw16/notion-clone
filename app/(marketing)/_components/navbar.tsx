"use client";

import Link from "next/link";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { Logo } from "./logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/spinner";

export const Navbar = () => {
  const scrolled = useScrollTop();
  const { isLoading, isAuthenticated } = useConvexAuth();

  return (
    <div
      className={cn(
        `z-50 fixed top-0 flex items-center w-full bg-background dark:bg-[#1F1F1F] p-6`,
        scrolled && "border-b shadow-sm dark:shadow-md"
      )}
    >
      <Logo />
      <div className="flex-1 flex items-center justify-end gap-x-2">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button size="sm">Login</Button>
          </SignInButton>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button size="sm" asChild>
              <Link href="/documents">Enter Notion</Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};
