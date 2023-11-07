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
        const { name, billboardId } = body;

        // if there is no user id, return unauthenticated
        // not logged in
        if (!userId)
            return new NextResponse("Unauthenticated", { status: 401 });

        // if there is no name, return bad request
        if (!name) return new NextResponse("Name is required", { status: 400 });

        // if there is no url, return bad request
        if (!billboardId)
            return new NextResponse("BillboardId is required", { status: 400 });

        // if there is no store id, return bad request
        if (!params.storeId)
            return new NextResponse("Store ID is required", { status: 400 });

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: params.storeId, userId },
        });

        // don't have the permission to create a billboard
        if (!storeByUserId)
            return new NextResponse("Unauthorized", { status: 403 });

        // create the category
        const category = await prismadb.category.create({
            data: { name, billboardId, storeId: params.storeId },
        });

        return NextResponse.json(category);
    } catch (err) {
        console.log("[CATEGORIES_POST]", err);
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

        // get all categories
        const categories = await prismadb.category.findMany({
            where: { storeId: params.storeId },
        });

        return NextResponse.json(categories);
    } catch (err) {
        console.log("[CATEGORIES_GET]", err);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
