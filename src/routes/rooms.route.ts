import { Router } from "express";
import { createRoom, deleteRoom, getAvailableRooms, getRoomById, getRooms, updateRoom } from "../controllers/rooms.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRoomSchema, updateRoomSchema } from "../schemas/rooms.schema";

const router=Router();

router.get("/",getRooms);
router.get("/available",getAvailableRooms);
router.get("/:id",getRoomById);
router.post("/",authenticate,authorizeAdmin, validate(createRoomSchema),createRoom);
router.put("/:id",authenticate,authorizeAdmin,validate(updateRoomSchema),updateRoom);
router.delete("/:id",authenticate,authorizeAdmin,deleteRoom);


export default router;