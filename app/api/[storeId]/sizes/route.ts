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
        const { name, value } = body;

        // if there is no user id, return unauthenticated
        // not logged in
        if (!userId)
            return new NextResponse("Unauthenticated", { status: 401 });

        // if there is no name, return bad request
        if (!name) return new Response("Name is required", { status: 400 });

        // if there is no url, return bad request
        if (!value) return new Response("value is required", { status: 400 });

        // if there is no store id, return bad request
        if (!params.storeId)
            return new Response("Store ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        });

        // don't have the permission to create a Size
        if (!storeByUserId)
            return new NextResponse("Unauthorized", { status: 403 });

        const size = await prismadb.size.create({
            data: {
                name,
                value,
                storeId: params.storeId,
            },
        });

        return NextResponse.json(size);
    } catch (err) {
        console.log("[SIZES_POST]", err);
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

        const sizes = await prismadb.size.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        return NextResponse.json(sizes);
    } catch (err) {
        console.log("[SIZES_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
