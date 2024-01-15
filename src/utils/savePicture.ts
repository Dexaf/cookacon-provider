import { promises as fsPromises } from 'fs';

//NOTE - this function works thinking that the profilePictureBase64 param is a valid base64 Picture!
export const savePicture = async (profilePictureBase64: string, imagePath: string) => {
  try {
    const base64Image = profilePictureBase64.split(';base64,').pop();
    const buffer = Buffer.from(base64Image!, "base64");
    await fsPromises.writeFile(imagePath, buffer);
  } catch (error: any) {
    throw new Error(error);
  }
}