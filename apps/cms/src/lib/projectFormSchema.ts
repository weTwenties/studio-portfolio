import { z } from "zod";

const timelineObjectSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const timelineSchema = z.union([timelineObjectSchema, z.null()]);

export const casePointSchema = z.object({
  label: z.string(),
  text: z.string(),
});

export const projectImageSchema = z.object({
  url: z.string(),
  isPrimary: z.boolean().optional(),
  base64: z.string().optional(),
  name: z.string().optional(),
  type: z.string().optional(),
});

export const memberProjectLinkSchema = z.object({
  memberId: z.string(),
  roleLabel: z.string().nullable(),
});

export const projectFormSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  sourceLocale: z.enum(["vi", "en"]),
  title: z.string().min(1),
  summary: z.string().nullable(),
  coverUrl: z.string().nullable(),
  demoUrl: z.string().nullable(),
  tags: z.array(z.string()),
  timeline: timelineSchema,
  caseStudy: z
    .object({
      kicker: z.string().optional(),
      problem: z.string().optional(),
      solution: z.string().optional(),
      result: z.string().optional(),
      points: z.array(casePointSchema).optional(),
      images: z.array(projectImageSchema).optional(),
    })
    .nullable(),
  memberProjects: z.array(memberProjectLinkSchema),
  sortOrder: z.number(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
