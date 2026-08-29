import type { PaymentProvider, PaymentProviderName } from "./types";
import { mockProvider } from "./mock";

/**
 * Payment provider factory.
 * Switch provider via environment variable PAYMENT_PROVIDER.
 * Default: "mock" (safe for development, zero cost).
 */
export function getPaymentProvider(): PaymentProvider {
  const name = (process.env.PAYMENT_PROVIDER || "mock") as PaymentProviderName;

  switch (name) {
    case "mock":
      return mockProvider;
    case "razorpay":
      // Future: return razorpayProvider;
      // For now fall back to mock until Razorpay keys are configured
      console.warn("Razorpay provider not yet configured — using mock");
      return mockProvider;
    default:
      return mockProvider;
  }
}

export type { CreatePaymentInput, CreatePaymentResult, VerifyPaymentInput, VerifyPaymentResult } from "./types";
