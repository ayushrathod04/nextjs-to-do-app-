import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// UPDATE a todo (title or done)
export async function PUT(req, { params }) {
  try {
    const { id } = params; // todo id from URL
    const body = await req.json(); // can contain { title, done }
    const client = await clientPromise;
    const db = client.db("nextjs_crud");

    // Build update object dynamically
    const updateFields = {};
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.done !== undefined) updateFields.done = body.done;

    await db.collection("todos").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    return Response.json({ message: "Todo updated" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a todo
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db("nextjs_crud");

    await db.collection("todos").deleteOne({ _id: new ObjectId(id) });

    return Response.json({ message: "Todo deleted" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
