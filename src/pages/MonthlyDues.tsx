
import { useState } from "react";
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

const MonthlyDues = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("personal");
  
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("is_admin");
      if (error) return false;
      return data || false;
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Tesouraria</h1>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
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

        <TabsContent value="personal" className="mt-6">
          <PersonalPayments />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="register" className="mt-6">
              <PaymentForm />
            </TabsContent>

            <TabsContent value="overdue" className="mt-6">
              <OverdueList />
            </TabsContent>

            <TabsContent value="critical" className="mt-6">
              <CriticalOverdueReport />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default MonthlyDues;
