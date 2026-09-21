<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Models\Car;

class CarController
{
    public function viewAllCars(): void
    {
        $cars = Car::getAllVisibleCars();
        Response::json($cars);
    }
}
