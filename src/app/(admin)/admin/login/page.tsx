"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

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
    <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#8B0000] flex items-center justify-center text-white text-2xl font-bold mb-3">
            ध
          </div>
          <h1 className="text-2xl font-bold text-[#2c1810]">Admin Login</h1>
          <p className="text-sm text-[#2c1810]/60 mt-1">Devotional Store Management</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#e8dfd0] rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2c1810] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
                placeholder="admin@devotionalstore.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2c1810] mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-center text-[#2c1810]/50 mt-4">
              Dev only seed: admin@devotionalstore.com / Admin@12345
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-sm text-[#2c1810]/60">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
