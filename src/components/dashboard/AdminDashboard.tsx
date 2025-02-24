
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Users } from "lucide-react";
import { Payment } from "@/types/payment";
import { Brother } from "@/types/brother";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

export function AdminDashboard() {
  const { data: recentPayments } = useQuery<Payment[]>({
    queryKey: ["recent-payments"],
    queryFn: async () => {
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
          created_at,
          brother:brothers (
            id,
            name,
            email,
            degree,
            profession,
            birth_date,
            phone
          )
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        brotherId: item.brother_id,
        brother: item.brother,
        month: item.month,
        year: item.year,
        amount: item.amount,
        status: item.status,
        paidAt: item.paid_at,
        dueDate: item.due_date,
        createdAt: item.created_at,
        updatedAt: item.created_at
      }));
    }
  });

  const { data: totalBrothers } = useQuery<number>({
    queryKey: ["total-brothers"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("brothers")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    }
  });

  const { data: totalOverdue } = useQuery<number>({
    queryKey: ["total-overdue"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("monthly_dues")
        .select("*", { count: "exact", head: true })
        .eq("status", "overdue");

      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Irmãos</CardTitle>
          <CardDescription>Total de membros ativos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBrothers || 0}</div>
        </CardContent>
        <CardFooter>
          <Link to="/brothers">
            <Button variant="ghost" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Ver todos
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mensalidades Atrasadas</CardTitle>
          <CardDescription>Total de pagamentos pendentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOverdue || 0}</div>
        </CardContent>
        <CardFooter>
          <Link to="/monthly-dues">
            <Button variant="ghost" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Ver detalhes
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
