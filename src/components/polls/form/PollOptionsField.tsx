
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, XCircle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "./PollFormTypes";

interface PollOptionsFieldProps {
  options: string[];
  onAddOption: () => void;
  onRemoveOption: (index: number) => void;
}

export function PollOptionsField({ options, onAddOption, onRemoveOption }: PollOptionsFieldProps) {
  const form = useFormContext<FormValues>();

  return (
    <div className="space-y-4">
      <FormLabel>Opções</FormLabel>
      {options.map((_, index) => (
        <div key={index} className="flex gap-2">
          <FormField
            control={form.control}
            name={`options.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder={`Opção ${index + 1}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {index > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemoveOption(index)}
            >
              <XCircle className="h-5 w-5" />
            </Button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAddOption}
        className="w-full"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Adicionar opção
      </Button>
    </div>
  );
}
