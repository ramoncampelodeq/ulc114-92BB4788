
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
  Menu,
  Vote,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  currentPage: string;
}

export const Header = ({ currentPage }: HeaderProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: "Irmãos",
      icon: <Users className="h-5 w-5" />,
      onClick: () => {
        navigate("/brothers");
        setIsOpen(false);
      },
    },
    {
      title: "Sessões",
      icon: <CalendarDays className="h-5 w-5" />,
      onClick: () => {
        navigate("/sessions");
        setIsOpen(false);
      },
    },
    {
      title: "Presenças",
      icon: <UserCheck className="h-5 w-5" />,
      onClick: () => {
        navigate("/attendance");
        setIsOpen(false);
      },
    },
    {
      title: "Tesouraria",
      icon: <DollarSign className="h-5 w-5" />,
      onClick: () => {
        navigate("/treasury");
        setIsOpen(false);
      },
    },
    {
      title: "Enquetes",
      icon: <Vote className="h-5 w-5" />,
      onClick: () => {
        navigate("/polls");
        setIsOpen(false);
      },
    },
  ];

  return (
    <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
            alt="ULC 114 Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <h1 className="text-xl md:text-2xl font-serif text-primary">ULC 114</h1>
        </div>
        
        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-2 ml-8">
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

        {/* Menu para mobile */}
        <div className="flex md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] sm:w-[350px] pr-0">
              <SheetHeader>
                <SheetTitle className="text-left font-serif">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-2 pr-6">
                {menuItems.map((item) => (
                  <Button
                    key={item.title}
                    variant={item.title === currentPage ? "default" : "ghost"}
                    className="w-full justify-start gap-2 text-base"
                    onClick={item.onClick}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-auto md:ml-0">
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
