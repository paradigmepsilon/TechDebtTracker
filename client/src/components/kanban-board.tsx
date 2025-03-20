import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TechDebtItem, StatusType } from "@shared/schema";
import { TechDebtCard } from "./tech-debt-card";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KanbanBoardProps {
  items: TechDebtItem[];
  isLoading: boolean;
}

const columns = [
  { id: StatusType.BACKLOG, title: "Backlog", color: "border-yellow-500/50" },
  { id: StatusType.IN_PROGRESS, title: "In Progress", color: "border-blue-500/50" },
  { id: StatusType.DONE, title: "Done", color: "border-green-500/50" },
];

export function KanbanBoard({ items, isLoading }: KanbanBoardProps) {
  const { toast } = useToast();

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as StatusType;

    try {
      await apiRequest("PATCH", `/api/tech-debt/${draggableId}/status`, { status: newStatus });
      await queryClient.invalidateQueries({ queryKey: ["/api/tech-debt"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className="p-4">
            <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <Card key={column.id} className={`p-4 border-t-4 ${column.color}`}>
            <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
            <Droppable droppableId={column.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {items
                    .filter((item) => item.status === column.id)
                    .map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="transition-transform"
                          >
                            <TechDebtCard item={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Card>
        ))}
      </div>
    </DragDropContext>
  );
}