import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth";
import { createContact, deleteContact, getContacts } from "../controllers/contacts.controller";
import { validate } from "../middleware/validate";
import { createContactSchema } from "../schemas/contacts.schema";

const router = Router();

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacs
 *     description: Returns a paginated list of contacts.
 *     tags: [Contacts]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       201:
 *         description: Message founds!
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticate,authorizeAdmin,getContacts);

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateContactBody'
 *     responses:
 *       201:
 *         description: Contact created successfully
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticate,validate(createContactSchema) ,createContact);

/**
 * @swagger
 * /contacts/{id}:
 *   post:
 *     summary: Delete a contact
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       204:
 *         description: Contact not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticate,authorizeAdmin ,deleteContact);

export default router;
