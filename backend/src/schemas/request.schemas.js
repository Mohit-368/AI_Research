import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});
export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});
export const researchSchema = z.object({
  query: z.string().trim().min(3).max(1000),
});
export const feedbackSchema = z.object({
  feedback: z.string().trim().max(2000).optional().default(''),
  rating: z.coerce.number().int().min(1).max(5),
});
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).max(100000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
