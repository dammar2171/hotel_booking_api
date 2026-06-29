import { Router } from "express";
import { getGuests, getGuestById, createGuest, deleteGuest ,updateGuest} from "../controllers/guests.controller";
import { validate } from "../middleware/validate";
import { createGuestSchema ,updateGuestSchema} from "../schemas/guests.schema";

const router = Router();

router.get("/", getGuests);
router.get("/:id", getGuestById);
router.post("/", validate(createGuestSchema),createGuest);
router.put("/:id", validate(updateGuestSchema),updateGuest);
router.delete("/:id", deleteGuest);

export default router;
