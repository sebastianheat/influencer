"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/auth";

export type ActionState = { error?: string } | undefined;

const registerSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  role: z.enum(["BRAND", "CREATOR"]),
});

export async function registerUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const { name, email, password, role } = parsed.data;
  const lowerEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: lowerEmail } });
  if (existing) return { error: "Ese email ya está registrado" };

  const passwordHash = await bcrypt.hash(password, 10);
  const handle = "@" + lowerEmail.split("@")[0].replace(/[^a-z0-9_.]/g, "");

  await prisma.user.create({
    data: {
      name,
      email: lowerEmail,
      passwordHash,
      role,
      brand: role === "BRAND" ? { create: { name } } : undefined,
      creator:
        role === "CREATOR"
          ? { create: { handle, bio: "", location: "Chile" } }
          : undefined,
    },
  });

  try {
    await signIn("credentials", {
      email: lowerEmail,
      password,
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "No se pudo iniciar sesión" };
    throw e; // redirect
  }
  return undefined;
}

export async function authenticate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (e) {
    if (e instanceof AuthError) return { error: "Email o contraseña incorrectos" };
    throw e; // redirect
  }
  return undefined;
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
