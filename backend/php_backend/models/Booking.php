<?php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Booking
{
    public static function create(array $data): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO bookings (user_id, car_id, owner_id, pickup_date, return_date, total_price, status) VALUES (:user_id, :car_id, :owner_id, :pickup_date, :return_date, :total_price, :status)'
        );

        return $stmt->execute([
            'user_id' => (int) $data['user_id'],
            'car_id' => (int) $data['car_id'],
            'owner_id' => (int) $data['owner_id'],
            'pickup_date' => $data['pickup'],
            'return_date' => $data['returnDate'],
            'total_price' => (float) $data['total'],
            'status' => 'pending',
        ]);
    }

    public static function getById(int $bookingId): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM bookings WHERE booking_id = :booking_id LIMIT 1');
        $stmt->execute(['booking_id' => $bookingId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public static function getOwnerBookings(int $ownerId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'SELECT b.*, u.name AS user_name, u.phone AS phone_no, c.name AS car_name
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN cars c ON b.car_id = c.car_id
             WHERE c.owner_id = :owner_id'
        );
        $stmt->execute(['owner_id' => $ownerId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getUserBookings(int $userId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'SELECT b.*, c.name AS car_name, c.image
             FROM bookings b
             JOIN cars c ON b.car_id = c.car_id
             WHERE b.user_id = :user_id'
        );
        $stmt->execute(['user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function updateStatus(int $bookingId, string $status): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE bookings SET status = :status WHERE booking_id = :booking_id');

        return $stmt->execute([
            'status' => strtolower(trim($status)),
            'booking_id' => $bookingId,
        ]);
    }

    public static function cancelByUser(int $bookingId, int $userId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'UPDATE bookings SET status = :status WHERE booking_id = :booking_id AND user_id = :user_id AND status = :current_status'
        );

        return $stmt->execute([
            'status' => 'cancelled',
            'booking_id' => $bookingId,
            'user_id' => $userId,
            'current_status' => 'pending',
        ]);
    }

    public static function getBookingOwnerId(int $bookingId): ?int
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT owner_id FROM bookings WHERE booking_id = :booking_id LIMIT 1');
        $stmt->execute(['booking_id' => $bookingId]);

        $ownerId = $stmt->fetchColumn();

        return $ownerId === false ? null : (int) $ownerId;
    }

    public static function getBookingCarId(int $bookingId): ?int
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT car_id FROM bookings WHERE booking_id = :booking_id LIMIT 1');
        $stmt->execute(['booking_id' => $bookingId]);

        $carId = $stmt->fetchColumn();

        return $carId === false ? null : (int) $carId;
    }
}
