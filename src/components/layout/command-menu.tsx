"use client";

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useKeyboardShortcut } from "@/hooks";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CommandMenuItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onSelect?: () => void;
}

interface CommandMenuProps {
  items?: CommandMenuItem[];
}

export function CommandMenu({ items = [] }: CommandMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useKeyboardShortcut("k", () => setOpen(true), { meta: true });

  const handleSelect = (item: CommandMenuItem) => {
    if (item.onSelect) {
      item.onSelect();
    } else if (item.href) {
      router.push(item.href);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-2 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Search...</span>
        <kbd className="pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {items.length > 0 && (
            <CommandGroup heading="Navigation">
              {items.map((item, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect(item)}
                >
                  {item.icon}
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
