import { ErrorExt } from "../models/extensions/error.extension.js";

export const base64MimeType = (encoded: string) => {
  let mime = encoded.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mime && mime.length) {
    return mime[1];
  } else {
    throw new ErrorExt("BASE64_WASNT_PICTURE", 422)
  }
}