
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  currentPage: string;
}

export const Header = ({ currentPage }: HeaderProps) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Irmãos",
      icon: <Users className="h-5 w-5" />,
      onClick: () => navigate("/brothers"),
    },
    {
      title: "Sessões",
      icon: <CalendarDays className="h-5 w-5" />,
      onClick: () => navigate("/sessions"),
    },
    {
      title: "Presenças",
      icon: <UserCheck className="h-5 w-5" />,
      onClick: () => navigate("/attendance"),
    },
    {
      title: "Tesouraria",
      icon: <DollarSign className="h-5 w-5" />,
      onClick: () => navigate("/treasury"),
    },
  ];

  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
            alt="ULC 114 Logo" 
            className="h-10 w-10"
          />
          <h1 className="text-2xl font-serif text-primary">ULC 114</h1>
        </div>
        
        <div className="flex items-center space-x-2 ml-8">
          {menuItems.map((item) => (
            <Button
              key={item.title}
              variant={item.title === currentPage ? "default" : "ghost"}
              className="flex items-center gap-2"
              onClick={item.onClick}
            >
              {item.icon}
              {item.title}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
