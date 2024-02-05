import express from "express";
import { isAuthGuard } from "../../guards/auth.guard.js";
import * as userDataController from "../../controllers/user-data.controller.js"
import * as userDataValidationChain from "../../validation-chains/user-data.validation-chains.js"
const userDataRouter = express.Router();

userDataRouter.post('/profile/own', isAuthGuard, userDataValidationChain.updateProfile, userDataController.updateProfile);
userDataRouter.get('/profile/own', isAuthGuard, userDataController.getOwnProfile);
userDataRouter.get('/profile/:userId', isAuthGuard, userDataController.getProfile);
userDataRouter.post('/follow/add', isAuthGuard, userDataValidationChain.followAdd, userDataController.addFollow);
userDataRouter.delete('/follow/remove', isAuthGuard, userDataValidationChain.followRemove, userDataController.removeFollow);


export default userDataRouter;