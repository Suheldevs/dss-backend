import { Router } from "express";

const salesEmployeRoute=Router();
import {
 createEmployeeReport,
 viewEmployeeReport,
 todayData
} from "../../controller/leads/sales.employee.controller.js";

salesEmployeRoute.post("/create/:id", createEmployeeReport);
salesEmployeRoute.get("/all/:id", viewEmployeeReport);
salesEmployeRoute.get("/get/today/:id",todayData)


export default salesEmployeRoute;

