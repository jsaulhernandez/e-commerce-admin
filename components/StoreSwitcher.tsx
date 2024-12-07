"use client";

import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { ChevronsUpDown, StoreIcon } from "lucide-react";
// components
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import StoreListItem from "./StoreListItem";
import CreateNewStoreItem from "./CreateNewStoreItem";
// hooks
import { useStoreModal } from "@/hooks/useStoreModal";
// interfaces
import { IOption } from "@/data/interfaces/option.interface";
// types
import { StoreSwitcherProps } from "@/data/types";

const StoreSwitcher = ({ items }: StoreSwitcherProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filtered, setFiltered] = useState<IOption[]>([]);
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();
  const storeModal = useStoreModal();

  const formattedStores: IOption[] = items.map((i) => ({
    label: i.name,
    value: i.id,
  }));

  const currentStore = formattedStores.find((i) => i.value === storeId);

  const onStoreSelect = (store: IOption) => {
    setIsOpen(false);
    router.push(`/${store.value}`);
  };

  const handleSearchTerm = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFiltered(
      formattedStores.filter((i) =>
        i.label.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
      )
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.value
            ? formattedStores.find((s) => s.value === currentStore.value)?.label
            : "Select Store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="w-full px-2 py-1 flex items-center border rounded-md border-gray-100">
            <StoreIcon className="mr-2 h-4 w-4 min-w-4" />
            <input
              type="text"
              placeholder="Search store..."
              onChange={handleSearchTerm}
              className="flex-1 w-full outline-none"
            />
          </div>
          <CommandList>
            <CommandGroup heading="Stores">
              {searchTerm === "" ? (
                formattedStores.map((s, index) => (
                  <StoreListItem
                    store={s}
                    key={index}
                    isChecked={currentStore?.value === s.value}
                    onSelect={onStoreSelect}
                  />
                ))
              ) : filtered.length > 0 ? (
                filtered.map((s, index) => (
                  <StoreListItem
                    store={s}
                    key={index}
                    isChecked={currentStore?.value === s.value}
                    onSelect={onStoreSelect}
                  />
                ))
              ) : (
                <CommandEmpty>No Store Found</CommandEmpty>
              )}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CreateNewStoreItem
                onClick={() => {
                  setIsOpen(false);
                  storeModal.onOpen();
                }}
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreSwitcher;
