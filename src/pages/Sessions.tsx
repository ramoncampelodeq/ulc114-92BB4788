import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, UserCheck } from "lucide-react";
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
import { AttendanceForm } from "@/components/attendance/AttendanceForm";

const Sessions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

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
      console.log("Creating session with data:", data);
      
      const { error } = await supabase
        .from("sessions")
        .insert([data]);

      if (error) {
        console.error("Error creating session:", error);
        throw error;
      }

      toast({
        title: "Sessão criada com sucesso!",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error in handleCreateSession:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar sessão",
        description: error.message,
      });
    }
  };

  const handleFileUpload = async (sessionId: string, file: File) => {
    try {
      setIsUploading(sessionId);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await fetch(
        'https://nxoixikuzrofjmvacsfz.supabase.co/functions/v1/upload-minutes',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer upload da ata');
      }

      toast({
        title: "Ata enviada com sucesso!",
      });

      refetch();
    } catch (error: any) {
      console.error('Error uploading minutes:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar ata",
        description: error.message,
      });
    } finally {
      setIsUploading(null);
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
                <TableHead>Ações</TableHead>
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
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Presenças
                      </Button>
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
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id={`file-${session.id}`}
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(session.id, file);
                              }
                            }}
                          />
                          <label
                            htmlFor={`file-${session.id}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
                          >
                            <Upload className="h-4 w-4" />
                            {isUploading === session.id ? "Enviando..." : "Anexar PDF"}
                          </label>
                        </div>
                      )}
                    </div>
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

      {selectedSession && (
        <AttendanceForm
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
};

export default Sessions;
