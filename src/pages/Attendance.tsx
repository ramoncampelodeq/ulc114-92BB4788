
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
  Download,
  ArrowLeft,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brother } from "@/types/brother";
import { AttendanceReport } from "@/components/attendance/AttendanceReport";
import { Input } from "@/components/ui/input";

const Attendance = () => {
  const navigate = useNavigate();
  const [selectedDegree, setSelectedDegree] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions-with-attendance", selectedDegree, selectedType, selectedPeriod],
    queryFn: async () => {
      let query = supabase
        .from("sessions")
        .select(`
          *,
          attendance (
            brother_id,
            present
          )
        `)
        .order("date", { ascending: false });

      if (selectedDegree !== "all") {
        query = query.eq("degree", selectedDegree);
      }

      if (selectedType !== "all") {
        query = query.eq("type", selectedType);
      }

      if (selectedPeriod !== "all") {
        const monthsAgo = subMonths(new Date(), parseInt(selectedPeriod));
        query = query.gte("date", monthsAgo.toISOString());
      }

      const { data: sessionsData, error: sessionsError } = await query;

      if (sessionsError) throw sessionsError;

      const { data: brothersData, error: brothersError } = await supabase
        .from("brothers")
        .select("*");

      if (brothersError) throw brothersError;

      return sessionsData.map(session => ({
        ...session,
        totalPresent: session.attendance?.filter(a => a.present).length || 0,
        totalBrothers: brothersData.length,
        date: session.date
      }));
    }
  });

  const { data: brothers } = useQuery({
    queryKey: ["brothers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brothers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    }
  });

  const chartData = sessions?.map(session => ({
    date: format(new Date(session.date), "dd/MM"),
    presença: (session.totalPresent / session.totalBrothers) * 100
  })).reverse();

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ordinaria":
        return "Ordinária";
      case "administrativa":
        return "Administrativa";
      case "branca":
        return "Branca";
      case "magna":
        return "Magna";
      default:
        return type;
    }
  };

  const handleExport = () => {
    if (!sessions) return;

    const csvContent = [
      ["Data", "Grau", "Tipo", "Presentes", "Total de Irmãos", "% Presença"].join(","),
      ...sessions.map(session => {
        const attendancePercentage = (session.totalPresent / session.totalBrothers) * 100;
        return [
          format(new Date(session.date), "dd/MM/yyyy"),
          session.degree,
          session.type,
          session.totalPresent,
          session.totalBrothers,
          `${attendancePercentage.toFixed(1)}%`
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "presenças.csv";
    link.click();
  };

  const filteredBrothers = brothers?.filter(brother =>
    brother.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Presenças</h1>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      </div>
    );
  }

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
                variant={item.title === "Presenças" ? "default" : "ghost"}
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

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Presenças</h1>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="w-[200px]">
            <Select
              value={selectedDegree}
              onValueChange={setSelectedDegree}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por grau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os graus</SelectItem>
                <SelectItem value="aprendiz">Aprendiz</SelectItem>
                <SelectItem value="companheiro">Companheiro</SelectItem>
                <SelectItem value="mestre">Mestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <Select
              value={selectedType}
              onValueChange={setSelectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="ordinaria">Ordinária</SelectItem>
                <SelectItem value="administrativa">Administrativa</SelectItem>
                <SelectItem value="branca">Branca</SelectItem>
                <SelectItem value="magna">Magna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[200px]">
            <Select
              value={selectedPeriod}
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo período</SelectItem>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Último ano</SelectItem>
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

        {sessions && sessions.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border">
              <h2 className="text-lg font-semibold mb-4">Evolução das Presenças</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="presença"
                      stroke="#0ea5e9"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Grau</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Presentes</TableHead>
                    <TableHead>% Presença</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => {
                    const attendancePercentage = (session.totalPresent / session.totalBrothers) * 100;
                    
                    return (
                      <TableRow key={session.id}>
                        <TableCell>
                          {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>
                          {session.degree === "aprendiz"
                            ? "Aprendiz"
                            : session.degree === "companheiro"
                            ? "Companheiro"
                            : "Mestre"}
                        </TableCell>
                        <TableCell>
                          {getTypeLabel(session.type)}
                        </TableCell>
                        <TableCell>
                          {session.totalPresent} de {session.totalBrothers} irmãos
                        </TableCell>
                        <TableCell>
                          {attendancePercentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum registro de presença encontrado
          </div>
        )}

        <AttendanceReport
          brother={selectedBrother}
          isOpen={!!selectedBrother}
          onClose={() => setSelectedBrother(null)}
        />
      </div>
    </div>
  );
};

export default Attendance;
