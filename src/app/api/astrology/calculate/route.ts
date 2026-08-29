import { NextResponse } from "next/server";
import { z } from "zod";
import { getAstrologyService } from "@/lib/astrology";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, clientKey, RATE_LIMITS } from "@/lib/security/rate-limit";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  timeOfBirth: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:mm"),
  placeOfBirth: z.string().min(2, "Place of birth is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  timezone: z.string().optional(),
  country: z.string().optional(),
  saveProfile: z.boolean().optional(),
});

export async function POST(req: Request) {
  const rl = checkRateLimit(clientKey(req, "astrology"), RATE_LIMITS.astrology);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const service = getAstrologyService();

    const result = await service.calculate({
      name: data.name,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.timeOfBirth,
      placeOfBirth: data.placeOfBirth,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      country: data.country,
    });

    if (data.saveProfile) {
      const session = await auth();
      if (session?.user) {
        await prisma.astrologyProfile.create({
          data: {
            userId: session.user.id,
            name: data.name,
            dateOfBirth: new Date(data.dateOfBirth),
            timeOfBirth: data.timeOfBirth,
            placeOfBirth: data.placeOfBirth,
            latitude: data.latitude ?? null,
            longitude: data.longitude ?? null,
            timezone: data.timezone ?? null,
          },
        });
      }
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Astrology calculation error:", e);
    return NextResponse.json(
      {
        engine: "error",
        calculatedAt: new Date().toISOString(),
        success: false,
        error: "Unable to process request. Please try again.",
      },
      { status: 500 }
    );
  }
}
