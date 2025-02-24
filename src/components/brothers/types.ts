
import { ReactNode } from "react";

export interface NavigationItem {
  title: string;
  icon: ReactNode;
  onClick: () => void;
}
