import { Router } from "express";

const tlReportRoute=Router();
import { createTLReport,viewReport} from "../../controller/leads/tl.report.controller.js";

tlReportRoute.post("/create/:id",createTLReport)
tlReportRoute.get("/report/all",viewReport)



export default tlReportRoute