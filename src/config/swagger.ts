import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:       "Hotel Booking API",
      version:     "1.0.0",
      description: "A Hotel Room Booking REST API built with Node.js, Express, TypeScript and PostgreSQL",
    },
    servers: [
      {
        url:         "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:         "http",
          scheme:       "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // ── Rooms ──────────────────────────────────────
        Room: {
          type: "object",
          properties: {
            id:           { type: "integer",  example: 1 },
            room_number:  { type: "string",   example: "101" },
            type:         { type: "string",   example: "deluxe" },
            price:        { type: "number",   example: 5000 },
            is_available: { type: "boolean",  example: true },
          },
        },
        CreateRoomBody: {
          type:     "object",
          required: ["room_number", "type", "price"],
          properties: {
            room_number:  { type: "string",  example: "101" },
            type:         { type: "string",  example: "deluxe" },
            price:        { type: "number",  example: 5000 },
            is_available: { type: "boolean", example: true },
          },
        },
        // ── Guests ─────────────────────────────────────
        Guest: {
          type: "object",
          properties: {
            id:    { type: "integer", example: 1 },
            name:  { type: "string",  example: "Dammar Bhatt" },
            email: { type: "string",  example: "dammar@email.com" },
            phone: { type: "string",  example: "9800000000" },
          },
        },
        CreateGuestBody: {
          type:     "object",
          required: ["name", "email", "phone"],
          properties: {
            name:  { type: "string", example: "Dammar Bhatt" },
            email: { type: "string", format:"email", example: "dammar@email.com" },
            phone: { type: "string", example: "9800000000" },
          },
        },
        // ── Bookings ───────────────────────────────────
        Booking: {
          type: "object",
          properties: {
            id:          { type: "integer", example: 1 },
            guest_id:    { type: "integer", example: 1 },
            room_id:     { type: "integer", example: 1 },
            check_in:    { type: "string",  example: "2024-01-01" },
            check_out:   { type: "string",  example: "2024-01-05" },
            total_price: { type: "number",  example: 20000 },
            status:      { type: "string",  example: "confirmed" },
          },
        },
        CreateBookingBody: {
          type:     "object",
          required: ["guest_id", "room_id", "check_in", "check_out"],
          properties: {
            guest_id:  { type: "integer", example: 1 },
            room_id:   { type: "integer", example: 1 },
            check_in:  { type: "string",  example: "2024-01-01" },
            check_out: { type: "string",  example: "2024-01-05" },
          },
        },
        // ── Auth ───────────────────────────────────────
        RegisterBody: {
          type:     "object",
          required: ["name", "email", "password","confirmPsd"],
          properties: {
            name:     { type: "string", example: "Dammar Bhatt" },
            email:    { type: "string", example: "dammar@email.com" },
            password: { type: "string", example: "123456" },
            confirmPsd: { type: "string", example: "123456" },
          },
        },
        LoginBody: {
          type:     "object",
          required: ["email", "password"],
          properties: {
            email:    { type: "string", example: "dammar@email.com" },
            password: { type: "string", example: "123456" }
          },
        },
        UpdateUserPasswordBody: {
          type:     "object",
          required: ["currentPassword", "newPassword"],
          properties: {
            currentPassword:    { type: "string", example: "test1234" },
            newPassword: { type: "string", example: "test123456" }
          },
        },
        // ── API Response ───────────────────────────────
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            message: { type: "string" },
            data:    { },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);