import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectMongo from "@/app/utils/mongoose";
import User from "@/app/models/User";
import Board from "@/app/models/Board";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    if (!body.name) {
      return NextResponse.json(
        { error: "Board name is required" },
        { status: 400 }
      );
    }

    await connectMongo();
    const user = await User.findById(session.user.id);

    const board = await Board.create({
      userId: user._id,
      name: body.name
    });

    user.boards.push(board._id);
    await user.save();
    
    return NextResponse.json({ board });

  } catch (e) {
    console.error('API Error:', e);
    return NextResponse.json(
      { error: e.message }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    if (!boardId) {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Find and delete the board, ensuring it belongs to the user
    const board = await Board.findOneAndDelete({
      _id: boardId,
      userId: session.user.id
    });

    if (!board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    // Remove board reference from user's boards array
    await User.findByIdAndUpdate(
      session.user.id,
      { $pull: { boards: boardId } }
    );

    return NextResponse.json({ message: "Board deleted successfully" });
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500})
  }
}
