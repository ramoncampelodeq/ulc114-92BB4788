
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { FormValues, formSchema } from "./form/PollFormTypes";
import { PollBasicFields } from "./form/PollBasicFields";
import { PollTypeField } from "./form/PollTypeField";
import { PollOptionsField } from "./form/PollOptionsField";
import { PollAutoCloseField } from "./form/PollAutoCloseField";

export function CreatePollForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState<string[]>(["", ""]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "public",
      options: ["", ""],
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar autenticado para criar uma enquete");
        return;
      }

      // Primeiro, criar a enquete
      const { error: pollError } = await supabase
        .from("polls")
        .insert({
          title: values.title,
          description: values.description,
          type: values.type,
          auto_close_at: values.autoCloseAt || null,
          created_by: user.id,
          status: 'open'
        });

      if (pollError) throw pollError;

      // Buscar a enquete recém-criada
      const { data: newPoll, error: fetchError } = await supabase
        .from("polls")
        .select()
        .eq('title', values.title)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) throw fetchError;

      // Filtrar e inserir as opções
      const validOptions = values.options.filter(option => option.trim() !== "");
      
      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(
          validOptions.map(title => ({
            poll_id: newPoll.id,
            title: title.trim()
          }))
        );

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
        <PollBasicFields />
        <PollTypeField />
        <PollOptionsField
          options={options}
          onAddOption={addOption}
          onRemoveOption={removeOption}
        />
        <PollAutoCloseField />
        <Button type="submit" className="w-full">
          Criar Enquete
        </Button>
      </form>
    </Form>
  );
}
