
import { Brother } from "@/types/brother";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift, User, Users } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface BirthdayPerson {
  id: string;
  name: string;
  birthDate: string;
  type: "brother" | "relative";
  relativeBrotherName?: string;
  relationship?: string;
}

interface BirthdayListProps {
  brothers: Brother[];
}

export default function BirthdayList({ brothers }: BirthdayListProps) {
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );

  // Months array in Portuguese
  const months = [
    { value: "1", label: "Janeiro" },
    { value: "2", label: "Fevereiro" },
    { value: "3", label: "Março" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Maio" },
    { value: "6", label: "Junho" },
    { value: "7", label: "Julho" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ];

  // Get all birthdays for the selected month
  const birthdays: BirthdayPerson[] = [];

  // Add brothers' birthdays
  brothers.forEach((brother) => {
    const birthDate = parseISO(brother.birth_date);
    if (birthDate.getMonth() + 1 === parseInt(selectedMonth)) {
      birthdays.push({
        id: brother.id,
        name: brother.name,
        birthDate: brother.birth_date,
        type: "brother",
      });
    }

    // Add relatives' birthdays
    brother.relatives.forEach((relative) => {
      const relativeBirthDate = parseISO(relative.birthDate);
      if (relativeBirthDate.getMonth() + 1 === parseInt(selectedMonth)) {
        birthdays.push({
          id: relative.id,
          name: relative.name,
          birthDate: relative.birthDate,
          type: "relative",
          relativeBrotherName: brother.name,
          relationship: relative.relationship,
        });
      }
    });
  });

  // Sort birthdays by day of month
  birthdays.sort((a, b) => {
    const dayA = parseISO(a.birthDate).getDate();
    const dayB = parseISO(b.birthDate).getDate();
    return dayA - dayB;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-2xl font-semibold tracking-tight">Aniversariantes</h2>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o mês" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {birthdays.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Gift className="mx-auto h-12 w-12 opacity-50 mb-2" />
              <p>Nenhum aniversário neste mês</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {birthdays.map((person) => (
            <Card key={person.id} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {parseISO(person.birthDate).getDate()}
                  <sup>
                    {format(parseISO(person.birthDate), "do", { locale: ptBR })
                      .replace(/[0-9]/g, "")
                      .replace("º", "°")}
                  </sup>
                </CardTitle>
                {person.type === "brother" ? (
                  <User className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Users className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="font-medium">{person.name}</p>
                  {person.type === "relative" && (
                    <p className="text-sm text-muted-foreground">
                      {person.relationship} de {person.relativeBrotherName}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
