"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const ButtonVote = ({ count = 0, postId }) => {
  const localStorageKeyName = `hasVoted-${postId}`;
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(count);

  useEffect(() => {
    setHasVoted(localStorage.getItem(localStorageKeyName) === "true");
  }, [localStorageKeyName]);

  const handleVote = async () => {
    try {
      if(hasVoted) {
        setHasVoted(false);
        setVoteCount(prev => prev - 1);
        toast.success("Vote removed");
        await axios.delete(`/api/vote/${postId}`);
        localStorage.removeItem(localStorageKeyName);
      } else {
        setHasVoted(true);
        setVoteCount(prev => prev + 1);
        toast.success("Vote added");
        await axios.post(`/api/vote/${postId}`);
        localStorage.setItem(localStorageKeyName, "true");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg transition-all
        ${hasVoted 
          ? "bg-primary/10 text-primary" 
          : "bg-base-100"
        }
      `}
      onClick={handleVote}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-5 h-5"
      >
        <path 
          fillRule="evenodd"
          d="M10 17a.75.75 0 0 1-.75-.75V5.612L5.29 9.77a.75.75 0 0 1-1.08-1.04l5.25-5.5a.75.75 0 0 1 1.08 0l5.25 5.5a.75.75 0 1 1-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0 1 10 17Z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-medium">{voteCount}</span>
    </button>
  );
};

export default ButtonVote;
