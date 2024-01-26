import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { SearchDtoReq, SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";


export const searchSuggestion = [
  ev.query(getfieldName<SearchSuggestionDtoReq>("searchInput"))
    .notEmpty()
    .withMessage({ message: "SEARCHINPUT_EMPTY", errorCode: 422 }),
  ev.query(getfieldName<SearchSuggestionDtoReq>("includeQuarters"))
    .optional()
    .isBoolean()
    .withMessage({ message: "INCLUDEQUARTERS_NOT_BOOL", errorCode: 422 })
]

export const pagination = [
  ev.query(getfieldName<SearchDtoReq>("quantity"))
    .optional()
    .isInt({ min: 0 })
    .withMessage({ message: "QUANTITY_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
  ev.query(getfieldName<SearchDtoReq>("page"))
    .isInt({ min: 0 })
    .withMessage({ message: "PAGE_MUST_BE_POSITIVE_INTEGER", errorCode: 422 }),
]