import { NextResponse } from "next/server";
import connectMongo from "@/app/utils/mongoose";
import Post from "@/app/models/Post";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");

  try {
    await connectMongo();
    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    post.votesCounter += 1;
    await post.save();
    return NextResponse.json({ message: "Vote counted", votesCounter: post.votesCounter }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to connect to MongoDB" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
  
    try {
      await connectMongo();
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
      }
      post.votesCounter -= 1;
      await post.save();
      return NextResponse.json({ message: "Vote counted" }, { status: 200 });
  
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to connect to MongoDB" },
        { status: 500 }
      );
    }
  }
