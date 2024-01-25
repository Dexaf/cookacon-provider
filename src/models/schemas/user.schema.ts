import mongoose from "mongoose";

export const userSchemaName = "Users";

const userSchema = new mongoose.Schema({
  _id: ({
    type: mongoose.Types.ObjectId,
    required: true
  }),
  username: ({
    type: String,
    required: true
  }),
  password: ({
    type: String,
    required: true
  }),
  name: ({
    type: String
  }),
  surname: ({
    type: String
  }),  
  countryCode: ({
    type: String
  }),  
  description: ({
    type: String
  }),
  profilePictureUrl: ({
    type: String
  }),
  email: ({
    type: String
  })
})

export const UserModel = mongoose.model(userSchemaName, userSchema);