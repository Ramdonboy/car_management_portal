<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Helpers\Response;

class AuthMiddleware
{
    private const SECRET_KEY = 'rentacar_secret';

    public static function requireAuth(): array
    {
        $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!$authorization || !preg_match('/^Bearer\s+(.*)$/', $authorization, $matches)) {
            Response::error('Token missing', 401);
        }

        $token = $matches[1];
        $payload = self::verifyToken($token);

        if ($payload === null) {
            Response::error('Invalid token', 401);
        }

        return $payload;
    }

    public static function requireRole(array $allowedRoles): array
    {
        $payload = self::requireAuth();

        if (!in_array($payload['role'] ?? '', $allowedRoles, true)) {
            Response::error('Forbidden', 403);
        }

        return $payload;
    }

    public static function createToken(array $payload): string
    {
        $header = self::base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payloadEncoded = self::base64UrlEncode(json_encode($payload));
        $signatureInput = $header . '.' . $payloadEncoded;
        $signature = hash_hmac('sha256', $signatureInput, self::SECRET_KEY, true);

        return $header . '.' . $payloadEncoded . '.' . self::base64UrlEncode($signature);
    }

    public static function verifyToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            return null;
        }

        [$header, $payload, $signature] = $parts;
        $expectedSignature = self::base64UrlEncode(
            hash_hmac('sha256', $header . '.' . $payload, self::SECRET_KEY, true)
        );

        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $decoded = json_decode(self::base64UrlDecode($payload), true);

        return is_array($decoded) ? $decoded : null;
    }

    private static function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $value): string
    {
        $padding = strlen($value) % 4;

        if ($padding > 0) {
            $value .= str_repeat('=', 4 - $padding);
        }

        return base64_decode(strtr($value, '-_', '+/'), true) ?: '';
    }
}
