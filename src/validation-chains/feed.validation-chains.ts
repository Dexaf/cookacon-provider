import ev from "express-validator";
import { getfieldName } from "../utils/getFieldName.js";
import { SearchSuggestionDtoReq } from "../models/dto/req/feed.dto.req.js";


export const searchSuggestion = [
  ev.query(getfieldName<SearchSuggestionDtoReq>("searchInput"))
    .notEmpty()
    .withMessage({ message: "SEARCHINPUT_EMPTY", errorCode: 422 }),
    ev.query(getfieldName<SearchSuggestionDtoReq>("includeQuarters"))
    .optional()
    .isBoolean()
    .withMessage({ message: "INCLUDEQUARTERS_NOT_BOOL", errorCode: 422 })
]