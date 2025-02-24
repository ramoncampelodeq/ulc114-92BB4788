
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Session, SessionFormData } from "@/types/session";
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
import { useToast } from "@/components/ui/use-toast";
import { SessionForm } from "@/components/sessions/SessionForm";

const Sessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar sessões",
          description: error.message,
        });
        throw error;
      }

      return data as Session[];
    },
  });

  const handleCreateSession = async (data: SessionFormData) => {
    try {
      const { error } = await supabase.from("sessions").insert([data]);

      if (error) throw error;

      toast({
        title: "Sessão criada com sucesso!",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar sessão",
        description: error.message,
      });
    }
  };

  const getDegreeLabel = (degree: string) => {
    switch (degree) {
      case "aprendiz":
        return "Aprendiz";
      case "companheiro":
        return "Companheiro";
      case "mestre":
        return "Mestre";
      default:
        return degree;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sessões</h1>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sessões</h1>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      {sessions && sessions.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Grau</TableHead>
                <TableHead className="max-w-[300px]">Agenda</TableHead>
                <TableHead>Ata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    {format(new Date(session.date), "dd 'de' MMMM 'de' yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell>{session.time}</TableCell>
                  <TableCell>{getDegreeLabel(session.degree)}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {session.agenda}
                  </TableCell>
                  <TableCell>
                    {session.minutes_url ? (
                      <a
                        href={session.minutes_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Ver PDF
                      </a>
                    ) : (
                      <span className="text-muted-foreground">
                        Não disponível
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma sessão encontrada
        </div>
      )}

      <SessionForm
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateSession}
      />
    </div>
  );
};

export default Sessions;
