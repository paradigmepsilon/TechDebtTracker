import { TechDebtItem, PriorityLevel } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TechDebtCardProps {
  item: TechDebtItem;
}

const priorityColors: Record<PriorityLevel, { bg: string, text: string }> = {
  high: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300" },
  medium: { bg: "bg-yellow-100 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300" },
  low: { bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300" },
};

export function TechDebtCard({ item }: TechDebtCardProps) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await apiRequest("DELETE", `/api/tech-debt/${item.id}`);
      await queryClient.invalidateQueries({ queryKey: ["/api/tech-debt"] });
      toast({
        title: "Success",
        description: "Tech debt item deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const priorityStyle = priorityColors[item.priority];

  return (
    <Card className="border-2 hover:border-primary/20 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold tracking-tight">{item.title}</h3>
          <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the tech debt item.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between pt-4">
        <Badge variant="outline" className="bg-primary/5">{item.category}</Badge>
      </CardFooter>
    </Card>
  );
}