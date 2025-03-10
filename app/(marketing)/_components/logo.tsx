import Image from "next/image";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const Logo = () => (
  <div className="flex items-center gap-x-2">
    <Image
      src="/logo.svg"
      height="40"
      width="40"
      alt="logo"
      className="dark:hidden"
    />
    <Image
      src="/logo-dark.svg"
      height="40"
      width="40"
      alt="logo"
      className="hidden dark:block"
    />
    <p className={cn("font-semibold", font.className)}>Notion</p>
  </div>
);
