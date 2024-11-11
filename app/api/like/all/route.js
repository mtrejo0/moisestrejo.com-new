import { NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import { Project } from "../../../../models/Project";
import { revalidatePath } from "next/cache";

export async function GET(request) {
  try {
    await connectToDatabase();
    const projects = await Project.find({});

    revalidatePath("/");

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
