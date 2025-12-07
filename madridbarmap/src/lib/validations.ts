import { z } from "zod";

export const createBarSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().max(200).optional(),
  googlePlaceId: z.string().optional(),
});

export const createReviewSchema = z.object({
  terraza: z.enum(["SIN_TERRAZA", "PEQUENA", "GRANDE"]),
  precioDoble: z.number().min(0).max(999.99),
  tapa: z.enum(["SIN_TAPA", "REGULAR", "SUPER_TAPA"]),
});

export type CreateBarSchema = z.infer<typeof createBarSchema>;
export type CreateReviewSchema = z.infer<typeof createReviewSchema>;
