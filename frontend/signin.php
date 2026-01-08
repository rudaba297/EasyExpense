<?php
session_start();

// Only handle POST submissions here
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: signin.html');
    exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if ($email === '' || $password === '') {
    header('Location: signin.html?error=' . urlencode('Please fill in all fields'));
    exit;
}

// Path to data/users.txt
$usersFile = __DIR__ . '/../../data/users.txt';

if (!file_exists($usersFile)) {
    header('Location: signin.html?error=' . urlencode('No users found'));
    exit;
}

$lines = file($usersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    $u = json_decode($line, true);
    if (!is_array($u)) continue;
    if (isset($u['email']) && strtolower($u['email']) === strtolower($email)) {
        if (isset($u['password_hash']) && password_verify($password, $u['password_hash'])) {
            // Auth success
            $_SESSION['user'] = [
                'id' => isset($u['id']) ? $u['id'] : null,
                'name' => isset($u['name']) ? $u['name'] : '',
                'email' => $u['email']
            ];

            header('Location: dashboard.php');
            exit;
        } else {
            header('Location: signin.html?error=' . urlencode('Invalid credentials'));
            exit;
        }
    }
}

// If we get here no user matched
header('Location: signin.html?error=' . urlencode('Invalid credentials'));
exit;
