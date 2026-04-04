import ElectionController from "../controllers/election.js";
import { Router } from "express";

const router = Router();

router.get("/", ElectionController.getAll);
router.get("/:id", ElectionController.getById);
router.post("/", ElectionController.create);
router.put("/:id", ElectionController.update);
router.delete("/:id", ElectionController.delete);

export default router;