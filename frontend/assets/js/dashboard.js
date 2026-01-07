// ===================================
// EasyExpense Dashboard JavaScript
// ===================================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initDashboard();
});

function initDashboard() {
    // Set today's date as default for expense date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('expenseDate').max = today; // Prevent future dates

    // Load user data
    loadUserData();

    // Load dashboard data
    loadStats();
    loadRecentExpenses();
    loadCategoryBreakdown();
    loadCategories();

    // Set up event listeners
    setupEventListeners();
}

// ===================================
// User Data
// ===================================

function loadUserData() {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            document.getElementById('userName').textContent = user.name || 'User';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
    // Add expense button
    document.getElementById('addExpenseBtn').addEventListener('click', openModal);

    // Modal controls
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);

    // Close modal on outside click
    document.getElementById('addExpenseModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Form submission
    document.getElementById('addExpenseForm').addEventListener('submit', handleAddExpense);

    // Category period change
    document.getElementById('categoryPeriod').addEventListener('change', function () {
        loadCategoryBreakdown(this.value);
    });

    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// ===================================
// Modal Functions
// ===================================

function openModal() {
    document.getElementById('addExpenseModal').classList.add('active');
}

function closeModal() {
    document.getElementById('addExpenseModal').classList.remove('active');
    document.getElementById('addExpenseForm').reset();

    // Set today's date again
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;

    // Clear errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
}

// ===================================
// Load Categories
// ===================================

async function loadCategories() {
    try {
        // For now, use default categories until PHP backend is ready
        const defaultCategories = [
            { id: 1, name: 'Food & Dining' },
            { id: 2, name: 'Transportation' },
            { id: 3, name: 'Rent & Utilities' },
            { id: 4, name: 'Healthcare' },
            { id: 5, name: 'Entertainment' },
            { id: 6, name: 'Shopping' },
            { id: 7, name: 'Education' },
            { id: 8, name: 'Others' }
        ];

        const select = document.getElementById('expenseCategory');
        defaultCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// ===================================
// Load Stats
// ===================================

async function loadStats() {
    try {
        // TODO: Fetch from PHP backend
        // For now, use placeholder data
        updateStatsUI({
            totalExpenses: 0,
            monthExpenses: 0,
            weekExpenses: 0,
            totalEntries: 0
        });
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function updateStatsUI(stats) {
    document.getElementById('totalExpenses').textContent = `$${stats.totalExpenses.toFixed(2)}`;
    document.getElementById('monthExpenses').textContent = `$${stats.monthExpenses.toFixed(2)}`;
    document.getElementById('weekExpenses').textContent = `$${stats.weekExpenses.toFixed(2)}`;
    document.getElementById('totalEntries').textContent = stats.totalEntries;
}

// ===================================
// Load Recent Expenses
// ===================================

async function loadRecentExpenses() {
    try {
        // TODO: Fetch from PHP backend
        // For now, show empty state
        const container = document.getElementById('recentExpensesList');
        // If no expenses, the empty state is already shown in HTML
    } catch (error) {
        console.error('Error loading recent expenses:', error);
    }
}

function renderExpenseItem(expense) {
    return `
        <div class="expense-item">
            <div class="expense-icon" style="background: ${getCategoryColor(expense.category)};">
                ${getCategoryIcon(expense.category)}
            </div>
            <div class="expense-details">
                <div class="expense-title">${escapeHtml(expense.title)}</div>
                <div class="expense-category">${escapeHtml(expense.category)}</div>
            </div>
            <div>
                <div class="expense-amount">$${parseFloat(expense.amount).toFixed(2)}</div>
                <div class="expense-date">${formatDate(expense.date)}</div>
            </div>
        </div>
    `;
}

// ===================================
// Load Category Breakdown
// ===================================

async function loadCategoryBreakdown(period = 'month') {
    try {
        // TODO: Fetch from PHP backend
        // For now, show empty state
        const container = document.getElementById('categoryBreakdown');
        // Empty state is already shown in HTML
    } catch (error) {
        console.error('Error loading category breakdown:', error);
    }
}

function renderCategoryItem(category, total, percentage) {
    return `
        <div class="category-item">
            <div class="category-color" style="background: ${getCategoryColor(category.name)};"></div>
            <div class="category-name">${escapeHtml(category.name)}</div>
            <div class="category-amount">$${total.toFixed(2)}</div>
            <div class="category-percentage">${percentage}%</div>
        </div>
    `;
}

// ===================================
// Add Expense Handler
// ===================================

async function handleAddExpense(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById('expenseTitle').value.trim(),
        amount: document.getElementById('expenseAmount').value,
        date: document.getElementById('expenseDate').value,
        category: document.getElementById('expenseCategory').value,
        notes: document.getElementById('expenseNotes').value.trim()
    };

    // Validate
    if (!validateExpenseForm(formData)) {
        return;
    }

    try {
        // TODO: Submit to PHP backend
        // For now, just show success message
        alert('Expense added successfully! (Backend integration pending)');
        closeModal();

        // Reload dashboard data
        loadStats();
        loadRecentExpenses();
        loadCategoryBreakdown();
    } catch (error) {
        console.error('Error adding expense:', error);
        alert('Failed to add expense. Please try again.');
    }
}

// ===================================
// Validation
// ===================================

function validateExpenseForm(data) {
    let isValid = true;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

    // Title validation
    if (!data.title || data.title.length < 1) {
        document.getElementById('titleError').textContent = 'Title is required';
        isValid = false;
    } else if (data.title.length > 100) {
        document.getElementById('titleError').textContent = 'Title must not exceed 100 characters';
        isValid = false;
    }

    // Amount validation
    if (!data.amount || parseFloat(data.amount) <= 0) {
        document.getElementById('amountError').textContent = 'Please enter a valid amount';
        isValid = false;
    }

    // Date validation
    if (!data.date) {
        document.getElementById('dateError').textContent = 'Date is required';
        isValid = false;
    } else if (new Date(data.date) > new Date()) {
        document.getElementById('dateError').textContent = 'Date cannot be in the future';
        isValid = false;
    }

    // Category validation
    if (!data.category) {
        document.getElementById('categoryError').textContent = 'Please select a category';
        isValid = false;
    }

    return isValid;
}

// ===================================
// Logout Handler
// ===================================

async function handleLogout(e) {
    e.preventDefault();

    if (confirm('Are you sure you want to logout?')) {
        try {
            // Clear local storage
            localStorage.removeItem('user');
            localStorage.removeItem('session_token');

            // TODO: Call logout API
            // await fetch('http://localhost:3000/api/auth/logout', { method: 'POST' });

            // Redirect to signin
            window.location.href = 'signin.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect anyway
            window.location.href = 'signin.html';
        }
    }
}

// ===================================
// Utility Functions
// ===================================

function getCategoryColor(categoryName) {
    const colors = {
        'Food & Dining': '#667eea',
        'Transportation': '#f093fb',
        'Rent & Utilities': '#4facfe',
        'Healthcare': '#fa709a',
        'Entertainment': '#764ba2',
        'Shopping': '#f5576c',
        'Education': #00f2fe',
        'Others': '#cbd5e0'
    };
    return colors[categoryName] || '#718096';
}

function getCategoryIcon(categoryName) {
    const icons = {
        'Food & Dining': '🍔',
        'Transportation': '🚗',
        'Rent & Utilities': '🏠',
        'Healthcare': '💊',
        'Entertainment': '🎬',
        'Shopping': '🛍️',
        'Education': '📚',
        'Others': '📦'
    };
    return icons[categoryName] || '📝';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// Check Authentication
// ===================================

(function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        // Not logged in, redirect to signin
        window.location.href = 'signin.html';
    }
})();
