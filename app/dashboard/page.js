import ButtonLogout from "../components/ButtonLogout";
import FormNewBoard from "../components/FormNewBoard";
import { auth } from "@/auth";
import connectMongo from "../utils/mongoose";
import User from "../models/User";
import Board from "../models/Board";
import Link from "next/link";
import ButtonCheckout from "../components/ButtonCheckout";

async function getUser() {
  const session = await auth();
  await connectMongo();
  return await User.findById(session.user.id).populate("boards");
}

export default async function Dashboard() {
  const user = await getUser();

  return (
    <main className="bg-base-200 min-h-screen">
      {/* Header */}
      <section className="bg-base-100">
        <div className="px-5 py-3 flex justify-between">
          <ButtonCheckout/>
          <ButtonLogout />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-12 space-y-12">
        <FormNewBoard />
        <div>
          <h1 className="font-extrabold text-xl mb-4">
            {user.boards.length} Boards
          </h1>
          <ul className="flex flex-col gap-4">
            {user.boards.map((board) => (
              <Link
                href={`/dashboard/b/${board._id}`}
                key={board._id}
                className="bg-base-100 py-4 px-8 hover:scale-[1.01] transition-transform rounded-lg"
              >
                {board.name}
              </Link>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
