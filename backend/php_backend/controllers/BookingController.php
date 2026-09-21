<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\Booking;
use App\Models\Car;

class BookingController
{
    public function bookCar(): void
    {
        $payload = AuthMiddleware::requireRole(['user']);
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $carId = (int) ($input['car_id'] ?? 0);
        $ownerId = (int) ($input['owner_id'] ?? 0);
        $pickup = trim((string) ($input['pickup'] ?? ''));
        $returnDate = trim((string) ($input['returnDate'] ?? ''));
        $total = (float) ($input['total'] ?? 0);

        if (!$carId || !$ownerId || !$pickup || !$returnDate) {
            Response::error('Missing booking details', 400);
        }

        $car = Car::getById($carId);
        if (!$car) {
            Response::error('Car not found', 404);
        }

        if (strtolower((string) $car['status']) === 'booked') {
            Response::error('Car already booked', 400);
        }

        if (Car::hasActiveBooking($carId)) {
            Response::error('Car already booked', 400);
        }

        $created = Booking::create([
            'user_id' => (int) $payload['userid'],
            'car_id' => $carId,
            'owner_id' => $ownerId,
            'pickup' => $pickup,
            'returnDate' => $returnDate,
            'total' => $total,
        ]);

        if (!$created) {
            Response::error('Booking failed', 500);
        }

        Response::json(['message' => 'Booking request sent']);
    }

    public function userBookings(): void
    {
        $payload = AuthMiddleware::requireRole(['user']);
        $rows = Booking::getUserBookings((int) $payload['userid']);
        Response::json($rows);
    }

    public function cancelBooking(int $bookingId): void
    {
        $payload = AuthMiddleware::requireRole(['user']);
        $booking = Booking::getById($bookingId);

        if (!$booking || (int) $booking['user_id'] !== (int) $payload['userid']) {
            Response::error('Not authorized', 403);
        }

        if (strtolower((string) $booking['status']) !== 'pending') {
            Response::error('Cannot cancel now', 400);
        }

        $updated = Booking::cancelByUser($bookingId, (int) $payload['userid']);
        if (!$updated) {
            Response::error('Cancellation failed', 500);
        }

        $carId = Booking::getBookingCarId($bookingId);
        if ($carId !== null) {
            Car::setStatus($carId, 'available');
        }

        Response::json(['message' => 'Booking cancelled']);
    }
}
