import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        // get the user id from clerk
        const { userId } = auth();
        // get the body from the request
        const body = await req.json();
        // get the name from the body
        const { name } = body;

        // if there is no user id, return unauthorized
        if (!userId) return new Response("Unauthorized", { status: 401 });

        // if there is no name, return bad request
        if (!name) return new Response("Missing name", { status: 400 });

        // create the store
        const store = await prismadb.store.create({
            data: {
                name,
                userId,
            },
        });

        return Response.json(store);
    } catch (err) {
        console.log("[STORES_POST]", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}
