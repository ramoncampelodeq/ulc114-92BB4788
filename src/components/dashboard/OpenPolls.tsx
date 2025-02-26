
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Poll } from "@/types/poll";

interface OpenPollsProps {
  polls: Poll[];
}

export function OpenPolls({ polls }: OpenPollsProps) {
  const navigate = useNavigate();

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Enquetes Abertas</CardTitle>
        <CardDescription>Votações em andamento</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] md:h-[400px]">
          {polls.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Não há enquetes abertas no momento.
            </p>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="p-4 rounded-lg border cursor-pointer hover:bg-accent active:scale-95 transition-all"
                  onClick={() => navigate(`/polls/${poll.id}`)}
                >
                  <h3 className="font-medium text-base">{poll.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {poll.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
