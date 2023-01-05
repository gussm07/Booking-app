import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  /* CHECK IF THERE IS A COOKIE */
  const token = req.cookies.access_token;
  /* IF THERE IS NOT A  COOKIE */
  if (!token) {
    /* SEND A ERROR */
    return next(createError(401, "You are not authenticated!"));
  }
  /* VERIFY IF COOKIE IS CORRECT AND THERE IS NOT A ERROR INSIDE */
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    /* IF IT IS ALL OK, GO TO NEXT STEP THAT IS 
    GO TO MIDDELWARE IN users.js AND SEND A MESSAGE
    WITH /checkauthentication */
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    /* ONLY THE SAME USER FROM THE REQUEST AND JWT CAN DELETE YOUR ACCOUNT
                OR IF IT IS AN ADMIN  */

    /* use user variable declared line 15 to know if */
    /* IF user from a JWT is equals to a user params like this :/id 
    or isAdmin  */
    if (req.user.id === req.params.id || req.user.isAdmin) {
      /* VERIFIED USER AND GO TO MIDDLEWARE  */
      next();
    } else {
      return next(createError(403, "You are not authorized"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
