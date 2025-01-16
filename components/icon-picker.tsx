import { useTheme } from "next-themes";
import EmojiPicker, { Theme, EmojiStyle } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
}

export const IconPicker = ({ onChange, children }: IconPickerProps) => {
  const { resolvedTheme } = useTheme();

  const currentTheme = resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none">
        <EmojiPicker
          height={350}
          theme={currentTheme}
          emojiStyle={EmojiStyle.NATIVE}
          onEmojiClick={(data) => onChange(data.emoji)}
        ></EmojiPicker>
      </PopoverContent>
    </Popover>
  );
};
