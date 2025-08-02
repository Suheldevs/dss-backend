import { Router } from "express";
import { createReportDepartment } from "../../controller/leads/sales.department.rep.controller.js";

const salesDepartmentReportRoute=Router();

salesDepartmentReportRoute.post("/create",createReportDepartment)



export default salesDepartmentReportRoute;