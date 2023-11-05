"use client";

import {
    Check,
    CheckIcon,
    ChevronDown,
    ChevronsUpDown,
    PlusCircle,
    Store as StoreIcon,
} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useParams, useRouter } from "next/navigation";

import { Button } from "./button";
import { PopoverTriggerProps } from "@radix-ui/react-popover";
import { Store } from "@prisma/client";
import { StoreModal } from "../modals/store-modal";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

interface StoreSwitcherProps extends PopoverTriggerProps {
    items: Store[];
}
export default function StoreSwitcher({
    className,
    items = [],
}: StoreSwitcherProps) {
    const storeModal = useStoreModal();
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id,
    }));

    const currentStore = formattedItems.find(
        (item) => item.value === params.storeId
    );

    const onStoreSelect = (store: { value: string; label: string }) => {
        setOpen(false);
        router.push(`/${store.value}`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    size={"sm"}
                    role="combobox"
                    aria-expanded={open}
                    aria-label="select a store"
                    className={cn("w-[200px] justify-between", className)}
                >
                    <StoreIcon className="mr-2 w-4 h-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            store.value === currentStore?.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />

                    <CommandList>
                        <CommandGroup>
                            <CommandItem
                                onSelect={() => {
                                    setOpen(false);
                                    storeModal.onOpen();
                                }}
                            >
                                <PlusCircle className="mr-2 w-5 h-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
