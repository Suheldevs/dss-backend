import { Router } from "express";

const salesEmployeRoute=Router();
import {
  createEmployeeReport,
  getAllEmployeeReports,
  getReportById,
  updateReport,
  deleteReport,
  upLoad_multipal_data
} from "../../controller/leads.sales.controller/sales.employee/sales.employee.controller.js";

salesEmployeRoute.post("/create", createEmployeeReport);
salesEmployeRoute.get("/all", getAllEmployeeReports);
salesEmployeRoute.get("/:id", getReportById);
salesEmployeRoute.put("/:id", updateReport);
salesEmployeRoute.delete("/:id", deleteReport);


salesEmployeRoute.post("/check",upLoad_multipal_data)

export default salesEmployeRoute;

