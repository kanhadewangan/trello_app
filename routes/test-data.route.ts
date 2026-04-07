import { Router } from "express";
import { getTestDataPreview, seedTestData } from "../controller/test-data.controller";

const router = Router();

router.get("/preview", getTestDataPreview);
router.post("/seed", seedTestData);

export default router;
