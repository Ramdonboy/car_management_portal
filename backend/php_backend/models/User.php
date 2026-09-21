<?php

declare(strict_types=1);

namespace App\Models;

use App\Config\Database;
use PDO;

class User
{
    protected int $id;
    protected string $name;
    protected string $email;
    protected string $phone;
    protected string $password;
    protected string $role;
    protected string $status;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public static function findByEmail(string $email): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public static function findById(int $id): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user ?: null;
    }

    public static function create(array $data): int
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            'INSERT INTO users (name, email, phone, password, role, status) VALUES (:name, :email, :phone, :password, :role, :status)'
        );

        $stmt->execute([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'phone' => trim($data['phone']),
            'password' => $data['password'],
            'role' => $data['role'],
            'status' => $data['status'] ?? 'pending',
        ]);

        return (int) $pdo->lastInsertId();
    }

    public static function updateProfile(int $userId, string $fullName, string $phone): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE users SET name = :name, phone = :phone WHERE id = :id');

        return $stmt->execute([
            'name' => trim($fullName),
            'phone' => trim($phone),
            'id' => $userId,
        ]);
    }

    public static function verifyPassword(string $password, string $storedPassword): bool
    {
        if (password_verify($password, $storedPassword)) {
            return true;
        }

        return hash_equals($storedPassword, $password);
    }

    public static function updatePasswordHash(int $userId, string $newHash): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare('UPDATE users SET password = :password WHERE id = :id');

        return $stmt->execute([
            'password' => $newHash,
            'id' => $userId,
        ]);
    }

    public static function sanitizeUser(array $user): array
    {
        unset($user['password']);

        return $user;
    }
}
