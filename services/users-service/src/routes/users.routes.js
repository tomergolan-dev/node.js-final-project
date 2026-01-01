import { Router } from "express";
import { addUser, getAllUsers, getUserDetails } from "../controllers/users.controller.js";

const router = Router();

router.get("/api/users", getAllUsers);
router.post("/api/add", addUser);
router.get("/api/users/:id", getUserDetails);

export default router;
