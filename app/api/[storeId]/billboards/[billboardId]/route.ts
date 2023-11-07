import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", {
                status: 400,
            });
        }

        const billboard = await prismadb.billBoard.findUnique({
            where: {
                id: params.billboardId,
            },
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { billboardId: string; storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        if (!label) return new Response("Missing label", { status: 400 });

        if (!imageUrl)
            return new Response("Missing image URL", { status: 400 });

        if (!params.billboardId)
            return new Response("BillboardId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        });

        // don't have the permission to create a billboard
        if (!storeByUserId)
            return new NextResponse("Unauthorized", { status: 403 });

        const billboard = await prismadb.billBoard.updateMany({
            where: { id: params.billboardId },
            data: { label, imageUrl },
        });

        return NextResponse.json(billboard);
    } catch (err) {
        console.log("[BILLBOARD_PATCH]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string; billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId)
            return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.billboardId)
            return new Response("BillboardId is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        });

        // don't have the permission to create a billboard
        if (!storeByUserId)
            return new NextResponse("Unauthorized", { status: 403 });

        const billboard = await prismadb.billBoard.deleteMany({
            where: { id: params.billboardId },
        });

        return NextResponse.json(billboard);
    } catch (err) {
        console.log("[BILLBOARD_DELETE]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
