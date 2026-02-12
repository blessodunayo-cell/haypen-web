"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Supabase sends recovery tokens in the URL hash: #access_token=...&type=recovery
  useEffect(() => {
    // If there's no hash, user opened page directly
    if (!window.location.hash) {
      setMsg("No recovery token found. Please request a new reset link.");
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);

    if (password.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMsg(error.message);
      return;
    }

    setMsg("Password updated successfully. Redirecting to login…");
    setTimeout(() => router.replace("/login"), 900);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h1 className="text-xl font-bold">Reset password</h1>
        <p className="text-neutral-300 mt-2 text-sm">
          Enter a new password for your account.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <div>
            <label className="text-sm text-neutral-300">New password</label>
            <input
              className="mt-1 w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Confirm password</label>
            <input
              className="mt-1 w-full rounded-lg bg-black border border-neutral-700 px-3 py-2 outline-none"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm password"
            />
          </div>

          {msg ? <div className="text-sm text-neutral-300">{msg}</div> : null}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-white text-black font-semibold py-2 hover:bg-neutral-200 disabled:opacity-60"
            type="submit"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
