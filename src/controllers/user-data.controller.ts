import express from "express";
import { validationHandlingRoutine, errorHandlingRoutine } from "../utils/errorHandlingRoutines.js";
import { FollowDtoReq, UpdateProfileDtoReq } from "../models/dto/req/user-data.dto.req.js";
import { CustomRequest } from "../models/extensions/request.extension.js";
import { UserModel } from "../models/schemas/user.schema.js";
import { ErrorExt } from "../models/extensions/error.extension.js";
import path from "path";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { savePicture } from "../utils/savePicture.js";
import { UserSocialModel } from "../models/schemas/userSocial.schemas.js";
import ProfileDtoRes from "../models/dto/res/user-data.dto.res.js";
import { CountryCodesEnum } from "../models/enum/country-codes.js";

export const updateProfile = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    let user = await UserModel.findById({ _id: req.user!.id })

    if (!user)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const body = req.body as UpdateProfileDtoReq;

    //save data but avoid overwrite of empty propr in req body 
    user.name = body.name ?? user.name;
    user.surname = body.surname ?? user.surname;
    user.countryCode = body.countryCode ?? user.countryCode;
    user.description = body.description ?? user.description;
    user.email = body.email ?? user.email;

    let relativeImagePath: string | undefined = undefined;

    if (body.profilePictureBase64) {
      const imageExtension = base64MimeType(body.profilePictureBase64)
      relativeImagePath = `\\public\\${user.id}\\pic.${imageExtension.split("/")[1]}`
      user.profilePictureUrl = relativeImagePath;
    }

    await user.save();

    /* NOTE - we take for granted that local file writes works so 
              we are not going to implement any rollback function 
              for the case of succesful user insert and failed picture save.
    */
    if (body.profilePictureBase64) {
      const projectRoot = path.resolve(process.cwd());
      await savePicture(body.profilePictureBase64, projectRoot + relativeImagePath);
    }
    return res.status(200).send();
  } catch (error: any) {
    return errorHandlingRoutine(error, next);
  }
}

export const addFollow = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const body = req.body as FollowDtoReq;

    const currUserId = req.user!.id;
    const currUser = await UserModel.findById(currUserId);
    if (!currUser)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const followedUser = await UserModel.findById(body.targetId);
    if (!followedUser)
      throw new ErrorExt("FOLLOWED_USER_SOCIAL_NO_MATCH", 404);

    await UserSocialModel.findOneAndUpdate({ userId: currUserId }, { $addToSet: { followedIds: followedUser._id } });
    await UserSocialModel.findOneAndUpdate({ userId: body.targetId }, { $addToSet: { followersIds: currUser._id } });

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const removeFollow = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);

    const body = req.body as FollowDtoReq;

    const currUserId = req.user!.id;
    const currUser = await UserModel.findById(currUserId);
    if (!currUser)
      throw new ErrorExt("USER_NO_MATCH", 404);

    const followedUser = await UserModel.findById(body.targetId);
    if (!followedUser)
      throw new ErrorExt("FOLLOWED_USER_SOCIAL_NO_MATCH", 404);

    await UserSocialModel.findOneAndUpdate({ userId: currUserId }, { $pull: { followedIds: followedUser._id } });
    await UserSocialModel.findOneAndUpdate({ userId: body.targetId }, { $pull: { followersIds: currUser._id } });

    res.status(200).send();
  } catch (error) {
    errorHandlingRoutine(error, next);
  }
}

export const getOwnProfile = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const user = await UserModel.findById(req.user!.id)

    if (!user) {
      throw new ErrorExt("USER_NO_MATCH", 404);
    }

    const profileData: ProfileDtoRes = {
      username: user.username,
      name: user.name ?? undefined,
      surname: user.surname ?? undefined,
      countryCode: user.countryCode ?? undefined,
      description: user.description ?? undefined,
      email: user.email ?? undefined,
      profilePictureUrl: user.profilePictureUrl ?? undefined
    };
    
    res.send(profileData);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }

}

export const getProfile = async (req: CustomRequest, res: express.Response, next: express.NextFunction) => {
  try {
    validationHandlingRoutine(req);
    const userId = req.params.userId;
    const user = await UserModel.findById(userId)

    if (!user) {
      throw new ErrorExt("USER_NO_MATCH", 404);
    }

    const profileData: ProfileDtoRes = {
      username: user.username,
      name: user.name ?? undefined,
      surname: user.surname ?? undefined,
      countryCode: user.countryCode ?? undefined,
      description: user.description ?? undefined,
      email: user.email ?? undefined,
      profilePictureUrl: user.profilePictureUrl ?? undefined
    };

    res.send(profileData);
  } catch (error) {
    errorHandlingRoutine(error, next);
  }

}