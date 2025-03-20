import { Link } from "wouter";
import { BarChart3, KanbanSquare } from "lucide-react";

export function NavBar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Tech Debt Tracker
              </a>
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/">
                <a className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <KanbanSquare className="h-4 w-4" />
                  <span>Board</span>
                </a>
              </Link>
              <Link href="/analytics">
                <a className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}