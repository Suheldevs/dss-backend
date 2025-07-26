import { Router } from "express";
import { createClientBriefing,
    clientBriefingView,
    clientBriefingAllData
 } from "../../controller/leads.sales.controller/sales.client.briefing.controller/sales.clent.brienfing.controller.js";

const salesClientBriefingRoute = Router();

// Memory storage for cloudinary upload
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

salesClientBriefingRoute.post("/create", upload.array("documentUpload", 10),createClientBriefing);
salesClientBriefingRoute.get("/get",clientBriefingView)
salesClientBriefingRoute.get("/get/all",clientBriefingAllData)
export default salesClientBriefingRoute;
