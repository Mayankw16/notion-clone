import { useCoverImage } from "@/hooks/use-cover-image";
import { Dialog, DialogContent } from "../ui/dialog";
import { AlertDialogHeader } from "../ui/alert-dialog";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { Id } from "@/convex/_generated/dataModel";
import { SingleImageDropzone } from "../single-image-dropzone";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { edgestore } = useEdgeStore();

  const coverImage = useCoverImage();

  const onClose = () => {
    console.log("OnClose");
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setFile(file);
      setIsSubmitting(true);

      const res = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImage.url },
      });

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <AlertDialogHeader>
          <h2 className="font-semibold text-lg text-center">Cover Image</h2>
        </AlertDialogHeader>
        <SingleImageDropzone
          value={file}
          onChange={onChange}
          disabled={isSubmitting}
          className="outline-none"
        />
      </DialogContent>
    </Dialog>
  );
};
