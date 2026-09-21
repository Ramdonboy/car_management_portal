<?php

declare(strict_types=1);

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\BookingController;
use App\Controllers\CarController;
use App\Controllers\DestinationController;
use App\Controllers\OwnerController;
use App\Helpers\Response;

require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Owner.php';
require_once __DIR__ . '/../models/Admin.php';
require_once __DIR__ . '/../models/Car.php';
require_once __DIR__ . '/../models/Booking.php';
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/AdminController.php';
require_once __DIR__ . '/../controllers/OwnerController.php';
require_once __DIR__ . '/../controllers/BookingController.php';
require_once __DIR__ . '/../controllers/CarController.php';
require_once __DIR__ . '/../controllers/DestinationController.php';

$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$basePath = '/rentacar/backend/public';
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH) ?? '/';
if (str_starts_with($path, $basePath)) {
    $path = substr($path, strlen($basePath));
}
if ($path === '') {
    $path = '/';
}

$method = $_SERVER['REQUEST_METHOD'];

$routes = [
    'GET' => [
        '/api/test-db' => function (): void {
            \App\Config\Database::getConnection()->query('SELECT 1');
            Response::json(['message' => 'Database connected successfully']);
        },
        '/api/admin/revenue' => [AdminController::class, 'revenue'],
        '/api/admin/bookings' => [AdminController::class, 'bookings'],
        '/api/admin/users' => [AdminController::class, 'users'],
        '/api/admin/owner-requests' => [AdminController::class, 'ownerRequests'],
        '/api/admin/cars' => [AdminController::class, 'listCars'],
        '/api/view/car' => [CarController::class, 'viewAllCars'],
        '/api/view/owner/cars' => [OwnerController::class, 'viewCars'],
        '/api/owner/bookings' => [OwnerController::class, 'bookings'],
        '/api/user/bookings' => [BookingController::class, 'userBookings'],
        '/api/profile' => [AuthController::class, 'profile'],
        '/api/search' => [DestinationController::class, 'search'],
    ],
    'POST' => [
        '/api/register' => [AuthController::class, 'register'],
        '/api/register/owner' => [AuthController::class, 'registerOwner'],
        '/api/login' => [AuthController::class, 'login'],
        '/api/book-car' => [BookingController::class, 'bookCar'],
        '/api/add/car' => [OwnerController::class, 'addCar'],
    ],
    'PUT' => [
        '/api/admin/user-status/:id' => [AdminController::class, 'updateUserStatus'],
        '/api/admin/update-owner-status/:id' => [AdminController::class, 'updateOwnerStatus'],
        '/api/booking/status/:id' => [OwnerController::class, 'updateBookingStatus'],
        '/api/updateprofile' => [AuthController::class, 'updateProfile'],
        '/api/booking/cancel/:id' => [BookingController::class, 'cancelBooking'],
        '/api/update-car/:id' => [OwnerController::class, 'updateCar'],
    ],
    'DELETE' => [
        '/delete-car/:id' => [OwnerController::class, 'deleteCar'],
    ],
];

foreach ($routes[$method] ?? [] as $route => $handler) {
    $routePattern = preg_quote($route, '#');
    $routePattern = str_replace('\\:id', '([0-9]+)', $routePattern);
    $pattern = '#^' . $routePattern . '$#';

    if (preg_match($pattern, $path, $matches)) {
        array_shift($matches);

        if (is_array($handler)) {
            [$controller, $methodName] = $handler;
            $instance = new $controller();
            if ($matches) {
                $matches = array_map(static fn ($value) => is_numeric($value) ? (int) $value : $value, $matches);
                call_user_func_array([$instance, $methodName], $matches);
            } else {
                $instance->$methodName();
            }
            exit;
        }

        if (is_callable($handler)) {
            $handler();
            exit;
        }
    }
}

Response::error('Route not found', 404);
