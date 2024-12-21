export interface IDropdown {
  menuTriggerLabel?: string;
  menuLabel?: string;
  items: IDropdownItem[];
}

export interface IDropdownItem {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}
