import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertTechDebtSchema, StatusType } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  app.get("/api/tech-debt", async (_req, res) => {
    const items = await storage.getTechDebtItems();
    res.json(items);
  });

  app.post("/api/tech-debt", async (req, res) => {
    try {
      const data = insertTechDebtSchema.parse(req.body);
      const item = await storage.createTechDebtItem(data);
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid tech debt item data" });
    }
  });

  app.patch("/api/tech-debt/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const data = insertTechDebtSchema.partial().parse(req.body);
      const item = await storage.updateTechDebtItem(id, data);
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  app.delete("/api/tech-debt/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      await storage.deleteTechDebtItem(id);
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ message: "Tech debt item not found" });
    }
  });

  app.patch("/api/tech-debt/:id/status", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      const { status } = z.object({ status: z.enum([StatusType.BACKLOG, StatusType.IN_PROGRESS, StatusType.DONE]) }).parse(req.body);
      const item = await storage.updateTechDebtStatus(id, status);
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid status update" });
    }
  });

  return httpServer;
}
