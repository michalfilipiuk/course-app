"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const FormAddPost = ({ boardId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      await axios.post(`/api/post?boardId=${boardId}`, { title, description });
      setTitle("");
      setDescription("");
      router.refresh();
      toast.success("Post added");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8 w-full md:w-96 shrink-0 md:sticky top-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Suggest a new feature</p>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Title</span>
        </div>
        <input
          required
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text">Description</span>
        </div>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </label>

      <button className="btn btn-primary btn-block" type="submit">
        {isLoading && <span className="loading loading-dots loading-xs"></span>}
        Add Post
      </button>
    </form>
  );
};

export default FormAddPost;
