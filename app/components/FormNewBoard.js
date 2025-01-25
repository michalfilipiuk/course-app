"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const FormNewBoard = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await axios.post("api/board", {name})
      setName("");
      router.refresh()
      toast.success("Board added")

    } catch (error) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="bg-base-100 p-8 rounded-3xl space-y-8"
      onSubmit={handleSubmit}
    >
      <p className="font-bold text-lg">Create a new feedback board</p>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Board name</span>
        </div>
        <input
          required
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button className="btn btn-primary btn-block" type="submit">
        {isLoading && <span className="loading loading-dots loading-xs"></span>}
        Create Board
      </button>
    </form>
  );
};

export default FormNewBoard;
