import express from "express";
import { createGroup, deleteGroup, getGroups, invitePeople } from "../controller/group.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", authenticateToken, createGroup);
router.get("/", authenticateToken, getGroups);
router.delete("/:groupId", authenticateToken, deleteGroup);
router.post("/:groupId/invite", authenticateToken, invitePeople);

export default router;