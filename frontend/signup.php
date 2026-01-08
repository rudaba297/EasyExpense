<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: signup.html');
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';
$confirm = isset($_POST['confirmPassword']) ? $_POST['confirmPassword'] : '';

if ($name === '' || $email === '' || $password === '' || $confirm === '') {
    header('Location: signup.html?error=' . urlencode('Please fill in all fields'));
    exit;
}

if ($password !== $confirm) {
    header('Location: signup.html?error=' . urlencode('Passwords do not match'));
    exit;
}

if (strlen($password) < 8) {
    header('Location: signup.html?error=' . urlencode('Password must be at least 8 characters'));
    exit;
}

$usersFile = __DIR__ . '/../../data/users.txt';
// Ensure directory exists
@mkdir(dirname($usersFile), 0755, true);

$lines = [];
if (file_exists($usersFile)) {
    $lines = file($usersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
}

// Check duplicate
foreach ($lines as $line) {
    $u = json_decode($line, true);
    if (!is_array($u)) continue;
    if (isset($u['email']) && strtolower($u['email']) === strtolower($email)) {
        header('Location: signup.html?error=' . urlencode('Email already registered'));
        exit;
    }
}

// Determine new id
$maxId = 0;
foreach ($lines as $line) {
    $u = json_decode($line, true);
    if (!is_array($u)) continue;
    if (isset($u['id']) && is_numeric($u['id'])) {
        $maxId = max($maxId, (int)$u['id']);
    }
}
$newId = $maxId + 1;

// Hash password
$passwordHash = password_hash($password, PASSWORD_BCRYPT);

$newUser = [
    'id' => $newId,
    'name' => $name,
    'email' => $email,
    'password_hash' => $passwordHash
];

// Append safely
$line = json_encode($newUser) . PHP_EOL;
if (file_put_contents($usersFile, $line, FILE_APPEND | LOCK_EX) === false) {
    header('Location: signup.html?error=' . urlencode('Unable to save user'));
    exit;
}

// Redirect to sign-in with success message
header('Location: signin.html?success=' . urlencode('Registration successful. Please sign in.'));
exit;
