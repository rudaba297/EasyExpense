# Database Setup Instructions

## Prerequisites
- MySQL 5.7+ or MariaDB 10.2+
- XAMPP (includes MySQL and PHP Apache)

## Setup Steps

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start Apache and MySQL modules

### 2. Create Database
```bash
# Open MySQL from command line (or use phpMyAdmin)
mysql -u root -p
```

### 3. Create the database:
```sql
CREATE DATABASE easyexpense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE easyexpense;
```

### 4. Import the schema:
```bash
# From command line:
mysql -u root -p easyexpense < schema.sql

# OR use phpMyAdmin:
# 1. Open http://localhost/phpmyadmin
# 2. Select 'easyexpense' database
# 3. Click 'Import' tab
# 4. Choose 'schema.sql' file
# 5. Click 'Go'
```

### 5. Verify Installation
```sql
USE easyexpense;
SHOW TABLES;
-- Should show: users, categories, expenses, budgets, sessions

SELECT * FROM categories;
-- Should show 8 default categories
```

## Database Configuration

Update these files with your database credentials:

### For PHP (backend/config/database.php):
```php
$host = 'localhost';
$dbname = 'easyexpense';
$username = 'root';
$password = ''; // XAMPP default is empty
```

### For Node.js (backend/config/db.js):
```javascript
const config = {
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP default is empty
  database: 'easyexpense'
};
```

## Tables Overview

| Table | Description |
|-------|-------------|
| users | User accounts with authentication |
| categories | Expense categories (default + custom) |
| expenses | User expense records |
| budgets | Monthly budget limits |
| sessions | Active user sessions |

## Default Categories

1. Food & Dining
2. Transportation
3. Rent & Utilities
4. Healthcare
5. Entertainment
6. Shopping
7. Education
8. Others

## Security Notes

- Change the default MySQL root password in production
- Use environment variables for database credentials
- Enable SSL for MySQL connections in production
- Regular backups recommended
