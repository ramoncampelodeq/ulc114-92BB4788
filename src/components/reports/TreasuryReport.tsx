
import { PaymentRecord } from "@/types/payment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { AlertCircle } from "lucide-react";

interface TreasuryReportProps {
  records: PaymentRecord[];
}

export default function TreasuryReport({ records }: TreasuryReportProps) {
  const overdueRecords = records.filter((record) => record.overdueCount > 0);
  const criticalOverdue = records.filter((record) => record.overdueCount >= 2);

  return (
    <div className="space-y-6 animate-fadeIn">
      {criticalOverdue.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Payment Alert</AlertTitle>
          <AlertDescription>
            {criticalOverdue.length} brother{criticalOverdue.length > 1 ? "s" : ""}{" "}
            with 2 or more overdue payments
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brother</TableHead>
              <TableHead>Overdue Months</TableHead>
              <TableHead>Last Payment</TableHead>
              <TableHead>Total Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overdueRecords.map((record) => (
              <TableRow
                key={record.brother.id}
                className={
                  record.overdueCount >= 2 ? "bg-destructive/5" : "bg-muted/5"
                }
              >
                <TableCell className="font-medium">
                  {record.brother.name}
                </TableCell>
                <TableCell>
                  <span
                    className={
                      record.overdueCount >= 2
                        ? "text-destructive font-medium"
                        : ""
                    }
                  >
                    {record.overdueCount}
                  </span>
                </TableCell>
                <TableCell>
                  {record.lastPayment
                    ? format(new Date(record.lastPayment.paidAt!), "PP")
                    : "No payments"}
                </TableCell>
                <TableCell className="font-medium">
                  R$ {(record.overdueCount * 100).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {overdueRecords.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  <span className="text-muted-foreground">
                    No overdue payments
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
