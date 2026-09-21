<?php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Admin extends User
{
    public static function getAllUsers(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query(
            "SELECT u.id, u.name, u.email, u.phone, u.status,
                    COUNT(b.booking_id) AS bookings,
                    IFNULL(SUM(b.total_price), 0) AS total_spent
             FROM users u
             LEFT JOIN bookings b ON u.id = b.user_id
             WHERE u.role = 'user'
             GROUP BY u.id"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getAllBookings(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query(
            "SELECT b.booking_id, b.pickup_date, b.return_date, b.total_price, LOWER(b.status) AS status,
                    u.name AS user_name, o.name AS owner_name, c.name AS car_name
             FROM bookings b
             JOIN users u ON b.user_id = u.id
             JOIN cars c ON b.car_id = c.car_id
             JOIN users o ON c.owner_id = o.id
             ORDER BY b.booking_id DESC"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function updateUserStatus(int $userId, string $status): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE users SET status = :status WHERE id = :id AND role = :role');

        return $stmt->execute([
            'status' => $status,
            'id' => $userId,
            'role' => 'user',
        ]);
    }

    public static function updateOwnerStatus(int $ownerId, string $status): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE users SET status = :status WHERE id = :id');

        return $stmt->execute([
            'status' => strtolower(trim($status)),
            'id' => $ownerId,
        ]);
    }

    public static function getRevenueSummary(): array
    {
        $pdo = Database::getConnection();

        $totalStmt = $pdo->query(
            "SELECT COALESCE(SUM(total_price), 0) AS totalRevenue
             FROM bookings
             WHERE status IN ('completed', 'approved', 'accepted')"
        );
        $monthlyStmt = $pdo->query(
            "SELECT DATE_FORMAT(pickup_date, '%Y-%m') AS month,
                    COALESCE(SUM(total_price), 0) AS revenue
             FROM bookings
             WHERE status IN ('completed', 'approved', 'accepted')
             GROUP BY month
             ORDER BY month ASC"
        );
        $countStmt = $pdo->query(
            "SELECT COUNT(*) AS totalBookings
             FROM bookings
             WHERE status IN ('completed', 'approved', 'accepted')"
        );

        return [
            'totalRevenue' => (float) $totalStmt->fetch(PDO::FETCH_ASSOC)['totalRevenue'],
            'monthlyRevenue' => $monthlyStmt->fetchAll(PDO::FETCH_ASSOC),
            'totalBookings' => (int) $countStmt->fetch(PDO::FETCH_ASSOC)['totalBookings'],
        ];
    }
}
