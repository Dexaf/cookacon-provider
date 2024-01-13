import dotenv from 'dotenv';

let result

try {
  result = dotenv.config()
} catch (error: any) {
  throw new Error(error)
}

export const { parsed: envs } = result;