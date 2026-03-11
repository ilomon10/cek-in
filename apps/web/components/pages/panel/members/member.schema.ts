import { z } from "zod";

export const memberMembershipConfigSchema = z.object({
  type: "membership",
  startDate: z.string(),
  endDate: z.string(),
});

export const eventMembershipConfigSchema = z.object({
  type: "event",
  startDate: z.string(),
  endDate: z.string(),
});

export const packageMembershipConfigSchema = z.object({
  type: "package",
  startDate: z.string(),
  endDate: z.string(),
});

export const memberConfigSchema = z.discriminatedUnion("type", [
  memberMembershipConfigSchema,
  eventMembershipConfigSchema,
  packageMembershipConfigSchema,
]);
