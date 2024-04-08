import { NextResponse } from "next/server";
import { GetUser } from "@/utils/userData";
export async function GET() {
  try {
    const user = await GetUser();
    if (user.id) {
      return NextResponse.json({ status: "success" });
    }
  } catch (error) {
    return NextResponse.json({ status: "error" });
  }
}
