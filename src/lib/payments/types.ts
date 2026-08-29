export type PaymentProviderName = "mock" | "razorpay";

export interface CreatePaymentInput {
  orderId: string;
  orderNumber: string;
  amount: number; // in INR
  currency?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  successUrl: string;
  failureUrl: string;
  /** Guest/owner access token for mock payment authorization */
  accessToken?: string;
}

export interface CreatePaymentResult {
  success: boolean;
  provider: PaymentProviderName;
  providerOrderId?: string;
  providerPaymentId?: string;
  checkoutUrl?: string; // redirect URL for hosted checkout
  clientSecret?: string; // for client-side SDKs
  error?: string;
}

export interface VerifyPaymentInput {
  providerOrderId?: string;
  providerPaymentId?: string;
  signature?: string; // for Razorpay webhook/signature
  rawPayload?: unknown;
}

export interface VerifyPaymentResult {
  success: boolean;
  status: "PAID" | "FAILED" | "PENDING" | "REFUNDED";
  providerPaymentId?: string;
  amount?: number;
  error?: string;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult>;
}
