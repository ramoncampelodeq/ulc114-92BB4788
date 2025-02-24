
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
import { supabase } from "@/lib/supabase";

const Attendance = () => {
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["sessions-with-attendance"],
    queryFn: async () => {
      // Buscar todas as sessões
      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select(`
          *,
          attendance (
            brother_id,
            present
          )
        `)
        .order("date", { ascending: false });

      if (sessionsError) throw sessionsError;

      // Buscar todos os irmãos para referência
      const { data: brothersData, error: brothersError } = await supabase
        .from("brothers")
        .select("*");

      if (brothersError) throw brothersError;

      // Processar os dados para incluir informações de presença
      return sessionsData.map(session => ({
        ...session,
        totalPresent: session.attendance?.filter(a => a.present).length || 0,
        totalBrothers: brothersData.length
      }));
    }
  });

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Presenças</h1>
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="space-y-6">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Grau</TableHead>
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
    </div>
  );
};

export default Attendance;
