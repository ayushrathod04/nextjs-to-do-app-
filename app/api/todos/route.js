import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs_crud");

    // get all todos
    const todos = await db.collection("todos").find({}).toArray();

    return Response.json(todos);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title } = await req.json();
    const client = await clientPromise;
    const db = client.db("nextjs_crud");

    // insert a new todo
    const result = await db.collection("todos").insertOne({
      title,
      done: false,
    });

    return Response.json({ insertedId: result.insertedId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
