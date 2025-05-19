import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { nama, email, password } = await request.json();

  if (!nama || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: { nama, email, password },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      // error unique constraint failed (email)
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
