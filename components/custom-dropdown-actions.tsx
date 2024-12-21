import { MoreVertical } from "lucide-react";
//components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// interfaces
import { IDropdown } from "@/data/interfaces/dropdown.interface";

const CustomDropdownActions = ({
  menuTriggerLabel = "Open menu",
  menuLabel = "Actions",
  items,
}: IDropdown) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h8 w-8 p-0" variant={"ghost"}>
          <span className="sr-only">{menuTriggerLabel}</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>

        <DropdownMenuSeparator />
        {items.map((i) => (
          <DropdownMenuItem
            onClick={i.onClick}
            key={i.label}
            className="cursor-pointer"
          >
            {i.icon}
            {i.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdownActions;
