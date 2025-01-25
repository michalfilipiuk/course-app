import connectMongo from "@/app/utils/mongoose"
import Board from "@/app/models/Board"
import { redirect } from "next/navigation"

const getBoard = async(boardId) => {
    await connectMongo()
    const board = await Board.findById(boardId)

    if (!board) {
        redirect("/")
    }



    return board
}


export default async function PublicFeedbackBoard({params}) {

    const {boardId} = params
    const board = await getBoard(boardId)
    return <main>{board.name} (public)</main>
}