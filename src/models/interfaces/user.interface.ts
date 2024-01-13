import { CountryCodesEnum } from "../enum/country-codes.js";

export interface UserInterface {
  id: string;
  username: string;
  name: string;
  surname: string;
  country: CountryCodesEnum;
  description: string;
  email: string;
  profilePictureUrl: string;
}