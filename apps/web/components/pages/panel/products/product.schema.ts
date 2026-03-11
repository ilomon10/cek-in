import { z } from "zod";

const membershipConfigSchema = z.object({
  type: z.literal("membership"),
  duration_days: z.number().int().min(-1),
  visit_limit: z.number().int().min(-1).nullable().optional(),
  recurring: z.boolean().optional(),
  grace_period_days: z.number().int().min(0).optional(),
});

const eventConfigSchema = z.object({
  type: z.literal("event"),
  event_start: z.string(),
  event_end: z.string(),
  venue: z.string().optional(),
  max_capacity: z.number().int().min(1).optional(),
  allow_multiple_entry: z.boolean().optional(),
});

const packageConfigSchema = z.object({
  type: z.literal("package"),
  visit_quota: z.number().int().min(1),
  expiry_days: z.number().int().min(1).optional(),
});

export const productConfigSchema = z.discriminatedUnion("type", [
  membershipConfigSchema,
  eventConfigSchema,
  packageConfigSchema,
]);

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  descriptions: z.string().optional(),
  price: z.coerce.number().int().min(1),
  currency: z.string(),
  features: z.array(
    z.object({
      title: z.string(),
    }),
  ),
  config: productConfigSchema,
});

export type ProductSchema = z.infer<typeof productSchema>;
