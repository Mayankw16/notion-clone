import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { ImageIcon, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { useEdgeStore } from "@/lib/edgestore";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "./ui/skeleton";

interface CoverProps {
  url?: string;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const params = useParams();
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);

  const onRemove = async () => {
    if (url) await edgestore.publicFiles.delete({ url });
    removeCoverImage({ id: params.documentId as Id<"documents"> });
  };

  return (
    <div
      className={cn(
        "group relative h-[35vh]",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {url && <Image className="object-cover" fill src={url} alt="cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => coverImage.onReplace(url)}
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Change cover
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onRemove}
            className="text-xs text-muted-foreground"
          >
            <X className="w-4 h-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return <Skeleton className="w-full h-[35vh] rounded-none" />;
};
