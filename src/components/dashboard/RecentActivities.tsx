
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export function RecentActivities() {
  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] md:h-[400px]">
          <p className="text-muted-foreground text-sm">
            Aqui serão exibidas as atividades recentes da loja.
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
