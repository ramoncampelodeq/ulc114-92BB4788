
import { useState } from "react";
import { Brother, BrotherFormData } from "@/types/brother";
import BrotherList from "@/components/brothers/BrotherList";
import BrotherForm from "@/components/brothers/BrotherForm";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [brothers, setBrothers] = useState<Brother[]>([]);
  const [editingBrother, setEditingBrother] = useState<Brother | undefined>();
  const [isAddingBrother, setIsAddingBrother] = useState(false);
  const { toast } = useToast();

  const handleAddBrother = (data: BrotherFormData) => {
    const newBrother: Brother = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      higherDegrees: [],
      relatives: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBrothers([...brothers, newBrother]);
    setIsAddingBrother(false);
    toast({
      title: "Brother Added",
      description: "The new brother has been successfully added to the directory.",
    });
  };

  const handleUpdateBrother = (data: BrotherFormData) => {
    if (!editingBrother) return;

    const updatedBrother: Brother = {
      ...editingBrother,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    setBrothers(
      brothers.map((b) => (b.id === editingBrother.id ? updatedBrother : b))
    );
    setEditingBrother(undefined);
    toast({
      title: "Brother Updated",
      description: "The brother's information has been successfully updated.",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-header">ULC 114 Management System</h1>

      {isAddingBrother ? (
        <div className="max-w-4xl mx-auto">
          <h2 className="section-header">Add New Brother</h2>
          <BrotherForm
            onSubmit={handleAddBrother}
            onCancel={() => setIsAddingBrother(false)}
          />
        </div>
      ) : editingBrother ? (
        <div className="max-w-4xl mx-auto">
          <h2 className="section-header">Edit Brother</h2>
          <BrotherForm
            brother={editingBrother}
            onSubmit={handleUpdateBrother}
            onCancel={() => setEditingBrother(undefined)}
          />
        </div>
      ) : (
        <BrotherList
          brothers={brothers}
          onEdit={setEditingBrother}
          onAdd={() => setIsAddingBrother(true)}
        />
      )}
    </div>
  );
};

export default Index;
