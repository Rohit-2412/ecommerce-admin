import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // get the user id from clerk
        const { userId } = auth();
        // get the body from the request
        const body = await req.json();
        // get the name from the body
        const { label, imageUrl } = body;

        // if there is no user id, return unauthenticated
        // not logged in
        if (!userId)
            return new NextResponse("Unauthenticated", { status: 401 });

        // if there is no name, return bad request
        if (!label) return new Response("Label is required", { status: 400 });

        // if there is no url, return bad request
        if (!imageUrl)
            return new Response("Image URL is required", { status: 400 });

        // if there is no store id, return bad request
        if (!params.storeId)
            return new Response("Store ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        });

        // don't have the permission to create a billboard
        if (!storeByUserId)
            return new NextResponse("Unauthorized", { status: 403 });

        // create the billboard
        const billboard = await prismadb.billBoard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboard);
    } catch (err) {
        console.log("[BILLBOARDS_POST]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId)
            return new Response("Store ID is required", { status: 400 });

        // get all billboards
        const billboards = await prismadb.billBoard.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(billboards);
    } catch (err) {
        console.log("[BILLBOARDS_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
