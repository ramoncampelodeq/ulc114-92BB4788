
import { Routes, Route, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { CreatePollForm } from "@/components/polls/CreatePollForm";
import { PollList } from "@/components/polls/PollList";
import { PollResults } from "@/components/polls/PollResults";

const Polls = () => {
  const { isAdmin } = useIsAdmin();

  return (
    <div className="container mx-auto py-8 px-4 md:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Enquetes</h1>
          <p className="text-muted-foreground">
            Gerencie e participe das votações da loja
          </p>
        </div>
        {isAdmin && (
          <Link to="/polls/new">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nova Enquete
            </Button>
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/new" element={<CreatePollForm />} />
        <Route path="/:id" element={<PollResults pollId="id" />} />
      </Routes>
    </div>
  );
};

export default Polls;
