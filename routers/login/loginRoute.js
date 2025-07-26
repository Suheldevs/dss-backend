import { Router } from "express";
const loginRoute=Router();
import loginController from "../../controller/login/login.controller.js";
import { validateEmailPasswordPhone } from "../../middlewares/sales.middleware/lead.middleware/lead.validation.js";

loginRoute.post("/email/password",validateEmailPasswordPhone,loginController.login)

// loginRoute.post("/otp/send/email",loginController.otpSendEmail)
// loginRoute.get("/email/otp",loginController.emialotp)


export default loginRoute


