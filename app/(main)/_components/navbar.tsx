import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { Title } from "./title";
import { Menu } from "./menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Banner } from "./banner";
import { Publish } from "./publish";
import { ConvexError } from "convex/values";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  let document: Doc<"documents"> | undefined | null;

  try {
    document = useQuery(api.documents.getById, {
      id: params.documentId as Id<"documents">,
    });
  } catch (error: any) {
    if (
      (error instanceof Error &&
        error.message.includes("does not match validator")) ||
      (error instanceof ConvexError && error.data.code === 404)
    )
      document = null;
    else throw error;
  }

  if (document === undefined) return <Navbar.Skeleton />;

  if (document === null) return null;

  return (
    <>
      <nav className="flex items-center bg-background dark:bg-[#1F1F1F] px-3 py-2">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="w-6 h-6 text-muted-foreground mr-4 shrink-0"
          />
        )}
        <Title initialData={document} />
        {!document.isArchived && (
          <div className="flex items-center gap-x-2 shrink-0">
            <Publish
              documentId={document._id}
              isPublished={document.isPublished}
            />
            <Menu documentId={document._id} />
          </div>
        )}
      </nav>
      {document && document.isArchived && <Banner documentId={document._id} />}
    </>
  );
};

Navbar.Skeleton = () => (
  <nav className="flex items-center gap-x-2 bg-background dark:bg-[#1F1F1F] px-3 py-2">
    <Skeleton className="h-8 w-8" />
    <Title.Skeleton />
    <div className="flex items-center gap-x-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-8 w-8" />
    </div>
  </nav>
);
