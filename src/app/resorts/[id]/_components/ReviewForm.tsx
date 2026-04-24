"use client";

import { useActionState, useState } from "react";
import type { ReviewState } from "@/lib/actions/reviews";

interface ReviewFormProps {
  submitAction: (_prev: ReviewState, formData: FormData) => Promise<ReviewState>;
}

export function ReviewForm({ submitAction }: ReviewFormProps) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitAction, undefined);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <p className="text-emerald-400 font-semibold">Review submitted — thanks!</p>
        <p className="mt-1 text-sm text-white/40">Your review is now live.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="rating" value={rating} />

      {state?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      {/* Star picker */}
      <div>
        <p className="mb-2 text-sm font-medium text-white/60">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="transition-transform hover:scale-110"
            >
              <svg
                viewBox="0 0 20 20"
                className={`h-8 w-8 transition-colors ${
                  star <= (hover || rating) ? "fill-gold text-gold" : "fill-white/15 text-white/15"
                }`}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-sm text-white/40">
              {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Review text */}
      <div>
        <label htmlFor="review-text" className="mb-2 block text-sm font-medium text-white/60">
          Your review
        </label>
        <textarea
          id="review-text"
          name="text"
          rows={4}
          required
          placeholder="Share your experience — conditions, trails, vibe…"
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-gold/40 focus:bg-white/8"
        />
      </div>

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-navy transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
}
