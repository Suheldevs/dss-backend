import { Router } from "express";
import { dashboardData } from "../../controller/leads/sales.dashboard.controller.js";

const salesDashboardRoute=Router();

salesDashboardRoute.get("/get/:id",dashboardData)

export default salesDashboardRoute;