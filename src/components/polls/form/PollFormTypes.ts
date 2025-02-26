
import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
  type: z.enum(["public", "secret"]),
  options: z.array(z.string()).min(2, "Adicione pelo menos 2 opções"),
  autoCloseAt: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
