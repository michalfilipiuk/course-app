import ButtonDeletePost from "./ButtonDeletePost";

const CardPostAdmin = ({ post }) => {
  return (
    <div className="bg-base-100 p-8 rounded-3xl space-y-8">
      <h1 className="font-extrabold text-xl">{post.title}</h1>
      <p>{post.description}</p>
      <div className="flex flex-row gap-4">
        <ButtonDeletePost postId={post._id} />
      </div>
    </div>
  );
};

export default CardPostAdmin;
