import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    //encoding password with bcryptjs library
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    /* creating a new collection with newUser variable */
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      //password encoded with bcryptjs library
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created!");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    /* find a user inside database with findOne due to
    is one user with a one username */
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    /* if password is correct, compare with encryption
    and get the request and the database */
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    /* then return a error if the password is incorrect*/
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username"));

    /* CREATE A JWT RO MANAGE A HOTEL USING THE userID and if it isAdmin
    and create a secretKey with the next command in terminal: 
    openssl rand -base64 32: SECRET KEY
    SECRET KEY are stored in .env file*/
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    /* variables password and isAdmin are hidden 
      from a request due to security, these variables
      are stored in ...otherDetails */
    const { password, isAdmin, ...otherDetails } = user._doc;
    /* name a cookie as "access_token, 
    first: verify a token"
    second: verify user information and if isAdmin, you can 
    CRUD a hotel */
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ ...otherDetails });
  } catch (err) {
    next(err);
  }
};
