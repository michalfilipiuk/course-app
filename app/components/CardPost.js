import ButtonVote from "./ButtonVote";

const CardPost = ({post}) => {
    return (
        <li className="bg-base-100 p-6 rounded-2xl justify-between">
            <div className="bg-base-100 p-6 rounded-2xl">
                <h2 className="font-bold text-lg mb-1">{post.title}</h2>
                <p className="opacity-80 leading-relaxed max-h-32 overflow-scroll">{post.description}</p>
            </div>
            <ButtonVote count={post.votesCounter} hasVoted={post.hasVoted} />
        </li>
    )
}

export default CardPost