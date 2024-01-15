import express from "express";
import { validationHandlingRoutine, errorHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { PostProfileDto } from "../models/dto/req/user-data.dto.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import path from "path";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { saveProfilePicture } from "../utils/saveProfilePicture.js";

//post profile data
export const postProfile = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req, res);
    let user = await UserModel.findById({ _id: req.user!.id })
    if (!user) {
      throw new ErrorExt("USERNAME_NO_MATCH", 404);
    }

    const body = req.body as PostProfileDto;

    //save data but avoid overwrite of empty propr in req body 
    user.name = body.name ?? user.name;
    user.surname = body.surname ?? user.surname;
    user.countryCode = body.countryCode ?? user.countryCode;
    user.description = body.description ?? user.description;
    user.email = body.email ?? user.email;

    let relativeImagePath: string | undefined = undefined;
    let imagePath: string | undefined = undefined;

    if (body.profilePictureBase64) {
      const imageExtension = base64MimeType(body.profilePictureBase64)
      relativeImagePath = `\\public\\profilePictures\\${user.username}.${imageExtension.split("/")[1]}`
      user.profilePictureUrl = relativeImagePath;
    }

    await user.save();

    /* NOTE - we take for granted that local file writes works so 
              we are not going to implement any rollback function 
              for the case of succesful user insert and failed picture save.
    */
    if (body.profilePictureBase64) {
      const projectRoot = path.resolve(process.cwd());
      imagePath = projectRoot + relativeImagePath;
      await saveProfilePicture(body.profilePictureBase64, imagePath);
    }
    return res.status(200).send();
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}