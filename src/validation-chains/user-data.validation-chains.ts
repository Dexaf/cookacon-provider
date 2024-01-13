import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { PostProfileDto } from "../models/dto/req/user-data.dto.js";
import { base64MimeType } from "../utils/getBase64MimeType.js";
import { CountryCodesEnum } from "../models/enum/country-codes.js";


export const postProfile = [
  ev.body(getfieldName<PostProfileDto>("name"))
    .optional(),
  ev.body(getfieldName<PostProfileDto>("surname"))
    .optional(),
  ev.body(getfieldName<PostProfileDto>("countryCode"))
    .optional()
    .custom((countryCode: string) => {
      if (Object.values(CountryCodesEnum).includes(countryCode as CountryCodesEnum)) {
        return true
      } else {
        throw new Error("countryCode isn't registered")
      }
    })
    .withMessage({ message: "COUNTRYCODE_NOT_EXISTS", errorCode: 422 }),
  ev.body(getfieldName<PostProfileDto>("description"))
    .optional(),
  ev.body(getfieldName<PostProfileDto>("email"))
    .optional()
    .isEmail()
    .withMessage({ message: "EMAIL_NOT_VALID", errorCode: 422 }),
  ev.body(getfieldName<PostProfileDto>("profilePictureBase64"))
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