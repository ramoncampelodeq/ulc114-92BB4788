
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { Brother } from "@/types/brother";
import { Payment } from "@/types/payment";
import { supabase } from "@/lib/supabase";

export function UserDashboard() {
  const { data: brotherData } = useQuery<Brother>({
    queryKey: ["current-brother"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("brothers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["monthly-dues"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("monthly_dues")
        .select(`
          id,
          brother_id,
          month,
          year,
          amount,
          status,
          paid_at,
          due_date,
          created_at
        `)
        .eq("brother:brothers.user_id", user.id)
        .order("year", { ascending: false })
        .order("month", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data || [];
    }
  });

  const recentPayments = payments?.slice(0, 3) || [];

  return (
    <div className="grid gap-4">
      {brotherData && (
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo, {brotherData.name}</CardTitle>
            <CardDescription>
              {brotherData.degree} 
              {brotherData.higher_degree && ` - ${brotherData.higher_degree}º`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span>{brotherData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Profissão:</span>
                <span>{brotherData.profession}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Últimos Pagamentos</CardTitle>
          <CardDescription>
            Status das suas últimas mensalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {payment.status === "paid" ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <span>
                    {format(new Date(payment.year, payment.month - 1), "MMMM yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {payment.status === "paid"
                    ? `Pago em ${format(new Date(payment.paidAt!), "dd/MM/yyyy")}`
                    : "Pendente"}
                </span>
              </div>
            ))}
            {recentPayments.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-4">
                Nenhum pagamento encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
