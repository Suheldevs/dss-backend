import { Router } from "express";

const leadRoute=Router();
// import{validateLead} from "../../middlewares/sales.middleware/lead.middleware/lead.validation.js"
import { createLead,getAllLeads ,getLeadById ,updateLead,deleteLead,pandingList } from "../../controller/leads/lead.Controller.js";

leadRoute.post("/add",createLead)
leadRoute.get("/get/all",getAllLeads)

leadRoute.get("/get/:id",getLeadById)

leadRoute.put("/update/:id",updateLead)

leadRoute.delete("/delete/:id",deleteLead)
leadRoute.get("/pending-list",pandingList)


export default leadRoute;