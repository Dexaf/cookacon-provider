#  COOKACON PROVIDER
Hi i'm Federico Pisa and this is the repo for cookacon, a provider for a social-like app based on cooking.
This is a playground for me to use nodeJs with ts and mongoose; the blue print of thwe project is based on my repo [nodejs-atlas](https://github.com/Dexaf/nodejs-atlas).

## Used npm packages
```json
"dependencies": {
  "bcrypt": "^5.1.1",
  "body-parser": "^1.20.2",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "express-validator": "^7.0.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.0.3"
},
"devDependencies": {
  "@types/bcrypt": "^5.0.2",
  "@types/express": "^4.17.21",
  "@types/express-validator": "^3.0.0",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/node": "^20.11.0",
  "nodemon": "^3.0.2",
  "typescript": "^5.3.3"
}
```
## USAGE
This provider allows to create recipes with the REST approach, you can modify the steps and ingredients of the recipe as well as upload the images.
You can signin and login and you have to if you want to add recipes. 
There's a follow-followed system.
You can search even if you are not logged.

You can find a postman collection inside the project.

## USE CASES
images made with [Excalidraw](https://excalidraw.com).
### AUTH CONTROLLER
![auth controller](/api-use-case/auth-controller.png "auth controller")
### FEED CONTROLLER
![feed controller](/api-use-case/feed-controller.png "feed controller")
### RECIPES CONTROLLER
![recipes controller](/api-use-case/recipes-controller.png "recipes controller")
### USERDATA CONTROLLER
![userData controller](/api-use-case/userData-controller.png "userData controller")

## WHAT'S NEXT?
- Add an endpoint to search by title (useless right?)
- Make some enchantment to the performance of the suggestion get endpoint, right now i'm using some classic find which is a bit too slow for this kind of operation. 
- Add swagger.