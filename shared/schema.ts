import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const PriorityLevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;

export type PriorityLevel = typeof PriorityLevel[keyof typeof PriorityLevel];

export const StatusType = {
  BACKLOG: "backlog",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export type StatusType = typeof StatusType[keyof typeof StatusType];

export const techDebtItems = pgTable("tech_debt_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().$type<PriorityLevel>(),
  status: text("status").notNull().$type<StatusType>(),
  category: text("category").notNull(),
});

export const insertTechDebtSchema = createInsertSchema(techDebtItems).pick({
  title: true,
  description: true,
  priority: true,
  status: true,
  category: true,
});

export type InsertTechDebt = z.infer<typeof insertTechDebtSchema>;
export type TechDebtItem = typeof techDebtItems.$inferSelect;
