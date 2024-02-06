import { promises as fsPromises } from 'fs';

export default async (error: Error) => {
  try {
    await fsPromises.writeFile('errorLog.txt', error.message + '\n' + error.stack);
    console.error(error);
  } catch (error) {
    console.error("shit hitted the fan m8");
  }
}