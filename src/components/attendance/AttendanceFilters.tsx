
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceFiltersProps {
  selectedDegree: string;
  setSelectedDegree: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
}

export const AttendanceFilters = ({
  selectedDegree,
  setSelectedDegree,
  selectedType,
  setSelectedType,
  selectedPeriod,
  setSelectedPeriod,
}: AttendanceFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="w-[200px]">
        <Select
          value={selectedDegree}
          onValueChange={setSelectedDegree}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por grau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os graus</SelectItem>
            <SelectItem value="aprendiz">Aprendiz</SelectItem>
            <SelectItem value="companheiro">Companheiro</SelectItem>
            <SelectItem value="mestre">Mestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select
          value={selectedType}
          onValueChange={setSelectedType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="ordinaria">Ordinária</SelectItem>
            <SelectItem value="administrativa">Administrativa</SelectItem>
            <SelectItem value="branca">Branca</SelectItem>
            <SelectItem value="magna">Magna</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[200px]">
        <Select
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todo período</SelectItem>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
