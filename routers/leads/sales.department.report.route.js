import { Router } from "express";
import { createEmployeeReport } from "../../controller/leads/sales.employee.controller.js";

const salesDepartmentReportRoute=Router();

salesDepartmentReportRoute.post("/create",createEmployeeReport)



export default salesDepartmentReportRoute;