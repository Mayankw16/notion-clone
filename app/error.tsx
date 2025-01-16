"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Error = () => (
  <div className="h-full flex flex-col items-center justify-center space-y-4">
    <Image
      src="/error.png"
      height="300"
      width="300"
      alt="Error"
      className="dark:hidden"
    />
    <Image
      src="/error-dark.png"
      height="300"
      width="300"
      alt="Error"
      className="hidden dark:block"
    />
    <h2 className="text-xl font-medium">Oops! Something went wrong</h2>
    <Button asChild>
      <Link href="/documents">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go back
      </Link>
    </Button>
  </div>
);

export default Error;
