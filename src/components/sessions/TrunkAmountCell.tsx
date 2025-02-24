
import { Input } from "@/components/ui/input";
import { Session } from "@/types/session";

interface TrunkAmountCellProps {
  session: Session;
  editingId: string | null;
  onEdit: (id: string) => void;
  onUpdate: (id: string, amount: string) => void;
  onCancel: () => void;
}

export function TrunkAmountCell({
  session,
  editingId,
  onEdit,
  onUpdate,
  onCancel,
}: TrunkAmountCellProps) {
  if (editingId === session.id) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          defaultValue={session.daily_trunk_amount}
          className="w-24"
          onBlur={(e) => onUpdate(session.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdate(session.id, e.currentTarget.value);
            }
            if (e.key === "Escape") {
              onCancel();
            }
          }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <button onClick={() => onEdit(session.id)} className="hover:underline">
      {session.daily_trunk_amount
        ? `R$ ${session.daily_trunk_amount.toFixed(2)}`
        : "Adicionar valor"}
    </button>
  );
}
