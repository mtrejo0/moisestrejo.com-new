import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "../../../../../lib/mongodb";
import { Comment } from "../../../../../models/Comment";

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const id = params.id;
    const comment = await Comment.findById(id);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    comment.likes += 1;
    await comment.save();

    revalidatePath("/");

    return NextResponse.json(comment, { status: 200 });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
