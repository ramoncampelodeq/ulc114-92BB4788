
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const MonthlyDues = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("personal");
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
      if (data?.role === "admin" && selectedTab === "personal") {
        setSelectedTab("register");
      }
    };

    checkAdminStatus();
  }, [session?.user?.id]);

  useEffect(() => {
    if (!isAdmin && selectedTab !== "personal") {
      setSelectedTab("personal");
    }
  }, [isAdmin, selectedTab]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Tesouraria</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="personal">Minhas Mensalidades</TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="register">Cadastrar Pagamento</TabsTrigger>
              <TabsTrigger value="overdue">Inadimplentes</TabsTrigger>
              <TabsTrigger value="critical">Relatório Crítico</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="personal">
          <PersonalPayments />
        </TabsContent>

        {isAdmin && (
          <>
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
      </Tabs>
    </div>
  );
};

export default MonthlyDues;
