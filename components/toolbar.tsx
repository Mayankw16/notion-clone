import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { ElementRef, useRef, useState } from "react";
import TextAreaAutoSize from "react-textarea-autosize";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import { ImageIcon, Smile, X } from "lucide-react";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useMediaQuery } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setValue(initialData.title);
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    update({
      id: initialData._id,
      title: e.target.value || "Untitled",
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon: string) =>
    update({
      id: initialData._id,
      icon,
    });

  const onRemoveIcon = () =>
    removeIcon({
      id: initialData._id,
    });

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            size="icon"
            variant="outline"
            onClick={onRemoveIcon}
            className={cn(
              "text-xs text-muted-foreground rounded-full transition",
              !isMobile && "opacity-0 group-hover/icon:opacity-100"
            )}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div
        className={cn(
          "flex items-center gap-x-1 py-4",
          !isMobile && "opacity-0 group-hover:opacity-100"
        )}
      >
        {!initialData.icon && !preview && (
          <IconPicker onChange={onIconSelect}>
            <Button
              size="sm"
              variant="outline"
              className="text-xs text-muted-foreground"
            >
              <Smile className="w-4 h-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            size="sm"
            variant="outline"
            onClick={coverImage.onOpen}
            className="text-xs text-muted-foreground"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Add cover
          </Button>
        )}
      </div>
      {isEditing && !preview ? (
        <TextAreaAutoSize
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={onChange}
          className="text-5xl w-full bg-transparent font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF] resize-none"
        />
      ) : (
        <div
          onClick={enableInput}
          className="pb-3 text-5xl font-bold break-words outline-none text-[#3F3F3F] dark:text-[#CFCFCF]"
        >
          {initialData.title}
        </div>
      )}
    </div>
  );
};
