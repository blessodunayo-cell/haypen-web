"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [stayLoggedIn, setStayLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message || "Failed to sign in.");
      return;
    }

    router.push("/feed");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f1edf8] flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-[520px] rounded-[18px] border border-[#ddd6ea] bg-[#fbfaff] px-6 py-7 shadow-[0_18px_45px_rgba(79,60,130,0.12)] sm:px-7">
        <h1 className="mb-5 text-[16px] font-extrabold text-black">Haypen</h1>

        <h2 className="mb-3 text-[30px] font-extrabold leading-none tracking-tight text-black">
          Sign in
        </h2>

        <p className="mb-6 text-[14px] text-[#5f5b6b]">
          Welcome back. Sign in to continue.
        </p>

        <form onSubmit={handleLogin}>
          <label className="mb-2 block text-[14px] font-bold text-black">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mb-4 h-[50px] w-full rounded-[12px] border border-[#ddd3f1] bg-white px-4 text-[16px] text-black outline-none transition focus:border-[#b8a7e6]"
          />

          <label className="mb-2 block text-[14px] font-bold text-black">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            required
            className="mb-4 h-[50px] w-full rounded-[12px] border border-[#ddd3f1] bg-white px-4 text-[16px] text-black outline-none transition focus:border-[#b8a7e6]"
          />

          <label className="mb-5 flex items-center gap-2 text-[14px] text-[#4f4a5f]">
            <input
              type="checkbox"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
              className="h-[13px] w-[13px]"
            />
            Stay logged in
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mb-5 h-[48px] w-full rounded-full bg-black text-[16px] font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {errorMsg && (
            <div className="mb-5 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] font-semibold text-red-600">
              {errorMsg}
            </div>
          )}

          <div className="flex items-center justify-between text-[14px]">
            <Link href="/forgot-password" className="text-black underline">
              Forgot password?
            </Link>

            <p className="text-[#5f5b6b]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-black underline">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}