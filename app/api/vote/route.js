import { NextResponse } from "next/server";
import connectMongo from "@/app/utils/mongoose";
import Post from "@/app/models/Post";
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await connectMongo();
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Get current user's session
    const session = await auth();
    const hasVoted = false; // You'll need to implement your vote tracking logic here

    return NextResponse.json({ 
      votesCounter: post.votesCounter,
      hasVoted
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch vote status" },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  try {
    const { postId } = params;
    await connectMongo();
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.votesCounter += 1;
    await post.save();

    return NextResponse.json({ 
      message: "Vote added",
      votesCounter: post.votesCounter
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add vote" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { postId } = params;
    await connectMongo();
    const post = await Post.findById(postId);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    post.votesCounter = Math.max(0, post.votesCounter - 1);
    await post.save();

    return NextResponse.json({ 
      message: "Vote removed",
      votesCounter: post.votesCounter
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to remove vote" },
      { status: 500 }
    );
  }
}

// Helper function to check if user has voted
async function checkIfUserVoted(postId, userId) {
  // You might want to implement this based on your data model
  // For now, we'll rely on localStorage in the frontend
  return false;
}
