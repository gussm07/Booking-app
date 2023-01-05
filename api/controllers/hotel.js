import Hotel from "../models/Hotel.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    //MARCA UN ERROR PERSONALIZADO DESDE LOS MIDDLEWARES
    next(err);
  }
};

export const updateHotel = async (req, res, next) => {
  /* FIND AN UNIQUE ID FROM SCHEMA  */
  //localhost:8800/api/hotels/635036ad6c98edaa6268debe
  try {
    /* VARIABLE TO FIND IN THE REQUEST--->PARAMS--->ID */
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      /* after finding hotel, set parameters */
      { $set: req.body },
      /* make and update of json, not leave the previous version
      after updating */
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    //MARCA UN ERROR PERSONALIZADO DESDE LOS MIDDLEWARES
    next(err);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    /* VARIABLE TO FIND IN THE REQUEST--->PARAMS--->ID to delete */
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted");
  } catch (err) {
    //MARCA UN ERROR PERSONALIZADO DESDE LOS MIDDLEWARES
    next(err);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    /* VARIABLE TO FIND IN THE REQUEST--->PARAMS--->ID */
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    //MARCA UN ERROR PERSONALIZADO DESDE LOS MIDDLEWARES
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  /* MANEJA EL ERROR EN utils/error.js el cual permite 
  mandar un mensaje de error personalizado dada una
  circunstancia */
  //const failed = true;

  //  if (failed) return next(createError(401, "You are not authenticated!"));

  //define a min and max number to set in a query parameter
  const { min, max, ...others } = req.query;
  try {
    /* VARIABLE TO FIND IN THE REQUEST--->PARAMS--->QUERY */
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 999 },
    })
      /* use a number as a limit, like a filter */
      .limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    //MARCA UN ERROR PERSONALIZADO DESDE LOS MIDDLEWARES
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  /* variable to make a query, searching in cities, separated 
  with a coma, like this:
  localhost:8800/api/hotels/countByCity?cities=berlin,madrid,london */
  const cities = req.query.cities.split(",");
  try {
    /* find inside all documents the "city" parameter, and put 
     into a list*/
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
  /* variable to make a query, searching in cities, separated 
  with a coma, like this:
  localhost:8800/api/hotels/countByType?cities=berlin,madrid,london */

  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });
    res.status(200).json([
      {
        type: "hotel",
        count: hotelCount,
      },
      {
        type: "apartments",
        count: apartmentCount,
      },
      {
        type: "resorts",
        count: resortCount,
      },
      {
        type: "villas",
        count: villaCount,
      },
      {
        type: "cabins",
        count: cabinCount,
      },
    ]);
  } catch (err) {
    next(err);
  }
};
