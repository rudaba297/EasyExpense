<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expenses - EasyExpense</title>
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link rel="stylesheet" href="assets/css/expenses.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Sidebar Navigation -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <div class="logo">
                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="12" fill="url(#gradient)"/>
                    <path d="M24 14V34M16 22H32M18 28H30" stroke="white" stroke-width="3" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="48" y2="48">
                            <stop offset="0%" stop-color="#667eea"/>
                            <stop offset="100%" stop-color="#764ba2"/>
                        </linearGradient>
                    </defs>
                </svg>
                <span>EasyExpense</span>
            </div>
        </div>

        <nav class="sidebar-nav">
            <a href="dashboard.php" class="nav-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 10h4V17H3V10zM8 3h4v14H8V3zM13 7h4v10h-4V7z" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <span>Dashboard</span>
            </a>
            <a href="expenses.php" class="nav-item active">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Expenses</span>
            </a>
            <a href="categories.php" class="nav-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="3" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
                    <rect x="11" y="3" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
                    <rect x="3" y="11" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
                    <rect x="11" y="11" width="6" height="6" stroke="currentColor" stroke-width="2" fill="none"/>
                </svg>
                <span>Categories</span>
            </a>
            <a href="budget.php" class="nav-item">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M10 3v7l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Budget</span>
            </a>
        </nav>

        <div class="sidebar-footer">
            <a href="#" class="nav-item" id="logoutBtn">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 17H3V3h4M13 13l4-4-4-4M17 9H7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Logout</span>
            </a>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Header -->
        <header class="page-header">
            <div class="header-left">
                <h1>My Expenses</h1>
                <p>Manage and track your spending</p>
            </div>
            <div class="header-right">
                <button class="btn-primary" id="addExpenseBtn">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 5v10M5 10h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>Add Expense</span>
                </button>
            </div>
        </header>

        <!-- Filters -->
        <div class="filters-container">
            <div class="filter-group">
                <label for="filterDateStart">From</label>
                <input type="date" id="filterDateStart" class="form-input">
            </div>
            <div class="filter-group">
                <label for="filterDateEnd">To</label>
                <input type="date" id="filterDateEnd" class="form-input">
            </div>
            <div class="filter-group">
                <label for="filterCategory">Category</label>
                <select id="filterCategory" class="form-select">
                    <option value="">All Categories</option>
                </select>
            </div>
            <button class="btn-secondary" id="applyFiltersBtn">Apply Filters</button>
        </div>

        <!-- Expenses Table -->
        <div class="card expenses-card">
            <div class="table-responsive">
                <table class="expenses-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Title & Notes</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="expensesTableBody">
                        <!-- Expenses populated by JS -->
                    </tbody>
                </table>
                <div id="emptyState" class="empty-state" style="display: none;">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="#e2e8f0" stroke-width="2"/>
                        <path d="M32 20v24M20 32h24" stroke="#cbd5e0" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>No expenses found</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Add Expense Modal (Reused) -->
    <div class="modal" id="addExpenseModal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Expense</h2>
                <button class="modal-close" id="closeModal">&times;</button>
            </div>
            <form id="addExpenseForm" class="modal-body">
                <div class="form-group">
                    <label for="expenseTitle">Title</label>
                    <input type="text" id="expenseTitle" name="title" placeholder="e.g., Lunch at cafe" required maxlength="100">
                    <span class="error-message" id="titleError"></span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="expenseAmount">Amount</label>
                        <input type="number" id="expenseAmount" name="amount" placeholder="0.00" step="0.01" min="0" required>
                        <span class="error-message" id="amountError"></span>
                    </div>

                    <div class="form-group">
                        <label for="expenseDate">Date</label>
                        <input type="date" id="expenseDate" name="date" required>
                        <span class="error-message" id="dateError"></span>
                    </div>
                </div>

                <div class="form-group">
                    <label for="expenseCategory">Category</label>
                    <select id="expenseCategory" name="category" required>
                        <option value="">Select category</option>
                    </select>
                    <span class="error-message" id="categoryError"></span>
                </div>

                <div class="form-group">
                    <label for="expenseNotes">Notes (Optional)</label>
                    <textarea id="expenseNotes" name="notes" placeholder="Add any additional details..." maxlength="255" rows="3"></textarea>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-secondary" id="cancelBtn">Cancel</button>
                    <button type="submit" class="btn-primary">Add Expense</button>
                </div>
            </form>
        </div>
    </div>

    <script src="assets/js/expenses.js"></script>
</body>
</html>
