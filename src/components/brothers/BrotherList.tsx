
import { Brother } from "@/types/brother";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format, compareDesc } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BrotherListProps {
  brothers: Brother[];
  onSelectBrother: (brother: Brother) => void;
}

export default function BrotherList({ brothers, onSelectBrother }: BrotherListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and sort brothers
  const filteredBrothers = brothers
    .filter(
      (brother) =>
        brother.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brother.profession.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // First sort by degree: Master Mason > Fellow Craft > Apprentice
      const degreeOrder = {
        "Master Mason": 3,
        "Fellow Craft": 2,
        Apprentice: 1,
      };

      const degreeDiff =
        degreeOrder[b.degree as keyof typeof degreeOrder] -
        degreeOrder[a.degree as keyof typeof degreeOrder];

      if (degreeDiff !== 0) return degreeDiff;

      // If same degree, sort by birth date
      return compareDesc(new Date(a.birth_date), new Date(b.birth_date));
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou profissão..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid gap-4">
          {filteredBrothers.map((brother) => (
            <Card
              key={brother.id}
              className="cursor-pointer transition-colors hover:bg-muted"
              onClick={() => onSelectBrother(brother)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{brother.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {brother.profession}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Grau: </span>
                    {brother.degree}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nascimento: </span>
                    {format(new Date(brother.birth_date), "dd/MM/yyyy")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
