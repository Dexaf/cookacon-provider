import { CountryCodesEnum } from "../../enum/country-codes.js";

export interface PostProfileDto {
  name?: string;
  surname?: string;
  countryCode?: CountryCodesEnum;
  description?: string;
  email?: string;
  profilePictureBase64?: string;
}