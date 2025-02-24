
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { SessionForm } from "@/components/sessions/SessionForm";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { useSessionsData } from "@/components/sessions/hooks/useSessionsData";
import { SessionsTable } from "@/components/sessions/SessionsTable";

const Sessions = () => {
  const navigate = useNavigate();
  const {
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
  } = useSessionsData();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sessões</h1>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Sessões</h1>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Sessão
        </Button>
      </div>

      {sessions && sessions.length > 0 ? (
        <SessionsTable
          sessions={sessions}
          editingTrunkId={editingTrunkId}
          isUploading={isUploading}
          onSelectSession={setSelectedSession}
          onEditTrunk={setEditingTrunkId}
          onUpdateTrunk={handleUpdateTrunkAmount}
          onCancelEdit={() => setEditingTrunkId(null)}
          onFileUpload={handleFileUpload}
          onEditSession={handleEditSession}
          onDeleteSession={handleDeleteSession}
        />
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma sessão encontrada
        </div>
      )}

      <SessionForm
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSubmit={handleCreateSession}
      />

      {selectedSession && (
        <AttendanceForm
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}

export default Sessions;
