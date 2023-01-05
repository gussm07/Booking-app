import express from "express";
import {
  verifyAdmin,
  verifyToken,
  verifyUser,
} from "../../utils/verifyToken.js";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";

const router = express.Router();

/* CHECK IF THERE IS A JWT and if it correct*/
/* router.get("/checkauthentication", verifyToken, (req, res, next) => {
  res.send("hello user, you are logged in");
});

router.get("/checkuser/:id", verifyUser, (req, res, next) => {
  res.send("hello user, you are logged in and you can delete your account");
});

router.get("/checkadmin/:id", verifyAdmin, (req, res, next) => {
  res.send("hello admin, you are logged in and you can delete all accounts");
});
 */
/* EMPIEZA A CREAR ENDPOINTS */

//------------------UPDATE
/* updateUser, exported function from ../controllers/hotel.js */
router.put("/:id", verifyUser, updateUser);

//------------------DELETE
/* deleteUser, exported function from ../controllers/hotel.js */
router.delete("/:id", verifyUser, deleteUser);

//------------------GET
/* getUser, exported function from ../controllers/hotel.js */
router.get("/:id", verifyUser, getUser);

//---------------GET ALL
/* getUsers, exported function from ../controllers/hotel.js */
router.get("/", verifyAdmin, getUsers);

export default router;
