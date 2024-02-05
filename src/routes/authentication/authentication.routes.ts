import express from "express";
import * as authenticationController from "../../controllers/authentication.controller.js";
import * as authenticationValidationChains from "../../validation-chains/authentication.validation-chains.js";

const authenticationRouter = express.Router();

authenticationRouter.post('/signOn', authenticationValidationChains.singOn, authenticationController.signOn)
authenticationRouter.post('/logIn', authenticationValidationChains.logIn, authenticationController.logIn)

export default authenticationRouter;