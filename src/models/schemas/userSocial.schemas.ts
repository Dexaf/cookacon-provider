import mongoose from "mongoose";
import { userSchemaName } from "./user.schema.js";

export const userSocialSchemaName = "UsersSocial";

const userSocialScheme = new mongoose.Schema({
  userId: ({
    type: mongoose.Types.ObjectId,
    required: true,
    ref: userSchemaName
  }),
  followersIds: ({
    type: [mongoose.Types.ObjectId],
    required: true,
    ref: userSchemaName,
    default: []
  }),
  followedIds: ({
    type: [mongoose.Types.ObjectId],
    required: true,
    ref: userSchemaName,
    default: []
  })
})

export const UserSocialModel =  mongoose.model(userSocialSchemaName, userSocialScheme);