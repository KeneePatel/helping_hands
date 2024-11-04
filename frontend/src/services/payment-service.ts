export interface CreateBookingRequest {
  userId: string;
  gymId: string;
  startDate: string;
  endDate: string;
  charges: number;
}

export class PaymentService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  }

  async createPaymentIntent(charges: number): Promise<string> {
    const apiUri = `${this.apiUrl}/api/create-payment-intent`;
    const response = await fetch(apiUri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ charges }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  }

  async createBooking(bookingRequest: CreateBookingRequest): Promise<Boolean> {
    const apiUri = `${this.apiUrl}/api/create-booking`;
    const response = await fetch(apiUri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingRequest),
    });

    if (!response.ok) {
      throw new Error("Failed to create the booking");
    }

    return true;
  }
}
