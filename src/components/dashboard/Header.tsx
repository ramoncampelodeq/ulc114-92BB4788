
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="flex h-14 md:h-16 items-center px-4 md:px-8">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
            alt="ULC 114 Logo" 
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <h1 className="text-xl md:text-2xl font-serif text-primary">ULC 114</h1>
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
}
