"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function CustomerLoginPageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#2c1810]">Sign In</h1>
        <p className="text-sm text-[#2c1810]/60 mt-1">
          Access your orders and saved addresses
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#e8dfd0] rounded-2xl p-6 space-y-4"
      >
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-[#2c1810]/60">
          Don&apos;t have an account?{" "}
          <Link href="/account/register" className="text-[#8B0000] font-medium hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-sm text-[#2c1810]/60">Loading...</div>}>
      <CustomerLoginPageForm />
    </Suspense>
  );
}
