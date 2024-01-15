import { CountryCodesEnum } from "../../enum/country-codes.js";

export interface PostProfileDtoReq {
  name?: string;
  surname?: string;
  countryCode?: CountryCodesEnum;
  description?: string;
  email?: string;
  profilePictureBase64?: string;
}