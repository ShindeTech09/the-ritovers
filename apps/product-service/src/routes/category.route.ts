import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/category.controller";
import { shouldBeAdmin } from "../middleware/authMiddleware";

const router: Router = Router();

router.post("/", shouldBeAdmin, createCategory);
router.delete("/:id", shouldBeAdmin, deleteCategory);
router.put("/:id", shouldBeAdmin, updateCategory);
router.get("/", getCategories);

export default router;
