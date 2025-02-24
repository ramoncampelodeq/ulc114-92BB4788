
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export function PaymentForm() {
  const queryClient = useQueryClient();
  const [selectedBrotherId, setSelectedBrotherId] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [amount, setAmount] = useState("100");
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);

  const { data: brothers } = useQuery({
    queryKey: ["brothers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brothers")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data || [];
    }
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: {
      brotherId: string;
      months: number[];
      year: number;
      amount: number;
      status: "pending" | "paid";
      paidAt?: string;
    }) => {
      const payments = data.months.map(month => ({
        brother_id: data.brotherId,
        month: month,
        year: data.year,
        amount: data.amount,
        status: data.status,
        paid_at: data.paidAt,
        due_date: format(new Date(data.year, month - 1, 10), "yyyy-MM-dd")
      }));

      // Check for existing payments
      const { data: existingPayments, error: checkError } = await supabase
        .from("monthly_dues")
        .select("month, year")
        .eq("brother_id", data.brotherId)
        .eq("year", data.year)
        .in("month", data.months);

      if (checkError) throw checkError;

      if (existingPayments && existingPayments.length > 0) {
        const existingMonths = existingPayments.map(p => p.month);
        const message = `Já existem pagamentos registrados para os meses: ${existingMonths.join(", ")}`;
        throw new Error(message);
      }

      // Create new payments
      const { error } = await supabase
        .from("monthly_dues")
        .insert(payments);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-dues"] });
      queryClient.invalidateQueries({ queryKey: ["personal-payments"] });
      queryClient.invalidateQueries({ queryKey: ["overdue-payments"] });
      queryClient.invalidateQueries({ queryKey: ["critical-overdue-brothers"] });
      
      toast({
        title: "Pagamentos registrados",
        description: "Os pagamentos foram registrados com sucesso."
      });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao registrar pagamentos",
        description: error.message || "Ocorreu um erro ao tentar registrar os pagamentos.",
        variant: "destructive"
      });
    }
  });

  const months = [
    { value: 1, label: "Janeiro" },
    { value: 2, label: "Fevereiro" },
    { value: 3, label: "Março" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Maio" },
    { value: 6, label: "Junho" },
    { value: 7, label: "Julho" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Setembro" },
    { value: 10, label: "Outubro" },
    { value: 11, label: "Novembro" },
    { value: 12, label: "Dezembro" }
  ];

  const resetForm = () => {
    setSelectedBrotherId("");
    setSelectedMonths([]);
    setSelectedYear(new Date().getFullYear().toString());
    setAmount("100");
    setIsPaid(false);
    setPaidAt(format(new Date(), "yyyy-MM-dd"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrotherId || selectedMonths.length === 0 || !selectedYear || !amount) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createPaymentMutation.mutate({
      brotherId: selectedBrotherId,
      months: selectedMonths,
      year: parseInt(selectedYear),
      amount: parseFloat(amount),
      status: isPaid ? "paid" : "pending",
      paidAt: isPaid ? paidAt : undefined
    });
  };

  const handleMonthToggle = (month: number) => {
    setSelectedMonths(current =>
      current.includes(month)
        ? current.filter(m => m !== month)
        : [...current, month]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="brother">Irmão</Label>
          <Select value={selectedBrotherId} onValueChange={setSelectedBrotherId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um irmão" />
            </SelectTrigger>
            <SelectContent>
              {brothers?.map((brother) => (
                <SelectItem key={brother.id} value={brother.id}>
                  {brother.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Meses</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {months.map((month) => (
              <div key={month.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`month-${month.value}`}
                  checked={selectedMonths.includes(month.value)}
                  onCheckedChange={() => handleMonthToggle(month.value)}
                />
                <Label htmlFor={`month-${month.value}`}>{month.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            min={2000}
            max={2100}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Valor por mensalidade</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPaid"
            checked={isPaid}
            onCheckedChange={(checked) => setIsPaid(checked as boolean)}
          />
          <Label htmlFor="isPaid">Mensalidade quitada</Label>
        </div>

        {isPaid && (
          <div className="grid gap-2">
            <Label htmlFor="paidAt">Data do Pagamento</Label>
            <Input
              id="paidAt"
              type="date"
              value={paidAt}
              onChange={(e) => setPaidAt(e.target.value)}
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        Salvar Pagamento{selectedMonths.length > 0 ? `s (${selectedMonths.length})` : ''}
      </Button>
    </form>
  );
}
