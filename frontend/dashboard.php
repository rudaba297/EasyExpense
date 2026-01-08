<?php
session_start();

if (!isset($_SESSION['user'])) {
    header('Location: signin.html');
    exit;
}

$htmlFile = __DIR__ . '/dashboard.html';
if (!file_exists($htmlFile)) {
    echo 'Dashboard not found.';
    exit;
}

$html = file_get_contents($htmlFile);

// Replace the static welcome name with the logged-in user name
$userName = htmlspecialchars($_SESSION['user']['name'] ?? '');
$html = str_replace('Welcome back, Rudro.', 'Welcome back, ' . $userName . '.', $html);

// (Logout button added directly in dashboard.html header)
// No additional injection required here.

echo $html;
