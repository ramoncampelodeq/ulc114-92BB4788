import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarDays,
  UserCheck,
  DollarSign,
  LogOut,
  Plus,
} from "lucide-react";
import { SessionForm } from "@/components/sessions/SessionForm";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { useSessionsData } from "@/components/sessions/hooks/useSessionsData";
import { SessionsTable } from "@/components/sessions/SessionsTable";
import { supabase } from "@/lib/supabase";

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

  const menuItems = [
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b sticky top-0 z-50 bg-background">
          <div className="flex h-16 items-center px-4 md:px-8">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
                alt="ULC 114 Logo" 
                className="h-10 w-10"
              />
              <h1 className="text-2xl font-serif text-primary">ULC 114</h1>
            </div>
            
            <div className="flex items-center space-x-2 ml-8">
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  variant={item.title === "Sessões" ? "default" : "ghost"}
                  className="flex items-center gap-2"
                  onClick={item.onClick}
                >
                  {item.icon}
                  {item.title}
                </Button>
              ))}
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => supabase.auth.signOut()}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-8 text-muted-foreground">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 z-50 bg-background">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6fdc026e-0d67-455d-8b99-b87c27b3a61f.png" 
              alt="ULC 114 Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-2xl font-serif text-primary">ULC 114</h1>
          </div>
          
          <div className="flex items-center space-x-2 ml-8">
            {menuItems.map((item) => (
              <Button
                key={item.title}
                variant={item.title === "Sessões" ? "default" : "ghost"}
                className="flex items-center gap-2"
                onClick={item.onClick}
              >
                {item.icon}
                {item.title}
              </Button>
            ))}
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => supabase.auth.signOut()}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
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
    </div>
  );
};

export default Sessions;
