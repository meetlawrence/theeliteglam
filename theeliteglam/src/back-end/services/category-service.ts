import { categoryModel } from "../models/category-model";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types/category-types";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
} from "../lib/validation/category-validation";

export class CategoryService {
  async createCategory(data: CreateCategoryInput, currentUserRole: string) {
    try {
      const validation = createCategorySchema.safeParse(data);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const category = await categoryModel.create(data);

      return {
        success: true,
        message: "Category created successfully",
        data: category,
      };
    } catch (error: any) {
      console.error("Create category error:", error);
      return { success: false, error: error.message || "Failed to create category" };
    }
  }

  async getCategoriesByEvent(eventId: string) {
    try {
      const validation = categoryIdParamSchema.safeParse(eventId);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const categories = await categoryModel.findByEventId(eventId);
      return { success: true, data: categories };
    } catch (error: any) {
      console.error("Get categories error:", error);
      return { success: false, error: "Failed to fetch categories" };
    }
  }

  async getCategoryById(id: string) {
    try {
      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const category = await categoryModel.findById(id);
      if (!category) throw new Error("Category not found");

      return { success: true, data: category };
    } catch (error: any) {
      console.error("Get category error:", error);
      return { success: false, error: error.message || "Failed to fetch category" };
    }
  }

  async updateCategory(id: string, data: UpdateCategoryInput, currentUserRole: string) {
    try {
      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      const validation2 = updateCategorySchema.safeParse(data);
      if (!validation2.success) {
        const messages = validation2.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const category = await categoryModel.update(id, data);
      return { success: true, message: "Category updated successfully", data: category };
    } catch (error: any) {
      console.error("Update category error:", error);
      return { success: false, error: error.message || "Failed to update category" };
    }
  }

  async deleteCategory(id: string, currentUserRole: string) {
    try {
      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        const messages = validation.error.issues.map((e) => e.message).join(", ");
        return { success: false, error: messages };
      }
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete categories.");
      }

      await categoryModel.delete(id);
      return { success: true, message: "Category deleted successfully" };
    } catch (error: any) {
      console.error("Delete category error:", error);
      return { success: false, error: error.message || "Failed to delete category" };
    }
  }
}

export const categoryService = new CategoryService();