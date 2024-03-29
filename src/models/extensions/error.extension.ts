import { ValidationError } from "express-validator";

//we add status code extra propr to handle the errors inside a middleware
export class ErrorExt extends Error {
  constructor(message: string, statusCode: number, errors?: ValidationError[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors || [];
  }

  statusCode: number;
  errors?: ValidationError[];
}
