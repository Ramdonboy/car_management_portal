<?php

declare(strict_types=1);

if (preg_match('#^/uploads/(car_image|license|rc_book)/([^/]+)$#', parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/', $matches)) {
	$folder = $matches[1];
	$filename = basename(rawurldecode($matches[2]));
	$file = __DIR__ . '/../../uploads/' . $folder . '/' . $filename;

	if (!is_file($file)) {
		http_response_code(404);
		exit;
	}

	$mime = mime_content_type($file) ?: 'application/octet-stream';
	header('Content-Type: ' . $mime);
	readfile($file);
	exit;
}

require_once __DIR__ . '/../routes/api.php';
