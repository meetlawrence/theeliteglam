import { categoryModel } from "../models/category-model";
import type { CreateCategoryInput, UpdateCategoryInput } from "../types/category-types";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  eventIdSchema,
} from "../lib/validation/category-validation";

import { formatZodError } from "../lib/utils/helper";

export class CategoryService {
  async createCategory(data: CreateCategoryInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const validation = createCategorySchema.safeParse(data);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      const category = await categoryModel.create(validation.data);

      return {
        success: true,
        message: "Category created successfully",
        data: category,
      };
    } catch (error) {
      console.error("Create category error:", error);
      return { success: false, error: error || "Failed to create category" };
    }
  }

  async getCategoriesByEvent(eventId: string) {
    try {
      const validation = eventIdSchema.safeParse({ eventId });
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const categories = await categoryModel.findByEventId(validation.data.eventId);
      return { success: true, data: categories };
    } catch (error) {
      console.error("Get categories error:", error);
      return { success: false, error: error || "Failed to fetch categories" };
    }
  }

  async getCategoryById(id: string) {
    try {
      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const category = await categoryModel.findById(validation.data.id);
      if (!category) throw new Error("Category not found");

      return { success: true, data: category };
    } catch (error) {
      console.error("Get category error:", error);
      return { success: false, error: error || "Failed to fetch category" };
    }
  }

  async updateCategory(id: string, data: UpdateCategoryInput, currentUserRole: string) {
    try {
      if (!["ADMIN", "SUPER_ADMIN"].includes(currentUserRole)) {
        throw new Error("Access denied.");
      }

      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }
      const validation2 = updateCategorySchema.safeParse(data);
      if (!validation2.success) {
        return { success: false, error: formatZodError(validation2.error) };
      }

      const category = await categoryModel.update(validation.data.id, validation2.data);
      return { success: true, message: "Category updated successfully", data: category };
    } catch (error) {
      console.error("Update category error:", error);
      return { success: false, error: error || "Failed to update category" };
    }
  }

  async deleteCategory(id: string, currentUserRole: string) {
    try {
      if (currentUserRole !== "SUPER_ADMIN") {
        throw new Error("Only SUPER_ADMIN can delete categories.");
      }

      const validation = categoryIdParamSchema.safeParse(id);
      if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
      }

      await categoryModel.delete(validation.data.id);
      return { success: true, message: "Category deleted successfully" };
    } catch (error) {
      console.error("Delete category error:", error);
      return { success: false, error: error || "Failed to delete category" };
    }
  }
}

export const categoryService = new CategoryService();
