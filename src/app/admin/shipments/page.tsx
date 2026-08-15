import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ShipmentsClient from "./shipmentsClient";

export default async function ShipmentsPage() {
  const cookieStore = await cookies();

  const adminCookie =
    cookieStore.get("vanguard_admin")?.value;

  if (adminCookie !== "authenticated") {
    redirect("/admin/login");
  }

  return <ShipmentsClient />;
}