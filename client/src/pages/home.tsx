import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KanbanBoard } from "@/components/kanban-board";
import { AddTechDebtDialog } from "@/components/add-tech-debt-dialog";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { TechDebtItem } from "@shared/schema";
import { ExportPDFButton } from "@/components/export-pdf-button";

export default function Home() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery<TechDebtItem[]>({
    queryKey: ["/api/tech-debt"],
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tech Debt Tracker</h1>
        <div className="flex gap-2">
          <ExportPDFButton items={filteredItems} />
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        categories={Array.from(new Set(items.map(item => item.category)))}
      />

      <KanbanBoard items={filteredItems} isLoading={isLoading} />

      <AddTechDebtDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}