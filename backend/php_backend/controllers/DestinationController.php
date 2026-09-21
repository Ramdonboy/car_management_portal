<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use PDO;

class DestinationController
{
    public function search(): void
    {
        $keyword = trim((string) ($_GET['q'] ?? ''));
        if ($keyword === '') {
            Response::error('Search keyword is required', 400);
        }

        $pdo = Database::getConnection();
        $stmt = $pdo->prepare(
            "SELECT c.*, o.address,
                    CASE WHEN EXISTS (
                        SELECT 1 FROM bookings b
                        WHERE b.car_id = c.car_id
                        AND b.status IN ('pending', 'accepted', 'approved')
                    ) THEN 'booked' ELSE 'available' END AS status
             FROM cars c
             JOIN owners o ON c.owner_id = o.owner_id
             WHERE c.is_deleted = FALSE
             AND (
                 c.name LIKE :keyword
                 OR c.type LIKE :keyword
                 OR c.fuel LIKE :keyword
                 OR o.address LIKE :keyword
                 OR c.reg_number LIKE :keyword
             )
             ORDER BY c.car_id DESC"
        );

        $search = '%' . $keyword . '%';
        $stmt->execute(['keyword' => $search]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        Response::json($results);
    }
}
