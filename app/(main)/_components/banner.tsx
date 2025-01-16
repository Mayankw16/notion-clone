import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId }).then(() =>
      router.push("/documents")
    );

    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note!",
    });
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note!",
    });
  };

  return (
    <div className="flex items-center justify-center gap-x-2 text-sm text-white bg-rose-500 p-2">
      <p>This page is in the Trash.</p>
      <Button
        size="xs"
        variant="outline"
        onClick={onRestore}
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white font-normal p-1 px-2"
      >
        Restore page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size="xs"
          variant="outline"
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white font-normal p-1 px-2"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};
