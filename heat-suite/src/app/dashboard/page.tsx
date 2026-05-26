import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function DashboardRedirect() {
  const session = await auth();
  const role = session?.user?.role;
  if (role === "ADMIN") redirect("/admin");
  if (role === "CREATOR") redirect("/creator");
  if (role === "BRAND") redirect("/brand");
  redirect("/login");
}
