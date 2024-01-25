import { CountryCodesEnum } from "../../enum/country-codes.js";

export interface UpdateProfileDtoReq {
  name?: string;
  surname?: string;
  countryCode?: CountryCodesEnum;
  description?: string;
  email?: string;
  profilePictureBase64?: string;
}

export interface FollowDtoReq {
  targetId: string;
}