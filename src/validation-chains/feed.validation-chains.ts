import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { SearchByTitleReq, SearchDtoReq, SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";


export const searchSuggestion = [
  ev.query(getfieldName<SearchSuggestionDtoReq>("searchInput"))
    .notEmpty()
    .withMessage({ message: "SEARCHINPUT_EMPTY", errorCode: 422 })
]

export const pagination = [
  ev.query(getfieldName<SearchDtoReq>("quantity"))
    .optional()
    .isInt({ min: 0 })
    .withMessage({ message: "QUANTITY_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
  ev.query(getfieldName<SearchDtoReq>("page"))
    .notEmpty()
    .withMessage({ message: "PAGE_MISSING", errorCode: 422 })
    .isInt({ min: 0 })
    .withMessage({ message: "PAGE_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
]

export const searchByTitle = [
  ev.query(getfieldName<SearchByTitleReq>("searchInput"))
    .notEmpty()
    .withMessage({ message: "SEARCHINPUT_EMPTY", errorCode: 422 }),
  ev.query(getfieldName<SearchByTitleReq>("quantity"))
    .optional()
    .isInt({ min: 0 })
    .withMessage({ message: "QUANTITY_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
  ev.query(getfieldName<SearchByTitleReq>("page"))
    .notEmpty()
    .withMessage({ message: "PAGE_MISSING", errorCode: 422 })
    .isInt({ min: 0 })
    .withMessage({ message: "PAGE_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
]