
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Session, SessionFormData } from "@/types/session";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export function useSessionsData() {
  const { toast } = useToast();
  const { isAdmin } = useIsAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [editingTrunkId, setEditingTrunkId] = useState<string | null>(null);

  const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar sessões",
          description: error.message,
        });
        throw error;
      }

      return data as Session[];
    },
  });

  const handleCreateSession = async (data: SessionFormData) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem criar sessões",
      });
      return;
    }

    try {
      console.log("Creating session with data:", data);
      
      const { error } = await supabase
        .from("sessions")
        .insert([data]);

      if (error) {
        console.error("Error creating session:", error);
        throw error;
      }

      toast({
        title: "Sessão criada com sucesso!",
      });
      
      refetch();
    } catch (error: any) {
      console.error("Error in handleCreateSession:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar sessão",
        description: error.message,
      });
    }
  };

  const handleUpdateTrunkAmount = async (sessionId: string, amount: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem atualizar o tronco",
      });
      return;
    }

    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        throw new Error("Valor inválido");
      }

      const { error } = await supabase
        .from("sessions")
        .update({ daily_trunk_amount: numericAmount })
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Valor atualizado com sucesso!",
      });

      setEditingTrunkId(null);
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar valor",
        description: error.message,
      });
    }
  };

  const handleFileUpload = async (sessionId: string, file: File) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem enviar atas",
      });
      return;
    }

    try {
      setIsUploading(sessionId);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await fetch(
        'https://nxoixikuzrofjmvacsfz.supabase.co/functions/v1/upload-minutes',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao fazer upload da ata');
      }

      toast({
        title: "Ata enviada com sucesso!",
      });

      refetch();
    } catch (error: any) {
      console.error('Error uploading minutes:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar ata",
        description: error.message,
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleEditSession = async (session: Session) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem editar sessões",
      });
      return;
    }

    toast({
      title: "Editar sessão",
      description: "Funcionalidade em desenvolvimento",
    });
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Apenas administradores podem excluir sessões",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", sessionId);

      if (error) throw error;

      toast({
        title: "Sessão removida com sucesso!",
      });

      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao remover sessão",
        description: error.message,
      });
    }
  };

  return {
    sessions,
    isLoading,
    isCreating,
    setIsCreating,
    isUploading,
    selectedSession,
    setSelectedSession,
    editingTrunkId,
    setEditingTrunkId,
    handleCreateSession,
    handleUpdateTrunkAmount,
    handleFileUpload,
    handleEditSession,
    handleDeleteSession,
    isAdmin,
  };
}
