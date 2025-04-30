import { Hono } from "hono";
import { handle } from "hono/vercel";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { pgTable, uuid, varchar, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

// Initialize Neon client and Drizzle
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

// Define Todo schema
const todoTable = pgTable("todos", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  title: varchar().notNull(),
  description: varchar(),
  completed: boolean().default(false).notNull(),
  userId: uuid("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("ix_todo_id").using("btree", table.id.asc().nullsLast().op("uuid_ops")),
  index("ix_todo_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
]);

// Create Zod schemas for validation
const createTodoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  userId: z.string().uuid("Invalid user ID format"),
});

const updateTodoSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  completed: z.boolean().optional(),
});

// Define database queries
export const getTodos = async (userId?: string) => {
  if (userId) {
    return await db
      .select()
      .from(todoTable)
      .where(eq(todoTable.userId, userId))
      .orderBy(todoTable.createdAt);
  }
  return await db.select().from(todoTable).orderBy(todoTable.createdAt);
};

export const getTodoById = async (id: string) => {
  const result = await db
    .select()
    .from(todoTable)
    .where(eq(todoTable.id, id));

  return result[0] || null;
};

export const createTodo = async (data: { title: string; description?: string; userId: string }) => {
  const result = await db.insert(todoTable).values({
    title: data.title,
    description: data.description || "",
    userId: data.userId,
  }).returning();

  return result[0];
};

export const updateTodo = async (id: string, data: Partial<{ title: string; description: string; completed: boolean }>) => {
  const updatedData = {
    ...data,
    updatedAt: new Date(),
  };

  const result = await db
    .update(todoTable)
    .set(updatedData)
    .where(eq(todoTable.id, id))
    .returning();

  return result[0] || null;
};

export const deleteTodo = async (id: string) => {
  const result = await db
    .delete(todoTable)
    .where(eq(todoTable.id, id))
    .returning();

  return result[0] || null;
};

// Initialize Hono app
const app = new Hono().basePath("/api");

// Middleware
app.use(logger());

// Routes
app.get("/", (c) => c.json({ message: "Todo API is running!" }));

// GET all todos or filtered by userId
app.get("/todos", async (c) => {
  const userId = c.req.query("userId");
  try {
    const todos = await getTodos(userId);
    return c.json({
      success: true,
      data: todos
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    return c.json({
      success: false,
      message: "Failed to fetch todos"
    }, 500);
  }
});

// GET a single todo by ID
app.get("/todos/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const todo = await getTodoById(id);
    if (!todo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }
    return c.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    return c.json({
      success: false,
      message: "Failed to fetch todo"
    }, 500);
  }
});

// POST create a new todo
app.post("/todos", zValidator("json", createTodoSchema), async (c) => {
  const data = c.req.valid("json");
  try {
    const newTodo = await createTodo(data);
    return c.json({
      success: true,
      data: newTodo
    }, 201);
  } catch (error) {
    console.error("Error creating todo:", error);
    return c.json({
      success: false,
      message: "Failed to create todo"
    }, 500);
  }
});

// PUT update a todo
app.put("/todos/:id", zValidator("json", updateTodoSchema), async (c) => {
  const id = c.req.param("id");
  const data = c.req.valid("json");
  try {
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }

    const updatedTodo = await updateTodo(id, data);
    return c.json({
      success: true,
      data: updatedTodo
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return c.json({
      success: false,
      message: "Failed to update todo"
    }, 500);
  }
});

// DELETE remove a todo
app.delete("/todos/:id", async (c) => {
  const id = c.req.param("id");
  try {
    const existingTodo = await getTodoById(id);
    if (!existingTodo) {
      return c.json({
        success: false,
        message: "Todo not found"
      }, 404);
    }

    const deletedTodo = await deleteTodo(id);
    return c.json({
      success: true,
      data: deletedTodo,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return c.json({
      success: false,
      message: "Failed to delete todo"
    }, 500);
  }
});

const handler = handle(app);
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;