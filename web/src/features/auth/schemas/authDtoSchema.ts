import { z } from "zod";

const roleSchema = z.enum(["Resident", "Ngo", "Jst", "Admin"]);

/** POST /api/auth/login and /api/auth/admin/login. */
export const loginResponseDtoSchema = z.object({
  accessToken: z.string(),
  expiresInSeconds: z.number(),
  user: z.object({
    id: z.string(),
    login: z.string(),
    displayName: z.string(),
    role: roleSchema,
    organizationName: z.string().nullable(),
  }),
});

/** GET /api/auth/demo-accounts: seeded accounts offered by the simulated Profil Zaufany screen. */
export const demoAccountListDtoSchema = z.array(
  z.object({
    login: z.string(),
    displayName: z.string(),
    role: roleSchema,
    organizationName: z.string().nullable(),
  }),
);

export type LoginResponseDto = z.infer<typeof loginResponseDtoSchema>;
export type DemoAccount = z.infer<typeof demoAccountListDtoSchema>[number];

/** Form values; messages are translation keys under `Auth.errors`. */
export const loginFormSchema = z.object({
  login: z.string().trim().min(1, { message: "loginRequired" }).max(256, { message: "loginRequired" }),
  password: z.string().min(1, { message: "passwordRequired" }).max(128, { message: "passwordRequired" }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
