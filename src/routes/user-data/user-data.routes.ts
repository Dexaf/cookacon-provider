import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as userDataController from "../../controllers/user-data.controller.js"
import * as userDataValidationChain from "../../validation-chains/user-data.validation-chains.js"
const userDataRouter = express.Router();

userDataRouter.post('/profile', isAuthGuard, userDataValidationChain.updateProfile, userDataController.updateProfile);
userDataRouter.get('/profile', isAuthGuard, userDataController.getProfile);
userDataRouter.post('/follow/add', isAuthGuard, userDataValidationChain.follow, userDataController.addFollow);
userDataRouter.delete('/follow/remove', isAuthGuard, userDataValidationChain.follow, userDataController.removeFollow);


export default userDataRouter;