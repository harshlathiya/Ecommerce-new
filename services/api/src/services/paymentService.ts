import { nanoid } from "nanoid";
import { config } from "../config.js";

export async function createPaymentIntentStub(input: {
  orderId: string;
  provider: "stripe" | "razorpay";
  amount: number;
  currency: string;
}): Promise<{ clientSecret?: string; providerOrderId: string }> {
  const providerOrderId = `pi_stub_${nanoid(12)}`;
  if (input.provider === "stripe") {
    if (!config.stripeSecretKey) {
      return {
        clientSecret: `stub_secret_${providerOrderId}`,
        providerOrderId,
      };
    }
    // Production: use Stripe SDK here
    return { clientSecret: `stub_secret_${providerOrderId}`, providerOrderId };
  }
  if (!config.razorpayKeyId) {
    return { providerOrderId };
  }
  return { providerOrderId };
}
