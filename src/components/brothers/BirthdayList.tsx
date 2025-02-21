
import { Brother, Relative } from "@/types/brother";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift, User, Users } from "lucide-react";
import { format } from "date-fns";

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
  const currentMonth = new Date().getMonth() + 1;

  // Get all birthdays for the current month
  const birthdays: BirthdayPerson[] = [];

  // Add brothers' birthdays
  brothers.forEach((brother) => {
    const birthDate = new Date(brother.birthDate);
    if (birthDate.getMonth() + 1 === currentMonth) {
      birthdays.push({
        id: brother.id,
        name: brother.name,
        birthDate: brother.birthDate,
        type: "brother",
      });
    }

    // Add relatives' birthdays
    brother.relatives.forEach((relative) => {
      const relativeBirthDate = new Date(relative.birthDate);
      if (relativeBirthDate.getMonth() + 1 === currentMonth) {
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
    const dayA = new Date(a.birthDate).getDate();
    const dayB = new Date(b.birthDate).getDate();
    return dayA - dayB;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5" />
        <h2 className="text-2xl font-semibold tracking-tight">
          Birthdays in {format(new Date(0, currentMonth - 1), "MMMM")}
        </h2>
      </div>

      {birthdays.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Gift className="mx-auto h-12 w-12 opacity-50 mb-2" />
              <p>No birthdays this month</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {birthdays.map((person) => (
            <Card key={person.id} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {format(new Date(person.birthDate), "d")}
                  <sup>
                    {format(new Date(person.birthDate), "do").replace(/\d/g, "")}
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
                      {person.relationship} of {person.relativeBrotherName}
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
