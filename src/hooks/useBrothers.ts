import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Brother, MasonicDegree } from "@/types/brother";
import { toast } from "sonner";

export function useBrothers() {
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrother, setSelectedBrother] = useState<Brother | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBrothers = async () => {
    try {
      const { data, error } = await supabase
        .from('brothers')
        .select('*');
      
      if (error) throw error;
      
      setBrothers(data || []);
    } catch (error) {
      console.error('Error fetching brothers:', error);
      toast.error('Erro ao carregar lista de irmãos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const brotherData = {
      name: String(formData.get('name')),
      profession: String(formData.get('profession')),
      degree: String(formData.get('degree')) as MasonicDegree,
      birth_date: String(formData.get('birth_date')),
      email: String(formData.get('email')),
      phone: String(formData.get('phone')),
      higher_degree: null,
    };

    try {
      if (selectedBrother) {
        const { error: brotherError } = await supabase
          .from('brothers')
          .update(brotherData)
          .eq('id', selectedBrother.id);

        if (brotherError) throw brotherError;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: formData.get('role') })
          .eq('id', selectedBrother.id);

        if (profileError) throw profileError;

        toast.success('Irmão atualizado com sucesso');
      } else {
        const password = formData.get('password') as string;
        const role = formData.get('role') as string;
        
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: brotherData.email,
          password: password,
          options: {
            data: {
              name: brotherData.name,
              role: role
            }
          }
        });

        if (authError) throw authError;

        if (!authData.user) throw new Error('Erro ao criar usuário');

        const { error: brotherError } = await supabase
          .from('brothers')
          .insert([{ 
            ...brotherData,
            id: authData.user.id,
            user_id: authData.user.id 
          }]);

        if (brotherError) throw brotherError;

        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: role })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        toast.success('Irmão cadastrado com sucesso');
      }

      setIsDialogOpen(false);
      setSelectedBrother(null);
      fetchBrothers();
    } catch (error: any) {
      console.error('Error saving brother:', error);
      toast.error(error.message || 'Erro ao salvar dados do irmão');
    }
  };

  const handleEdit = (brother: Brother) => {
    setSelectedBrother(brother);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este irmão?')) return;

    try {
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      toast.success('Irmão removido com sucesso');
      fetchBrothers();
    } catch (error) {
      console.error('Error deleting brother:', error);
      toast.error('Erro ao remover irmão');
    }
  };

  useEffect(() => {
    fetchBrothers();
  }, []);

  return {
    brothers,
    loading,
    selectedBrother,
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    handleEdit,
    handleDelete
  };
}
