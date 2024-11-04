interface Booking {
  id: string;
  userId: string;
  gymId: string;
  duration: number;
  totalAmount: number;
}

export class BookingRepository {
  // This is a mock implementation. In the actual app, this would interact with the database.
  async getBookingById(id: string): Promise<Booking | null> {
    // Dummy data for illustration purpose
    const dummyBooking: Booking = {
      id: "booking_123",
      userId: "user_456",
      gymId: "gym_789",
      duration: 2,
      totalAmount: 2000,
    };

    return id === dummyBooking.id ? dummyBooking : null;
  }
}
