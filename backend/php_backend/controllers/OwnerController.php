<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\Booking;
use App\Models\Car;

class OwnerController
{
    public function viewCars(): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);
        $cars = Car::getOwnerCars((int) $payload['userid']);
        Response::json($cars);
    }

    public function addCar(): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);

        if (!isset($_FILES['car_image']) || $_FILES['car_image']['error'] !== UPLOAD_ERR_OK) {
            Response::error('Car image is required', 400);
        }

        if (!isset($_FILES['rc_book']) || $_FILES['rc_book']['error'] !== UPLOAD_ERR_OK) {
            Response::error('RC book is required', 400);
        }

        $regNumber = strtoupper(trim((string) ($_POST['reg_number'] ?? '')));
        $name = trim((string) ($_POST['name'] ?? ''));

        if (!$regNumber || !$name) {
            Response::error('Car name and registration number are required', 400);
        }

        if (!preg_match('/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/', $regNumber)) {
            Response::error('Invalid registration format (Example: KL07AB1234)', 400);
        }

        if (Car::carExistsByRegNumber($regNumber)) {
            Response::error('Car already exists', 400);
        }

        $carImageName = $this->saveUpload($_FILES['car_image'], 'uploads/car_image');
        $rcBookName = $this->saveUpload($_FILES['rc_book'], 'uploads/rc_book');

        $created = Car::register([
            'owner_id' => (int) $payload['userid'],
            'reg_number' => $regNumber,
            'name' => $name,
            'type' => $_POST['type'] ?? 'SUV',
            'fuel' => $_POST['fuel'] ?? 'Petrol',
            'transmission' => $_POST['transmission'] ?? 'Manual',
            'seats' => $_POST['seats'] ?? 4,
            'price_per_day' => $_POST['price_per_day'] ?? 0,
            'status' => $_POST['status'] ?? 'available',
            'image' => $carImageName,
            'rc_book' => $rcBookName,
        ]);

        if (!$created) {
            Response::error('Car add failed', 500);
        }

        Response::json(['message' => 'Car added successfully'], 201);
    }

    public function updateCar(int $carId): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $car = Car::getById($carId);
        if (!$car || (int) $car['owner_id'] !== (int) $payload['userid']) {
            Response::error('Not authorized', 403);
        }

        $name = trim((string) ($input['name'] ?? $car['name']));
        $fuel = trim((string) ($input['fuel'] ?? $car['fuel']));
        $seats = (int) ($input['seats'] ?? $car['seats']);
        $pricePerDay = (float) ($input['price_per_day'] ?? $car['price_per_day']);

        $updated = Car::updateOwnerCar($carId, (int) $payload['userid'], [
            'name' => $name,
            'fuel' => $fuel,
            'seats' => $seats,
            'price_per_day' => $pricePerDay,
        ]);

        if (!$updated) {
            Response::error('Car update failed', 500);
        }

        Response::json(['message' => 'Car updated successfully']);
    }

    public function deleteCar(int $carId): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);
        $car = Car::getById($carId);

        if (!$car || (int) $car['owner_id'] !== (int) $payload['userid']) {
            Response::error('Not authorized', 403);
        }

        if (Car::hasActiveBooking($carId)) {
            Response::error('Car is booked. Cannot delete.', 400);
        }

        $deleted = Car::softDelete($carId);
        if (!$deleted) {
            Response::error('Delete failed', 500);
        }

        Response::json(['message' => 'Car deleted successfully']);
    }

    public function bookings(): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);
        $rows = Booking::getOwnerBookings((int) $payload['userid']);
        Response::json($rows);
    }

    public function updateBookingStatus(int $bookingId): void
    {
        $payload = AuthMiddleware::requireRole(['owner']);
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $status = strtolower(trim((string) ($input['status'] ?? '')));

        $booking = Booking::getById($bookingId);
        if (!$booking) {
            Response::error('Booking not found', 404);
        }

        $ownerId = Booking::getBookingOwnerId($bookingId);
        if ($ownerId !== (int) $payload['userid']) {
            Response::error('Not authorized', 403);
        }

        if ($status !== 'accepted' && $status !== 'rejected') {
            Response::error('Invalid booking action', 400);
        }

        $updated = Booking::updateStatus($bookingId, $status);
        if (!$updated) {
            Response::error('Status update failed', 500);
        }

        if ($status === 'accepted') {
            $carId = Booking::getBookingCarId($bookingId);
            if ($carId !== null) {
                Car::setStatus($carId, 'booked');
            }
        }

        Response::json(['message' => 'Status updated']);
    }

    private function saveUpload(array $file, string $targetFolder): string
    {
        $allowed = ['image/jpeg', 'image/jpg', 'image/png'];
        $maxSize = 2 * 1024 * 1024;

        if (!isset($file['tmp_name']) || !is_uploaded_file($file['tmp_name'])) {
            Response::error('Invalid upload file', 400);
        }

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowed, true)) {
            Response::error('Only JPG and PNG files are allowed', 400);
        }

        if ($file['size'] > $maxSize) {
            Response::error('File is too large. Max 2MB allowed', 400);
        }

        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $safeName = uniqid('upload_', true) . '.' . $extension;
        $fullPath = __DIR__ . '/../../' . $targetFolder;

        if (!is_dir($fullPath)) {
            mkdir($fullPath, 0777, true);
        }

        $destination = $fullPath . '/' . $safeName;

        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            Response::error('Upload failed', 500);
        }

        return $safeName;
    }
}
