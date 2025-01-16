"use client";

import { Cover } from "@/components/cover";
import { Toolbar } from "@/components/toolbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  let document: Doc<"documents"> | undefined | null;

  try {
    document = useQuery(api.documents.getById, { id: params.documentId });
  } catch (error) {
    if (
      (error instanceof Error &&
        error.message.includes("does not match validator")) ||
      (error instanceof ConvexError && error.data.code === 404)
    )
      document = null;
    else throw error;
  }

  const update = useMutation(api.documents.update);

  const onChange = (content: string) =>
    update({ id: params.documentId, content });

  if (document === undefined) return <DocumentIdPage.Skeleton />;

  if (document === null) return <DocumentIdPage.NotFound />;

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="mx-auto md:max-w-3xl lg:max-w-4xl">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </div>
  );
};

DocumentIdPage.Skeleton = () => (
  <div>
    <Cover.Skeleton />
    <div className="mx-auto md:max-w-3xl lg:max-w-4xl mt-10">
      <div className="space-y-4 pl-12">
        <Skeleton className="h-20 w-[80%]" />
        <Skeleton className="h-10 w-[50%]" />
        <Skeleton className="h-10 w-[70%]" />
        <Skeleton className="h-10 w-[60%]" />
        <Skeleton className="h-10 w-[50%]" />
      </div>
    </div>
  </div>
);

DocumentIdPage.NotFound = () => (
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
    <h2 className="text-xl font-medium">Oops! Document Not Found</h2>
    <p className="text-sm text-muted-foreground pb-3">
      Create a new document to bring your ideas to life.
    </p>
    <Button asChild>
      <Link href="/documents">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go back
      </Link>
    </Button>
  </div>
);

export default DocumentIdPage;
