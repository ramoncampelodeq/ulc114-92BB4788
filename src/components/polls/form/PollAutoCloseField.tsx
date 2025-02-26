
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./PollFormTypes";

export function PollAutoCloseField() {
  const form = useFormContext<FormValues>();

  return (
    <FormField
      control={form.control}
      name="autoCloseAt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Fechamento automático (opcional)</FormLabel>
          <FormControl>
            <Input
              type="datetime-local"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
