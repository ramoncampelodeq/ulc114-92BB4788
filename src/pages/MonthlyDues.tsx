
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { fetchMonthlyDues } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Brother } from "@/types/brother";

const MonthlyDues = () => {
  const navigate = useNavigate();
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const { data: payments, isLoading } = useQuery({
    queryKey: ["monthly-dues", selectedYear],
    queryFn: fetchMonthlyDues
  });

  // Get unique years from payments
  const years = [...new Set(payments?.map(p => p.year))].sort((a, b) => b - a);

  // Get brothers from payments
  const brothers = [...new Set(payments?.map(p => p.brothers))].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

  // Filter brothers based on search term
  const filteredBrothers = brothers?.filter(brother =>
    brother.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter payments based on selected brother and year
  const filteredPayments = payments?.filter(payment => {
    const yearMatch = payment.year.toString() === selectedYear;
    const brotherMatch = selectedBrother ? payment.brother_id === selectedBrother.id : true;
    return yearMatch && brotherMatch;
  });

  const getStatusColor = (paid: boolean) => {
    return paid ? "text-green-600" : "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Mensalidades</h1>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Mensalidades</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-[200px]">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar ano" />
            </SelectTrigger>
            <SelectContent>
              {years?.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[300px]">
          <Select
            value={selectedBrother?.id ?? ""}
            onValueChange={(value) => {
              const brother = brothers?.find(b => b.id === value);
              setSelectedBrother(brother ?? null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecionar irmão" />
            </SelectTrigger>
            <SelectContent>
              <div className="p-2">
                <Input
                  placeholder="Buscar irmão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-2"
                />
              </div>
              {filteredBrothers?.map((brother) => (
                <SelectItem key={brother.id} value={brother.id}>
                  {brother.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredPayments && filteredPayments.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Irmão</TableHead>
                <TableHead>Mês</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.brothers.name}</TableCell>
                  <TableCell>
                    {format(new Date(0, payment.month - 1), "MMMM", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{payment.year}</TableCell>
                  <TableCell>R$ {payment.amount}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(payment.paid)}>
                      {payment.paid ? "Pago" : "Pendente"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {payment.payment_date
                      ? format(new Date(payment.payment_date), "dd/MM/yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      {payment.paid ? "Ver recibo" : "Registrar pagamento"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum registro de mensalidade encontrado
        </div>
      )}
    </div>
  );
};

export default MonthlyDues;
