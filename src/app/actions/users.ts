"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import argon2 from "argon2";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "interviewer", "recruiter"]),
  phone: z.string().optional(),
  department: z.string().optional(),
});

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "interviewer", "recruiter"]).optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
};

export async function createUser(formData: FormData): Promise<ActionResponse> {
  try {
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as "admin" | "interviewer" | "recruiter",
      phone: formData.get("phone") as string | undefined,
      department: formData.get("department") as string | undefined,
    };

    const validated = createUserSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validated.data.email),
    });

    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await argon2.hash(validated.data.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: validated.data.name,
        email: validated.data.email,
        emailVerified: false,
        role: validated.data.role,
        phone: validated.data.phone || null,
        department: validated.data.department || null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/admin/settings");

    return {
      success: true,
      data: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: "Failed to create user. Please try again.",
    };
  }
}

export async function updateUser(formData: FormData): Promise<ActionResponse> {
  try {
    const data = {
      id: formData.get("id") as string,
      name: formData.get("name") as string | undefined,
      email: formData.get("email") as string | undefined,
      role: formData.get("role") as "admin" | "interviewer" | "recruiter" | undefined,
      phone: formData.get("phone") as string | undefined,
      department: formData.get("department") as string | undefined,
      isActive: formData.get("isActive") === "true",
    };

    const validated = updateUserSchema.safeParse(data);

    if (!validated.success) {
      return {
        success: false,
        errors: validated.error.flatten().fieldErrors,
      };
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, validated.data.id),
    });

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // If email is being changed, check if new email is already taken
    if (validated.data.email && validated.data.email !== existingUser.email) {
      const emailTaken = await db.query.users.findFirst({
        where: eq(users.email, validated.data.email),
      });

      if (emailTaken) {
        return {
          success: false,
          error: "This email is already in use",
        };
      }
    }

    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({
        ...validated.data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, validated.data.id))
      .returning();

    revalidatePath("/admin/settings");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: "Failed to update user. Please try again.",
    };
  }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  try {
    if (!userId) {
      return {
        success: false,
        error: "User ID is required",
      };
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // Soft delete by setting isActive to false
    const [deletedUser] = await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin/settings");

    return {
      success: true,
      data: deletedUser,
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: "Failed to delete user. Please try again.",
    };
  }
}

export async function getAllUsers(): Promise<ActionResponse> {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });

    return {
      success: true,
      data: allUsers,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      success: false,
      error: "Failed to fetch users",
    };
  }
}

export async function toggleUserStatus(userId: string): Promise<ActionResponse> {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!existingUser) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        isActive: !existingUser.isActive,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    revalidatePath("/admin/settings");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error toggling user status:", error);
    return {
      success: false,
      error: "Failed to update user status",
    };
  }
}
