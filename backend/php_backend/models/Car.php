<?php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Car
{
    public static function getAllVisibleCars(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query(
            "SELECT c.*, o.address,
                    CASE WHEN EXISTS (
                        SELECT 1 FROM bookings b
                        WHERE b.car_id = c.car_id
                        AND b.status IN ('pending', 'accepted', 'approved')
                    ) THEN 'booked' ELSE 'available' END AS status
             FROM cars c
             JOIN owners o ON c.owner_id = o.owner_id
             WHERE c.is_deleted = FALSE
             ORDER BY c.car_id DESC"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getOwnerCars(int $ownerId): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM cars WHERE owner_id = :owner_id AND is_deleted = FALSE');
        $stmt->execute(['owner_id' => $ownerId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getById(int $carId): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM cars WHERE car_id = :car_id LIMIT 1');
        $stmt->execute(['car_id' => $carId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public static function register(array $data): bool
    {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare(
            'INSERT INTO cars (owner_id, reg_number, name, type, fuel, transmission, seats, price_per_day, status, image, rc_book) VALUES (:owner_id, :reg_number, :name, :type, :fuel, :transmission, :seats, :price_per_day, :status, :image, :rc_book)'
        );

        return $stmt->execute([
            'owner_id' => (int) $data['owner_id'],
            'reg_number' => strtoupper(trim($data['reg_number'])),
            'name' => trim($data['name']),
            'type' => trim($data['type']) ?: 'SUV',
            'fuel' => trim($data['fuel']) ?: 'Petrol',
            'transmission' => trim($data['transmission']) ?: 'Manual',
            'seats' => (int) ($data['seats'] ?? 4),
            'price_per_day' => (float) ($data['price_per_day'] ?? 0),
            'status' => strtolower(trim((string) ($data['status'] ?? 'available'))),
            'image' => $data['image'] ?? null,
            'rc_book' => $data['rc_book'] ?? null,
        ]);
    }

    public static function updateOwnerCar(int $carId, int $ownerId, array $data): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'UPDATE cars SET name = :name, fuel = :fuel, seats = :seats, price_per_day = :price_per_day WHERE car_id = :car_id AND owner_id = :owner_id'
        );

        return $stmt->execute([
            'name' => trim($data['name']),
            'fuel' => trim($data['fuel']),
            'seats' => (int) $data['seats'],
            'price_per_day' => (float) $data['price_per_day'],
            'car_id' => $carId,
            'owner_id' => $ownerId,
        ]);
    }

    public static function softDelete(int $carId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE cars SET is_deleted = TRUE WHERE car_id = :car_id');

        return $stmt->execute(['car_id' => $carId]);
    }

    public static function hasActiveBooking(int $carId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            "SELECT 1 FROM bookings WHERE car_id = :car_id AND status IN ('pending', 'accepted', 'approved') LIMIT 1"
        );
        $stmt->execute(['car_id' => $carId]);

        return (bool) $stmt->fetchColumn();
    }

    public static function setStatus(int $carId, string $status): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE cars SET status = :status WHERE car_id = :car_id');

        return $stmt->execute([
            'status' => strtolower(trim($status)),
            'car_id' => $carId,
        ]);
    }

    public static function carExistsByRegNumber(string $regNumber): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT 1 FROM cars WHERE reg_number = :reg_number LIMIT 1');
        $stmt->execute(['reg_number' => strtoupper(trim($regNumber))]);

        return (bool) $stmt->fetchColumn();
    }
}
