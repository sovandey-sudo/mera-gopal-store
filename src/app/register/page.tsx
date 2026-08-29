"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/login");
        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2c1810]">Create Account</h1>
          <p className="text-sm text-[#2c1810]/60 mt-1">
            Save addresses, track orders and more
          </p>
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
              <label className="block text-sm font-medium text-[#2c1810] mb-1.5">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1.5">Email *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1.5">Phone (optional)</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
                placeholder="+91 ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1.5">Password *</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2c1810] mb-1.5">Confirm Password *</label>
              <input
                type="password"
                required
                value={form.confirm}
                onChange={(e) => update("confirm", e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#e8dfd0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B0000]/30 focus:border-[#8B0000]"
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-sm text-center text-[#2c1810]/60 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#8B0000] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
