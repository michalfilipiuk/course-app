import connectMongo from "@/app/utils/mongoose";
import Board from "@/app/models/Board";
import Post from "@/app/models/Post";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CardBoardLink from "@/app/components/CardBoardLink";
import ButtonDeleteBoard from "@/app/components/ButtonDeleteBoard";
import FormAddPost from "@/app/components/FormAddPost";
import CardPostAdmin from "@/app/components/CardPostAdmin";

const getData = async (boardId) => {
  const session = await auth();
  await connectMongo();
  const board = await Board.findOne({
    _id: boardId,
    userId: session?.user?.id,
  });

  if (!board) {
    redirect("/dashboard");
  }

  const posts = await Post.find({
    boardId: boardId,
  }).sort({ createdAt: -1 });

  return { board, posts };
};

export default async function FeedbackBoard({ params }) {
  const { boardId } = params;
  const { board, posts } = await getData(boardId);
  return (
    <main className="bg-base-200 min-h-screen">
      <section className="bg-base-100">
        <div className="px-5 py-3 flex max-w-5xl mx-auto">
          <Link href="/dashboard" className="btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M14 8a.75.75 0 0 1-.75.75H4.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 0 1 1.06 1.06L4.56 7.25h8.69A.75.75 0 0 1 14 8Z"
                clipRule="evenodd"
              />
            </svg>
            Back
          </Link>
        </div>
      </section>

      <section className="px-5 py-12 max-w-5xl mx-auto space-y-12 flex flex-col gap-4 md:flex-row">
        <div className="flex flex-row gap-4">
          <h1 className="font-extrabold text-xl">{board.name}</h1>
          <CardBoardLink boardId={board._id} />
          <ButtonDeleteBoard boardId={board._id} />
        </div>
      </section>

      <section className="px-5 py-12 max-w-5xl mx-auto space-y-12 flex flex-col gap-4 md:flex-row">
        <FormAddPost boardId={board._id} />
        <ul className="space-y-4 flex-grow items-start justify-start">
          {posts.map((post) => (
            <CardPostAdmin key={post._id} post={post} />
          ))}
        </ul>
      </section>
    </main>
  );
}
