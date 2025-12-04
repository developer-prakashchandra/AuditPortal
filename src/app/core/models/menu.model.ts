export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
  visible?: boolean;
  command?: string;
  separator?: boolean;
}

export interface MenuData {
  items: MenuItem[];
}

