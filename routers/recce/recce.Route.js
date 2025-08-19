import { Router } from "express";
import { createRecce, getSinglStatus } from "../../controller/recce/recce.controller.js";
import multer from "multer";
const recceRoute=Router();

const upload=multer();


recceRoute.get("/get/single/status/:id",getSinglStatus)
recceRoute.post("/to-design/create", upload.array("imagesFile"), createRecce);




export default recceRoute;