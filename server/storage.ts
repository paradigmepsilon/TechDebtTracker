import { type TechDebtItem, type InsertTechDebt, StatusType } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { techDebtItems } from "@shared/schema";

export interface IStorage {
  getTechDebtItems(): Promise<TechDebtItem[]>;
  createTechDebtItem(item: InsertTechDebt): Promise<TechDebtItem>;
  updateTechDebtItem(id: number, item: Partial<InsertTechDebt>): Promise<TechDebtItem>;
  deleteTechDebtItem(id: number): Promise<void>;
  updateTechDebtStatus(id: number, status: StatusType): Promise<TechDebtItem>;
}

export class DatabaseStorage implements IStorage {
  async getTechDebtItems(): Promise<TechDebtItem[]> {
    return await db.select().from(techDebtItems);
  }

  async createTechDebtItem(insertItem: InsertTechDebt): Promise<TechDebtItem> {
    const [item] = await db
      .insert(techDebtItems)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateTechDebtItem(id: number, update: Partial<InsertTechDebt>): Promise<TechDebtItem> {
    const [updated] = await db
      .update(techDebtItems)
      .set(update)
      .where(eq(techDebtItems.id, id))
      .returning();

    if (!updated) {
      throw new Error(`Tech debt item with id ${id} not found`);
    }

    return updated;
  }

  async deleteTechDebtItem(id: number): Promise<void> {
    const [deleted] = await db
      .delete(techDebtItems)
      .where(eq(techDebtItems.id, id))
      .returning();

    if (!deleted) {
      throw new Error(`Tech debt item with id ${id} not found`);
    }
  }

  async updateTechDebtStatus(id: number, status: StatusType): Promise<TechDebtItem> {
    return this.updateTechDebtItem(id, { status });
  }
}

export const storage = new DatabaseStorage();