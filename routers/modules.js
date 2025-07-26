// routers/modules.js

import { Router } from "express";
import AppError from "../util/appError.js";

import RoleRoutes from "./role/roleRoutes.js";
import registrationRoute from "./sales/salesRoute.js";
import loginRoute from "./login/loginRoute.js";
import leadRoute from "./lead/leadRoute.js";
import salesEmployeRoute from "./sales.employee/sales.employee.routes.js";
import salesClientBriefingRoute from "./sales.client.briefing/sales.briefing.route.js";
import tlReportRoute from "./tl.report/tl.routs.js";


// Vendor Routes Start Here :- 
import vendorRoutes from "./vendor.routers/product.Routers.js";
// Vendor Routes End Here :- 

const router = Router();

// ✅ All routes mounted here

router.use("/role", RoleRoutes);
router.use("/login",loginRoute);
router.use("/sales", registrationRoute);

// ------------*********-----------//
router.use("/lead",leadRoute);
router.use("/sales/tl",tlReportRoute)
router.use('/sales/client-briefing',salesClientBriefingRoute)
router.use("/sales/employee-report",salesEmployeRoute)


// Vendor Routes Start Here :- 
router.use('/vendor',vendorRoutes)
// Vendor Routes End Here :- 


export default router;
