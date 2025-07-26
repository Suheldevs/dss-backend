import { Router } from "express";

const tlReportRoute=Router();
import { createTLReport,viewReport} from "../../controller/leads.sales.controller/tl.report.controller/tl.report.controller.js";

tlReportRoute.post("/report-create",createTLReport)
tlReportRoute.get("/report/all",viewReport)



export default tlReportRoute