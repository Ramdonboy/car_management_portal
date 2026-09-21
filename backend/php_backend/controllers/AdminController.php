<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\Admin;

class AdminController
{
    public function revenue(): void
    {
        AuthMiddleware::requireRole(['admin']);
        $summary = Admin::getRevenueSummary();
        Response::json($summary);
    }

    public function bookings(): void
    {
        AuthMiddleware::requireRole(['admin']);
        $rows = Admin::getAllBookings();
        Response::json($rows);
    }

    public function users(): void
    {
        AuthMiddleware::requireRole(['admin']);
        $rows = Admin::getAllUsers();
        Response::json($rows);
    }

    public function ownerRequests(): void
    {
        AuthMiddleware::requireRole(['admin']);
        $rows = \App\Models\Owner::getOwnerRequests();
        Response::json($rows);
    }

    public function updateOwnerStatus(int $userId): void
    {
        AuthMiddleware::requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = strtolower(trim((string) ($input['status'] ?? '')));

        if (!in_array($status, ['approved', 'rejected', 'pending'], true)) {
            Response::error('Invalid status', 400);
        }

        $updated = Admin::updateOwnerStatus($userId, $status);
        if (!$updated) {
            Response::error('User not found', 404);
        }

        Response::json(['message' => 'Status updated successfully']);
    }

    public function updateUserStatus(int $userId): void
    {
        AuthMiddleware::requireRole(['admin']);
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = strtolower(trim((string) ($input['status'] ?? '')));

        if (!in_array($status, ['approved', 'rejected', 'pending'], true)) {
            Response::error('Invalid status', 400);
        }

        $updated = Admin::updateUserStatus($userId, $status);
        if (!$updated) {
            Response::error('User not found', 404);
        }

        Response::json(['message' => 'User status updated']);
    }

    public function listCars(): void
    {
        AuthMiddleware::requireRole(['admin']);
        $rows = \App\Models\Car::getAllVisibleCars();
        Response::json($rows);
    }
}
