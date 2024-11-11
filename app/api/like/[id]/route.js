import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import connectToDatabase from "../../../../lib/mongodb";
import { Project } from "../../../../models/Project";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const project = await Project.findOne({ id });
    const likeCount = project ? project.likeCount : 0;

    revalidatePath("/");

    return NextResponse.json({ count: likeCount });
  } catch (error) {
    console.error("Error fetching like count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();
    const project = await Project.findOneAndUpdate(
      { id },
      { $inc: { likeCount: 1 } },
      { upsert: true, new: true },
    );

    revalidatePath("/");

    return NextResponse.json({ count: project.likeCount });
  } catch (error) {
    console.error("Error updating like count:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
