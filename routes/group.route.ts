import express from "express";
import { createGroup, deleteGroup, getGroups, invitePeople } from "../controller/group.controller";

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroups);
router.delete("/:groupId", deleteGroup);
router.post("/:groupId/invite", invitePeople);

export default router;