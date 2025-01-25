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
