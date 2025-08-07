import { Router } from "express";
import { getSinglStatus } from "../../controller/recce/recce.controller.js";

const recceRoute=Router();



recceRoute.get("/get/single/status/:id",getSinglStatus)




export default recceRoute;