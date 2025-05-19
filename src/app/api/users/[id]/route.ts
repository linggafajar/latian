import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { nama, email, password } = await request.json();

  if (!nama || !email || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { nama, email, password },
    });
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2025") {
      // record not found
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    if (error.code === "P2002") {
      // unique constraint failed (email)
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User dihapus" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
