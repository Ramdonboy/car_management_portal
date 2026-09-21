<?php

declare(strict_types=1);

namespace App\Helpers;

class Response
{
    public static function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    public static function success(string $message, mixed $data = [], int $status = 200): void
    {
        if (is_array($data) && array_keys($data) !== range(0, count($data) - 1)) {
            $payload = array_merge(['message' => $message], $data);
        } else {
            $payload = ['message' => $message];
            if ($data !== []) {
                $payload['data'] = $data;
            }
        }

        self::json($payload, $status);
    }

    public static function error(string $message, int $status = 400, mixed $data = []): void
    {
        $payload = ['message' => $message];
        if ($data !== []) {
            $payload['data'] = $data;
        }

        self::json($payload, $status);
    }
}
