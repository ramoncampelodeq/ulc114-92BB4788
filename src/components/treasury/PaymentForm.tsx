
import { useQuery } from "@tanstack/react-query";
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
import { usePaymentForm } from "./hooks/usePaymentForm";
import { MonthsSelection } from "./components/MonthsSelection";

export function PaymentForm() {
  const {
    selectedBrotherId,
    setSelectedBrotherId,
    selectedYear,
    setSelectedYear,
    amount,
    setAmount,
    isPaid,
    setIsPaid,
    paidAt,
    setPaidAt,
    selectedMonths,
    setSelectedMonths,
    createPaymentMutation,
  } = usePaymentForm();

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

        <MonthsSelection
          selectedMonths={selectedMonths}
          onMonthToggle={handleMonthToggle}
        />

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
