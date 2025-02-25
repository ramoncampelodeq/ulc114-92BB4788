
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PollResult } from "@/types/poll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PollResultsProps {
  pollId: string;
}

export function PollResults({ pollId }: PollResultsProps) {
  const { data: results } = useQuery({
    queryKey: ["poll-results", pollId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("poll_results")
        .select("*")
        .eq("poll_id", pollId);

      if (error) throw error;
      return data as PollResult[];
    },
  });

  if (!results) return null;

  const totalVotes = results.reduce((sum, result) => sum + result.vote_count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{results[0]?.poll_title}</CardTitle>
        <CardDescription>Resultados da votação</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {results.map((result) => {
            const percentage = totalVotes > 0
              ? (result.vote_count / totalVotes) * 100
              : 0;

            return (
              <div key={result.option_id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{result.option_title}</span>
                  <span className="text-muted-foreground">
                    {result.vote_count} votos ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={percentage} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
