
import { Brother } from "@/types/brother";
import { Payment, MonthlyPayment } from "@/types/payment";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useState } from "react";

interface PaymentFormProps {
  brother: Brother;
  payments: MonthlyPayment[];
  onSave: (payments: MonthlyPayment[]) => void;
  onCancel: () => void;
}

export default function PaymentForm({
  brother,
  payments,
  onSave,
  onCancel,
}: PaymentFormProps) {
  const [updatedPayments, setUpdatedPayments] = useState<MonthlyPayment[]>(payments);

  const handlePaymentToggle = (month: number, year: number) => {
    setUpdatedPayments(
      updatedPayments.map((payment) =>
        payment.month === month && payment.year === year
          ? {
              ...payment,
              status: payment.status === "paid" ? "pending" : "paid",
              paidAt:
                payment.status === "paid"
                  ? undefined
                  : new Date().toISOString(),
            }
          : payment
      )
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Payment Management</h3>
        <p>Brother: {brother.name}</p>
        <p>Degree: {brother.degree}</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid Date</TableHead>
              <TableHead>Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {updatedPayments.map((payment) => (
              <TableRow
                key={`${payment.month}-${payment.year}`}
                className={payment.status === "overdue" ? "bg-destructive/5" : ""}
              >
                <TableCell>
                  {new Date(0, payment.month - 1).toLocaleString("default", {
                    month: "long",
                  })}
                </TableCell>
                <TableCell>{payment.year}</TableCell>
                <TableCell>{format(new Date(payment.dueDate), "PP")}</TableCell>
                <TableCell>
                  <span
                    className={
                      payment.status === "overdue"
                        ? "text-destructive font-medium"
                        : payment.status === "paid"
                        ? "text-green-600 font-medium"
                        : ""
                    }
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>
                  {payment.paidAt ? format(new Date(payment.paidAt), "PP") : "-"}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={payment.status === "paid"}
                    onCheckedChange={() =>
                      handlePaymentToggle(payment.month, payment.year)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={() => onSave(updatedPayments)}>Save Payments</Button>
      </div>
    </div>
  );
}
