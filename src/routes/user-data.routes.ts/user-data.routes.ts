import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as userDataController from "../../controllers/user-data.controller.js"
import * as userDataValidationChain from "../../validation-chains/user-data.validation-chains.js"
const userDataRouter = express.Router();

userDataRouter.post('/Profile', isAuthGuard, userDataValidationChain.postProfile, userDataController.postProfile);

export default userDataRouter;