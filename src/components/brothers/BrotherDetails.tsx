
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brother } from "@/types/brother";

interface BrotherDetailsProps {
  brother: Brother;
}

export function BrotherDetails({ brother }: BrotherDetailsProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{brother.name}</CardTitle>
        <CardDescription>{brother.profession}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Data de Nascimento
            </h3>
            <p>{formatDate(brother.birth_date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Grau</h3>
            <p>{brother.degree}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Contato
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{brother.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Telefone</p>
              <p>{brother.phone}</p>
            </div>
          </div>
        </div>

        {brother.higher_degree && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Grau Filosófico
            </h3>
            <p>{brother.higher_degree}º</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
