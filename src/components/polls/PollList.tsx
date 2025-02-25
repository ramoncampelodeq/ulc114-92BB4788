
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Poll } from "@/types/poll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Lock, Unlock } from "lucide-react";

export function PollList() {
  const { isAdmin } = useIsAdmin();

  const { data: polls, isLoading } = useQuery({
    queryKey: ["polls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("polls")
        .select(`
          *,
          poll_options (
            id,
            title
          ),
          votes (
            id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as (Poll & {
        poll_options: { id: string; title: string }[];
        votes: { id: string }[];
      })[];
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {polls?.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle>{poll.title}</CardTitle>
                <CardDescription>{poll.description}</CardDescription>
              </div>
              {poll.type === "secret" ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Unlock className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={poll.status === "open" ? "default" : "secondary"}>
                  {poll.status === "open" ? "Aberta" : "Fechada"}
                </Badge>
                <Badge variant="outline">
                  {poll.votes?.length || 0} votos
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Criada em{" "}
                {format(new Date(poll.created_at), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </div>
              {poll.status === "open" && (
                <Button
                  className="w-full"
                  onClick={() => {
                    // TODO: Implementar votação
                  }}
                >
                  Votar
                </Button>
              )}
              {isAdmin && poll.status === "open" && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      const { error } = await supabase.rpc("close_poll", {
                        poll_id: poll.id,
                      });
                      if (error) throw error;
                    } catch (error) {
                      console.error("Erro ao fechar enquete:", error);
                    }
                  }}
                >
                  Fechar Enquete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
