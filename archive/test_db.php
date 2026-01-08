<?php
/**
 * Database Connection Test
 * Tests MySQL connection and verifies schema
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = '127.0.0.1';
$port = '3307';
$dbname = 'easyexpense';
$username = 'root';
$password = ''; // XAMPP default

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Connection Test - EasyExpense</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #1a202c;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        
        .subtitle {
            color: #718096;
            margin-bottom: 30px;
        }
        
        .status-card {
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            border-left: 4px solid;
        }
        
        .status-card.success {
            background: #f0fdf4;
            border-color: #48bb78;
        }
        
        .status-card.error {
            background: #fef2f2;
            border-color: #f56565;
        }
        
        .status-card.info {
            background: #eff6ff;
            border-color: #667eea;
        }
        
        .status-card h2 {
            font-size: 1.25rem;
            margin-bottom: 10px;
        }
        
        .status-card.success h2 {
            color: #22543d;
        }
        
        .status-card.error h2 {
            color: #742a2a;
        }
        
        .status-card.info h2 {
            color: #2c5282;
        }
        
        .status-card p {
            color: #4a5568;
            line-height: 1.6;
        }
        
        .status-card code {
            background: rgba(0, 0, 0, 0.05);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }
        
        th {
            background: #f7fafc;
            font-weight: 600;
            color: #2d3748;
        }
        
        .check {
            color: #48bb78;
            margin-right: 8px;
        }
        
        .cross {
            color: #f56565;
            margin-right: 8px;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
            transition: transform 0.2s;
        }
        
        .btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔌 Database Connection Test</h1>
        <p class="subtitle">EasyExpense - XAMPP Setup Verification</p>
        
        <?php
        try {
            // Attempt connection
            $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
            $pdo = new PDO($dsn, $username, $password);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            echo '<div class="status-card success">';
            echo '<h2><span class="check">✓</span>Database Connection Successful!</h2>';
            echo '<p>Successfully connected to MySQL database <code>' . $dbname . '</code></p>';
            echo '</div>';
            
            // Check tables
            $stmt = $pdo->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            $requiredTables = ['users', 'categories', 'expenses', 'budgets', 'sessions'];
            $missingTables = array_diff($requiredTables, $tables);
            
            if (empty($missingTables)) {
                echo '<div class="status-card success">';
                echo '<h2><span class="check">✓</span>All Tables Created</h2>';
                echo '<p>Found all ' . count($tables) . ' required tables:</p>';
                echo '<table>';
                echo '<tr><th>Table Name</th><th>Rows</th></tr>';
                
                foreach ($tables as $table) {
                    $stmt = $pdo->query("SELECT COUNT(*) as count FROM `$table`");
                    $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
                    echo '<tr><td>' . htmlspecialchars($table) . '</td><td>' . $count . '</td></tr>';
                }
                
                echo '</table></div>';
            } else {
                echo '<div class="status-card error">';
                echo '<h2><span class="cross">✗</span>Missing Tables</h2>';
                echo '<p>The following tables are missing: ' . implode(', ', $missingTables) . '</p>';
                echo '<p>Please import <code>database/schema.sql</code> in phpMyAdmin</p>';
                echo '</div>';
            }
            
            // Check default categories
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM categories WHERE is_default = 1");
            $categoryCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            if ($categoryCount == 8) {
                echo '<div class="status-card success">';
                echo '<h2><span class="check">✓</span>Default Categories Loaded</h2>';
                echo '<p>All 8 default expense categories are present</p>';
                
                $stmt = $pdo->query("SELECT category_name FROM categories WHERE is_default = 1 ORDER BY category_id");
                $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
                
                echo '<p><strong>Categories:</strong> ' . implode(', ', $categories) . '</p>';
                echo '</div>';
            } else {
                echo '<div class="status-card error">';
                echo '<h2><span class="cross">✗</span>Default Categories Missing</h2>';
                echo '<p>Expected 8 default categories, found ' . $categoryCount . '</p>';
                echo '<p>Please re-import <code>database/schema.sql</code></p>';
                echo '</div>';
            }
            
            // System info
            echo '<div class="status-card info">';
            echo '<h2>📊 System Information</h2>';
            echo '<p><strong>MySQL Version:</strong> ' . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . '</p>';
            echo '<p><strong>PHP Version:</strong> ' . phpversion() . '</p>';
            echo '<p><strong>Host:</strong> ' . $host . '</p>';
            echo '<p><strong>Database:</strong> ' . $dbname . '</p>';
            echo '<p><strong>Character Set:</strong> utf8mb4</p>';
            echo '</div>';
            
            echo '<a href="frontend/signup.html" class="btn">Continue to Sign Up →</a>';
            
        } catch(PDOException $e) {
            echo '<div class="status-card error">';
            echo '<h2><span class="cross">✗</span>Connection Failed!</h2>';
            echo '<p><strong>Error:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
            
            if (strpos($e->getMessage(), 'Unknown database') !== false) {
                echo '<p><strong>Solution:</strong> Database <code>' . $dbname . '</code> does not exist.</p>';
                echo '<p>1. Open phpMyAdmin: <a href="http://localhost/phpmyadmin" target="_blank">http://localhost/phpmyadmin</a></p>';
                echo '<p>2. Create new database named: <code>' . $dbname . '</code></p>';
                echo '<p>3. Import file: <code>database/schema.sql</code></p>';
            } elseif (strpos($e->getMessage(), 'Access denied') !== false) {
                echo '<p><strong>Solution:</strong> Database credentials are incorrect.</p>';
                echo '<p>Check username and password in <code>backend/config/database.php</code></p>';
            } else {
                echo '<p><strong>Solution:</strong> Make sure MySQL is running in XAMPP Control Panel</p>';
            }
            
            echo '</div>';
        }
        ?>
    </div>
</body>
</html>
