import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { createBooking, getBookingByGuestId, getBookingById, getBookings, updateBooking} from "../controllers/bookings.controller";
import { validate } from "../middleware/validate";
import { createBookingSchema } from "../schemas/bookings.schema";

const router = Router();

router.get("/",authenticate,getBookings);
router.get("/:id",authenticate,getBookingById);
router.post("/",authenticate,validate(createBookingSchema),createBooking);
router.put("/:id/cancel",authenticate,updateBooking);
router.get("/guest/:guestId",authenticate,getBookingByGuestId);

export default router;