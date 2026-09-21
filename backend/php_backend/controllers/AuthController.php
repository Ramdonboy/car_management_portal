<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Models\User;

class AuthController
{
    public function register(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $name = trim((string) ($input['name'] ?? ''));
        $email = trim((string) ($input['email'] ?? ''));
        $phone = trim((string) ($input['phone'] ?? ''));
        $password = trim((string) ($input['password'] ?? ''));

        if (!$name || !$email || !$phone || !$password) {
            Response::error('All fields are required', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        if (!preg_match('/^\d{10}$/', $phone)) {
            Response::error('Phone number must be 10 digits', 400);
        }

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }

        if (User::findByEmail($email)) {
            Response::error('User already exists', 409);
        }

        $hash = password_hash($password, PASSWORD_DEFAULT);
        $userId = User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => $hash,
            'role' => 'user',
            'status' => 'approved',
        ]);

        if (!$userId) {
            Response::error('Registration failed', 500);
        }

        Response::json(['message' => 'Registration successful'], 201);
    }

    public function registerOwner(): void
    {
        $name = trim((string) ($_POST['name'] ?? ''));
        $email = trim((string) ($_POST['email'] ?? ''));
        $phone = trim((string) ($_POST['phone'] ?? ''));
        $address = trim((string) ($_POST['address'] ?? ''));
        $password = trim((string) ($_POST['password'] ?? ''));

        if (!$name || !$email || !$phone || !$address || !$password) {
            Response::error('All fields are required', 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
        }

        if (!preg_match('/^\d{10}$/', $phone)) {
            Response::error('Phone number must be 10 digits', 400);
        }

        if (strlen($password) < 6) {
            Response::error('Password must be at least 6 characters', 400);
        }

        if (!isset($_FILES['license']) || $_FILES['license']['error'] !== UPLOAD_ERR_OK) {
            Response::error('License image required', 400);
        }

        if (User::findByEmail($email)) {
            Response::error('User already exists', 409);
        }

        $licenseFile = $this->saveUpload($_FILES['license'], 'uploads/license');
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $userId = User::create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'password' => $hash,
            'role' => 'owner',
            'status' => 'pending',
        ]);

        $created = \App\Models\Owner::createOwnerProfile($userId, $address, $licenseFile);

        if (!$created) {
            Response::error('Owner registration failed', 500);
        }

        Response::json(['message' => 'Owner registration submitted'], 201);
    }

    public function login(): void
    {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];

        $email = trim((string) ($input['email'] ?? ''));
        $password = trim((string) ($input['password'] ?? ''));

        if (!$email || !$password) {
            Response::error('Email and password are required', 400);
        }

        $user = User::findByEmail($email);
        if (!$user || !User::verifyPassword($password, (string) $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        if (hash_equals((string) $user['password'], $password)) {
            User::updatePasswordHash((int) $user['id'], password_hash($password, PASSWORD_DEFAULT));
        }

        if (($user['role'] ?? '') === 'owner') {
            if (($user['status'] ?? '') === 'pending') {
                Response::error('Your account is pending admin approval', 403);
            }

            if (($user['status'] ?? '') === 'rejected') {
                Response::error('Your registration was rejected by admin', 403);
            }

            if (($user['status'] ?? '') !== 'approved') {
                Response::error('You are not approved by admin', 403);
            }
        }

        $token = AuthMiddleware::createToken([
            'userid' => (int) $user['id'],
            'role' => $user['role'],
            'email' => $user['email'],
        ]);

        unset($user['password']);

        Response::json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function profile(): void
    {
        $payload = AuthMiddleware::requireAuth();
        $user = User::findById((int) $payload['userid']);

        if (!$user) {
            Response::error('User not found', 404);
        }

        unset($user['password']);
        Response::json($user);
    }

    public function updateProfile(): void
    {
        $payload = AuthMiddleware::requireAuth();
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $fullName = trim((string) ($input['fullName'] ?? ''));
        $phone = trim((string) ($input['phone'] ?? ''));

        if (!$fullName || !$phone) {
            Response::error('Full name and phone are required', 400);
        }

        if (!preg_match('/^\d{10}$/', $phone)) {
            Response::error('Phone number must be 10 digits', 400);
        }

        $updated = User::updateProfile((int) $payload['userid'], $fullName, $phone);

        if (!$updated) {
            Response::error('Profile update failed', 500);
        }

        Response::json(['message' => 'Profile updated successfully']);
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
