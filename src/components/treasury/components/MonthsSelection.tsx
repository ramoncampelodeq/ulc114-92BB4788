
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Month } from "../types";

const months: Month[] = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" }
];

interface MonthsSelectionProps {
  selectedMonths: number[];
  paidMonths: number[];
  onMonthToggle: (month: number) => void;
}

export function MonthsSelection({ 
  selectedMonths, 
  paidMonths, 
  onMonthToggle 
}: MonthsSelectionProps) {
  return (
    <div className="grid gap-2">
      <Label>Meses</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {months.map((month) => {
          const isPaid = paidMonths.includes(month.value);
          return (
            <div key={month.value} className="flex items-center space-x-2">
              <Checkbox
                id={`month-${month.value}`}
                checked={selectedMonths.includes(month.value) || isPaid}
                onCheckedChange={() => onMonthToggle(month.value)}
                disabled={isPaid}
              />
              <Label 
                htmlFor={`month-${month.value}`}
                className={isPaid ? "text-muted-foreground" : ""}
              >
                {month.label}
                {isPaid && " (Pago)"}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
