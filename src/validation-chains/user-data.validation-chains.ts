import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { FollowDtoReq, UpdateProfileDtoReq } from "../models/dto/req/user-data.dto.req.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { CountryCodesEnum } from "../models/enum/country-codes.js";
import { UserSocialModel } from "../models/schemas/userSocial.schemas.js";
import { CustomRequest } from "../models/extensions/request.extension.js";


export const updateProfile = [
  ev.body(getfieldName<UpdateProfileDtoReq>("name"))
    .optional(),
  ev.body(getfieldName<UpdateProfileDtoReq>("surname"))
    .optional(),
  ev.body(getfieldName<UpdateProfileDtoReq>("countryCode"))
    .optional()
    .custom((countryCode: string) => {
      if (Object.values(CountryCodesEnum).includes(countryCode as CountryCodesEnum)) {
        return true
      } else {
        throw new Error("countryCode isn't registered")
      }
    })
    .withMessage({ message: "COUNTRYCODE_NOT_EXISTS", errorCode: 422 }),
  ev.body(getfieldName<UpdateProfileDtoReq>("description"))
    .optional(),
  ev.body(getfieldName<UpdateProfileDtoReq>("email"))
    .optional()
    .isEmail()
    .withMessage({ message: "EMAIL_NOT_VALID", errorCode: 422 }),
  ev.body(getfieldName<UpdateProfileDtoReq>("profilePictureBase64"))
    .optional()
    .custom(((profilePictureBase64: string) => {
      try {
        base64MimeType(profilePictureBase64)
        return true;
      } catch (error) {
        throw new Error("base 64 isn't a picture")
      }
    }))
    .withMessage({ message: "BASE64_WASNT_PICTURE", errorCode: 422 }),
]

export const followAdd = [
  ev.body(getfieldName<FollowDtoReq>("targetId"))
    .isString()
    .custom(async (targetId: string, { req }) => {
      const cr = req as CustomRequest;
      const userSocialMedia = await UserSocialModel.findOne({ userId: cr.user!.id, followedIds: targetId })
      if (!userSocialMedia)
        return true;
      else
        throw new Error("user already follows target");
    })
    .withMessage({ message: "TARGET_ALREADY_FOLLOWED", errorCode: 422 }),
]

export const followRemove = [
  ev.body(getfieldName<FollowDtoReq>("targetId"))
    .isString()
    .custom(async (targetId: string, { req }) => {
      const cr = req as CustomRequest;
      const userSocialMedia = await UserSocialModel.findOne({ userId: cr.user!.id, followedIds: targetId })
      if (userSocialMedia)
        return true;
      else
        throw new Error("user dosen't follows target");
    })
    .withMessage({ message: "TARGET_NOT_FOLLOWED", errorCode: 422 }),
]