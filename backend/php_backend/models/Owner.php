<?php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class Owner extends User
{
    public static function createOwnerProfile(int $userId, string $address, string $licenseImage): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO owners (owner_id, address, license_image) VALUES (:owner_id, :address, :license_image)'
        );

        return $stmt->execute([
            'owner_id' => $userId,
            'address' => trim($address),
            'license_image' => $licenseImage,
        ]);
    }

    public static function getOwnerRequests(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query(
            "SELECT u.id, u.name, u.email, u.phone, u.status, o.address AS place, o.license_image
             FROM users u
             LEFT JOIN owners o ON u.id = o.owner_id
             WHERE u.role = 'owner'"
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function getOwnerByUserId(int $userId): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM owners WHERE owner_id = :owner_id LIMIT 1');
        $stmt->execute(['owner_id' => $userId]);

        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
