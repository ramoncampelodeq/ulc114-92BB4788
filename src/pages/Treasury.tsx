
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PaymentForm } from "@/components/treasury/PaymentForm";
import { OverdueList } from "@/components/treasury/OverdueList";
import { CriticalOverdueReport } from "@/components/treasury/CriticalOverdueReport";
import { PersonalPayments } from "@/components/treasury/PersonalPayments";
import { CashControl } from "@/components/treasury/cash/CashControl";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Treasury = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("cash");
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    },
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Erro ao verificar perfil:", error);
        return;
      }

      setIsAdmin(data?.role === "admin");
      if (data?.role !== "admin") {
        setSelectedTab("personal");
      }
    };

    checkAdminStatus();
  }, [session?.user?.id]);

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
    <div className="min-h-screen bg-background flex flex-col">
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
                variant={item.title === "Tesouraria" ? "default" : "ghost"}
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

      <div className="container mx-auto py-8 px-4 flex-1">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="w-full">
            {isAdmin && (
              <>
                <TabsTrigger value="cash">Controle de Caixa</TabsTrigger>
                <TabsTrigger value="register">Cadastrar Pagamento</TabsTrigger>
                <TabsTrigger value="overdue">Inadimplentes</TabsTrigger>
                <TabsTrigger value="critical">Relatório Crítico</TabsTrigger>
              </>
            )}
            <TabsTrigger value="personal">Minhas Mensalidades</TabsTrigger>
          </TabsList>

          {isAdmin && (
            <>
              <TabsContent value="cash">
                <CashControl />
              </TabsContent>
              <TabsContent value="register">
                <PaymentForm />
              </TabsContent>
              <TabsContent value="overdue">
                <OverdueList />
              </TabsContent>
              <TabsContent value="critical">
                <CriticalOverdueReport />
              </TabsContent>
            </>
          )}
          <TabsContent value="personal">
            <PersonalPayments />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Treasury;
