
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
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [amount, setAmount] = useState("100");
  const [isPaid, setIsPaid] = useState(false);
  const [paidAt, setPaidAt] = useState(format(new Date(), "yyyy-MM-dd"));

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
      month: number;
      year: number;
      amount: number;
      status: string;
      paidAt?: string;
    }) => {
      const { error } = await supabase
        .from("monthly_dues")
        .insert([{
          brother_id: data.brotherId,
          month: data.month,
          year: data.year,
          amount: data.amount,
          status: data.status,
          paid_at: data.paidAt,
          due_date: format(new Date(data.year, data.month - 1, 10), "yyyy-MM-dd")
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-dues"] });
      toast({
        title: "Pagamento registrado",
        description: "O pagamento foi registrado com sucesso."
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro ao registrar pagamento",
        description: "Ocorreu um erro ao tentar registrar o pagamento.",
        variant: "destructive"
      });
    }
  });

  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const resetForm = () => {
    setSelectedBrotherId("");
    setSelectedMonth("");
    setSelectedYear(new Date().getFullYear().toString());
    setAmount("100");
    setIsPaid(false);
    setPaidAt(format(new Date(), "yyyy-MM-dd"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrotherId || !selectedMonth || !selectedYear) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    createPaymentMutation.mutate({
      brotherId: selectedBrotherId,
      month: parseInt(selectedMonth),
      year: parseInt(selectedYear),
      amount: parseFloat(amount),
      status: isPaid ? "paid" : "pending",
      paidAt: isPaid ? paidAt : undefined
    });
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
          <Label htmlFor="month">Mês</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label htmlFor="amount">Valor</Label>
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
        Salvar Pagamento
      </Button>
    </form>
  );
}
