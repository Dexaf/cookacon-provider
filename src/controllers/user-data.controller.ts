import express from "express";
import { validationHandlingRoutine, errorHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { PostProfileDto } from "../models/dto/req/user-data.dto.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import path from "path";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { saveProfilePicture } from "../utils/saveProfilePicture.js";
import { promises as fsPromises } from "fs";


//post profile data
export const postProfile = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  let imagePath: string | undefined = undefined;
  try {
    validationHandlingRoutine(req, res);
    const body = req.body as PostProfileDto;

    let user = await UserModel.findById({ _id: req.user!.id })

    if (!user) {
      throw new ErrorExt("USERNAME_NO_MATCH", 404);
    }

    let relativeImagePath: string | undefined = undefined;

    if (body.profilePictureBase64) {
      const imageExtension = base64MimeType(body.profilePictureBase64)
      const projectRoot = path.resolve(process.cwd());
      relativeImagePath = `\\public\\profilePictures\\${user.username}.${imageExtension.split("/")[1]}`
      imagePath = projectRoot + relativeImagePath;
    }

    user.name = body.name;
    user.surname = body.surname;
    user.countryCode = body.countryCode;
    user.description = body.description;
    user.email = body.email;
    user.profilePictureUrl = relativeImagePath;

    if (imagePath && body.profilePictureBase64)
      await saveProfilePicture(body.profilePictureBase64, imagePath);
    await user.save();

    return res.status(200).send();
  } catch (error: any) {
    if (imagePath)
      fsPromises.rm(imagePath)
    return errorHandlingRoutine(error, next);
  }
}