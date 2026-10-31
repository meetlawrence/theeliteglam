import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { JWT } from "../../../../back-end/lib/utils/jwt";
import { adminRepo } from "../../../../back-end/models/admin-models";
import { prisma } from "../../../../back-end/db/db-connect";
import type { AdminRole } from "../../../../back-end/types/token-types";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await JWT.verifyAccessToken(accessToken);
    const currentAdmin = await adminRepo.findById(payload.adminId);

    if (!currentAdmin || !currentAdmin.permitted) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (currentAdmin.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only super admins can view admin users" },
        { status: 403 }
      );
    }

    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permitted: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      admins,
      currentUserId: currentAdmin.id,
      currentUserRole: currentAdmin.role,
    });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to load admins" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await JWT.verifyAccessToken(accessToken);
    const currentAdmin = await adminRepo.findById(payload.adminId);

    if (
      !currentAdmin ||
      !currentAdmin.permitted ||
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { success: false, message: "Only super admins can manage roles" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, role, action } = body as {
      id?: string;
      role?: AdminRole;
      action?: "PERMIT";
    };

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing user id" }, { status: 400 });
    }

    if (action === "PERMIT") {
      const targetAdmin = await adminRepo.findById(id);

      if (!targetAdmin) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      const updatedAdmin = await adminRepo.update(id, { permitted: true });
      return NextResponse.json({ success: true, admin: updatedAdmin });
    }

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (id === currentAdmin.id && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, message: "You cannot remove your own super admin role" },
        { status: 400 }
      );
    }

    const updatedAdmin = await adminRepo.update(id, { role });

    return NextResponse.json({ success: true, admin: updatedAdmin });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const payload = await JWT.verifyAccessToken(accessToken);
    const currentAdmin = await adminRepo.findById(payload.adminId);

    if (
      !currentAdmin ||
      !currentAdmin.permitted ||
      currentAdmin.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json({ success: false, message: "Only super admins can delete users" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing user id" }, { status: 400 });
    }

    if (id === currentAdmin.id) {
      return NextResponse.json({ success: false, message: "You cannot delete your own account" }, { status: 400 });
    }

    await prisma.admin.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
  }
}
