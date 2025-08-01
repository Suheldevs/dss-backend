
import { Router } from "express";
const projectPaymentRoute = Router();

import {
  createInitialProjectPayment,
  addProjectPayment,
  getPaymentSingle
} from "../../controller/leads/project.controller.js";

// ✅ CREATE
projectPaymentRoute.post("/add", createInitialProjectPayment);

projectPaymentRoute.put("/update",addProjectPayment);
// (Optional for later)
// READ ALL
// projectPaymentRoute.get("/", getAllProjectPayments);


// READ ONE
projectPaymentRoute.get("/get/single/:id",getPaymentSingle);

// UPDATE ONE
// projectPaymentRoute.put("/:id", updateProjectPayment);

// DELETE
// projectPaymentRoute.delete("/:id", deleteProjectPayment);

export default projectPaymentRoute;
