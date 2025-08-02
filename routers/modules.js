// routers/modules.js

import { Router } from "express";
import AppError from "../util/appError.js";

import RoleRoutes from "../routers/role/roleRoutes.js";
import registrationRoute from "../routers/registration/registration.route.js";
import loginRoute from "./login/loginRoute.js";
import leadRoute from "../routers/leads/leadRoute.js";
import salesEmployeRoute from "../routers/leads/sales.employee.routes.js";
import salesClientBriefingRoute from "../routers/leads/sales.briefing.route.js";
import tlReportRoute from "../routers/leads/tl.routs.js";
import projectPaymentRoute from "./leads/project.payment.route.js";

// Vendor Routes Start Here :- 
import vendorRoutes from "../routers/vendor.routers/product.Routers.js";
import salesDepartmentReportRoute from "./leads/sales.department.report.route.js";
// Vendor Routes End Here :- 

const router = Router();
// ✅ All routes mounted here
router.use("/role", RoleRoutes);
router.use("/login",loginRoute);
router.use("/sales", registrationRoute);

// ------------*********-----------//
router.use("/lead",leadRoute);

router.use("/sales/tl-report",tlReportRoute)
router.use("/sales/employee-report",salesEmployeRoute)
router.use("/sales/department-report",salesDepartmentReportRoute)

//project
router.use('/sales/client-briefing',salesClientBriefingRoute)

router.use("/project/payment",projectPaymentRoute)


// Vendor Routes Start Here :- 
router.use('/vendor',vendorRoutes)
// Vendor Routes End Here :- 


export default router;
