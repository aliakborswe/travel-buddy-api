import { Router } from "express";
import { uploadImage } from "./upload.controller";
import { upload } from "../../config/multer.config";

const router = Router();

router.post("/", upload.single("file"), uploadImage);

export const UploadRoutes = router;
