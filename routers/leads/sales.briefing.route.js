import { Router } from "express";
import { createClientBriefing,
    // clientBriefingView,
    clientBriefingAllData,
    updateClientBriefing,
    salesFromData,
    getProjectByID,
    getAllProject
 } from "../../controller/leads/sales.clent.brienfing.controller.js";

const salesClientBriefingRoute = Router();

// Memory storage for cloudinary upload
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

salesClientBriefingRoute.post("/create", upload.array("documentUpload", 10),createClientBriefing);
salesClientBriefingRoute.put("/update/:id",upload.array("documentUpload",10),updateClientBriefing);

//list show on sale in form
salesClientBriefingRoute.get("/get/sales/form",salesFromData)

//esame ek data le rahahu peoject ka
salesClientBriefingRoute.get("/get/project/:id",getProjectByID)

// salesClientBriefingRoute.get("/get",clientBriefingView)
salesClientBriefingRoute.get("/get/all",clientBriefingAllData)

salesClientBriefingRoute.get("/get/all/:id",getAllProject)

export default salesClientBriefingRoute;
