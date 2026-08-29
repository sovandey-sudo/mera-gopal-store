import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyPaymentInput,
  VerifyPaymentResult,
} from "./types";

/**
 * Mock / Sandbox payment provider for local development.
 * Simulates success without any real money movement.
 * Checkout URL includes access token so complete/fail routes can authorize.
 */
export const mockProvider: PaymentProvider = {
  name: "mock",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const providerOrderId = `mock_order_${input.orderNumber}_${Date.now()}`;
    const tokenQ = input.accessToken
      ? `&token=${encodeURIComponent(input.accessToken)}`
      : "";

    const checkoutUrl = `/api/payments/mock/complete?orderId=${input.orderId}&providerOrderId=${providerOrderId}${tokenQ}`;

    return {
      success: true,
      provider: "mock",
      providerOrderId,
      checkoutUrl,
    };
  },

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResult> {
    if (!input.providerOrderId) {
      return { success: false, status: "FAILED", error: "Missing provider order ID" };
    }

    return {
      success: true,
      status: "PAID",
      providerPaymentId: input.providerPaymentId || `mock_pay_${Date.now()}`,
      amount: undefined,
    };
  },
};
