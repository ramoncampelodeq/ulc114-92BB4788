
import { MonthlyPayment } from "@/types/payment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface PersonalPaymentsProps {
  payments: MonthlyPayment[];
}

export default function PersonalPayments({ payments }: PersonalPaymentsProps) {
  const overdueCount = payments.filter(
    (payment) => payment.status === "overdue"
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium mb-2">My Payments</h3>
        {overdueCount > 0 && (
          <p className="text-destructive">
            You have {overdueCount} overdue payment{overdueCount > 1 ? "s" : ""}
          </p>
        )}
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
