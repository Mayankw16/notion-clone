import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps {
  initialData: Doc<"documents">;
}

export const Title = ({ initialData }: TitleProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const update = useMutation(api.documents.update);

  const [title, setTitle] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);

  const enableInput = () => {
    setTitle(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    update({ id: initialData._id, title: e.target.value || "Untitled" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") disableInput();
  };

  return (
    <div className="flex-1 flex items-center gap-x-1 min-w-0">
      {!!initialData.icon && <p className="shrink-0">{initialData.icon}</p>}
      {isEditing ? (
        <Input
          ref={inputRef}
          onBlur={disableInput}
          value={title}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="h-7 px-2 flex-1 focus-visible:ring-transparent focus-visible:border-none"
        />
      ) : (
        <div className="flex-1 flex items-center overflow-hidden min-w-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={enableInput}
            className="h-auto p-1 min-w-0 justify-start max-w-fit"
            asChild
          >
            <span className="flex-1 min-w-0">
              <span className="truncate">{initialData.title}</span>
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

Title.Skeleton = () => <Skeleton className="flex-1 rounded-md h-8" />;
