
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["public", "secret"]),
  options: z.array(z.string()).min(2, "Adicione pelo menos 2 opções"),
  autoCloseAt: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePollForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<string[]>(["", ""]);  // Inicializar com duas opções vazias

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "public",
      options: ["", ""],  // Inicializar com duas opções vazias
    },
  });

  const addOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
    form.setValue("options", newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    form.setValue("options", newOptions);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar autenticado para criar uma enquete");
        return;
      }

      // Inserir a enquete
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          title: values.title,
          description: values.description,
          type: values.type,
          auto_close_at: values.autoCloseAt || null,
          created_by: user.id,
          status: 'open'  // Definir status explicitamente
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Inserir as opções
      const optionsToInsert = values.options
        .filter((option) => option.trim() !== "")
        .map((title) => ({
          poll_id: poll.id,
          title,
        }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsToInsert);

      if (optionsError) throw optionsError;

      toast.success("Enquete criada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      navigate("/polls");
    } catch (error) {
      console.error("Erro ao criar enquete:", error);
      toast.error("Erro ao criar enquete");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite o título da enquete" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Digite a descrição da enquete"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo da enquete" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="public">🔓 Pública</SelectItem>
                  <SelectItem value="secret">🔒 Secreta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
              {index > 1 && ( // Permitir remoção apenas se houver mais de 2 opções
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(index)}
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
            className="w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar opção
          </Button>
        </div>

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

        <Button type="submit" className="w-full">
          Criar Enquete
        </Button>
      </form>
    </Form>
  );
}
