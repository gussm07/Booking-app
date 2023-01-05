import express from "express";
import { verifyAdmin } from "../../utils/verifyToken.js";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
} from "../controllers/hotel.js";

const router = express.Router();
/* EMPIEZA A CREAR ENDPOINTS */

//------------------CREATE
/* createHotel, exported function from ../controllers/hotel.js */
router.post("/", verifyAdmin, createHotel);

//------------------UPDATE
/* updateHotel, exported function from ../controllers/hotel.js */
router.put("/:id", verifyAdmin, updateHotel);

//------------------DELETE
/* deleteHotel, exported function from ../controllers/hotel.js */
router.delete("/:id", verifyAdmin, deleteHotel);

//------------------GET
/* getHotel, exported function from ../controllers/hotel.js */
//we use /find/ to prevent an error trying to find and id
//in case that we use another endpoint like: /countByCity
router.get("/find/:id", getHotel);

//---------------GET ALL
/* getHotels, exported function from ../controllers/hotel.js */
router.get("/", getHotels);

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);

export default router;
