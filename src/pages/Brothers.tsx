
import { useNavigate } from "react-router-dom";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { BrotherDialog } from "@/components/brothers/BrotherDialog";
import { BrothersTable } from "@/components/brothers/BrothersTable";
import { BrothersHeader } from "@/components/brothers/BrothersHeader";
import { useBrothers } from "@/hooks/useBrothers";
import type { NavigationItem } from "@/components/brothers/types";

const Brothers = () => {
  const navigate = useNavigate();
  const {
    brothers,
    loading,
    selectedBrother,
    isDialogOpen,
    setIsDialogOpen,
    handleSubmit,
    handleEdit,
    handleDelete
  } = useBrothers();

  const menuItems: NavigationItem[] = [
    {
      title: "Irmãos",
      icon: <Users className="h-5 w-5" />,
      onClick: () => navigate("/brothers"),
    },
    {
      title: "Sessões",
      icon: <CalendarDays className="h-5 w-5" />,
      onClick: () => navigate("/sessions"),
    },
    {
      title: "Presenças",
      icon: <UserCheck className="h-5 w-5" />,
      onClick: () => navigate("/attendance"),
    },
    {
      title: "Tesouraria",
      icon: <DollarSign className="h-5 w-5" />,
      onClick: () => navigate("/treasury"),
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BrothersHeader menuItems={menuItems} />

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <BrotherDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            selectedBrother={selectedBrother}
            onSubmit={handleSubmit}
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        ) : brothers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum irmão cadastrado
          </div>
        ) : (
          <BrothersTable
            brothers={brothers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Brothers;
