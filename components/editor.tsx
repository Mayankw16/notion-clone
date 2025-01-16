"use client";

import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { useEdgeStore } from "@/lib/edgestore";
import { useTheme } from "next-themes";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect, useRef, useState } from "react";
import { PartialBlock } from "@blocknote/core";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const previousImagesRef = useRef<string[]>([]);

  const handleUploadImage = async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  };

  const handleDeleteImage = async (url: string) => {
    await edgestore.publicFiles.delete({ url });
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    uploadFile: handleUploadImage,
  });

  const extractImageUrls = (document: PartialBlock[]) => {
    const images: string[] = [];

    const traverse = (node: PartialBlock) => {
      if (node.type === "image" && node.props?.url) images.push(node.props.url);
      if (node.children) node.children.forEach(traverse);
    };

    document.forEach(traverse);
    return images;
  };

  const handleContentChange = () => {
    const content = JSON.stringify(editor.document);
    onChange(content);

    const currentImages = extractImageUrls(editor.document);
    setExistingImages(currentImages);
  };

  useEffect(() => {
    const currentImages = extractImageUrls(editor.document);
    setExistingImages(currentImages);

    previousImagesRef.current = existingImages;
  }, [initialContent]);

  useEffect(() => {
    const removedImages = previousImagesRef.current.filter(
      (url) => !existingImages.includes(url)
    );

    removedImages.forEach((url) => handleDeleteImage(url));

    previousImagesRef.current = existingImages;
  }, [existingImages]);

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onChange={handleContentChange}
    />
  );
};

export default Editor;
