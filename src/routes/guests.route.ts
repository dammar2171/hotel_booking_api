import { Router } from "express";
import { getGuests, getGuestById, createGuest, deleteGuest ,updateGuest} from "../controllers/guests.controller";
import { validate } from "../middleware/validate";
import { createGuestSchema ,updateGuestSchema} from "../schemas/guests.schema";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/",authenticate, getGuests);
router.get("/:id",authenticate, getGuestById);
router.post("/",authenticate, validate(createGuestSchema),createGuest);
router.put("/:id",authenticate, validate(updateGuestSchema),updateGuest);
router.delete("/:id",authenticate, deleteGuest);

export default router;
