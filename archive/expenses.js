// ===================================
// EasyExpense Expenses Page JavaScript
// ===================================

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", function () {
    initExpensesPage();
});

function initExpensesPage() {
    checkAuth();
    loadUserData();
    setupEventListeners();
    loadCategories();
    loadExpenses();
}

// ===================================
// Auth & User
// ===================================

function checkAuth() {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "signin.html";
    }
}

function getUserId() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
        const user = JSON.parse(userStr);
        return user.id;
    }
    return null;
}

function loadUserData() {
    try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            // const user = JSON.parse(userStr);
            // Could display user name in header if needed
        }
    } catch (error) {
        console.error("Error loading user data:", error);
    }
}

// ===================================
// Data Loading
// ===================================

async function loadCategories() {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/categories?user_id=${userId}`);
        const data = await response.json();

        if (data.success) {
            // Populate Modal Dropdown
            const modalSelect = document.getElementById("expenseCategory");
            if (modalSelect) {
                modalSelect.innerHTML = '<option value="">Select category</option>';
                data.data.forEach((cat) => {
                    const option = document.createElement("option");
                    option.value = cat.category_id;
                    option.textContent = cat.category_name;
                    modalSelect.appendChild(option);
                });
            }

            // Populate Filter Dropdown
            const filterSelect = document.getElementById("filterCategory");
            if (filterSelect) {
                filterSelect.innerHTML = '<option value="">All Categories</option>';
                data.data.forEach((cat) => {
                    const option = document.createElement("option");
                    option.value = cat.category_id;
                    option.textContent = cat.category_name;
                    filterSelect.appendChild(option);
                });
            }
        }
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

async function loadExpenses() {
    try {
        const userId = getUserId();
        const startDate = document.getElementById("filterDateStart").value;
        const endDate = document.getElementById("filterDateEnd").value;
        const category = document.getElementById("filterCategory").value;

        let url = `${API_BASE_URL}/expenses?user_id=${userId}`;
        if (startDate) url += `&start_date=${startDate}`;
        if (endDate) url += `&end_date=${endDate}`;
        if (category) url += `&category=${category}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            renderExpensesTable(data.data);
        }
    } catch (error) {
        console.error("Error loading expenses:", error);
    }
}

// ===================================
// Rendering
// ===================================

function renderExpensesTable(expenses) {
    const tbody = document.getElementById("expensesTableBody");
    const emptyState = document.getElementById("emptyState");

    tbody.innerHTML = '';

    if (expenses.length === 0) {
        emptyState.style.display = 'flex';
    } else {
        emptyState.style.display = 'none';
        expenses.forEach(expense => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${formatDate(expense.expense_date)}</td>
                <td>
                    <span class="category-badge" style="background-color: ${getCategoryColor(expense.category_name)}20; color: ${getCategoryColor(expense.category_name)};">
                        ${getCategoryIcon(expense.category_name)} ${escapeHtml(expense.category_name)}
                    </span>
                </td>
                <td>
                    <div class="expense-row-title">${escapeHtml(expense.title)}</div>
                    ${expense.notes ? `<div class="expense-row-notes">${escapeHtml(expense.notes)}</div>` : ''}
                </td>
                <td class="font-bold">$${parseFloat(expense.amount).toFixed(2)}</td>
                <td>
                    <button class="btn-icon-danger" onclick="deleteExpense(${expense.expense_id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                        </svg>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// ===================================
// Actions
// ===================================

async function handleAddExpense(e) {
    e.preventDefault();

    const formData = {
        title: document.getElementById("expenseTitle").value.trim(),
        amount: document.getElementById("expenseAmount").value,
        date: document.getElementById("expenseDate").value,
        category: document.getElementById("expenseCategory").value,
        notes: document.getElementById("expenseNotes").value.trim(),
        user_id: getUserId()
    };

    try {
        const response = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            alert("Expense added successfully!");
            closeModal();
            loadExpenses(); // Reload list
        } else {
            alert(result.message || "Failed to add expense");
        }
    } catch (error) {
        console.error("Error adding expense:", error);
        alert("Failed to add expense. Please try again.");
    }
}

async function deleteExpense(expenseId) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
        const userId = getUserId();
        const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}?user_id=${userId}`, {
            method: 'DELETE'
        });
        const result = await response.json();

        if (result.success) {
            loadExpenses();
        } else {
            alert(result.message || "Failed to delete expense");
        }
    } catch (error) {
        console.error("Error deleting expense:", error);
        alert("Server error");
    }
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
    // Modal
    document.getElementById("addExpenseBtn").addEventListener("click", openModal);
    document.getElementById("closeModal").addEventListener("click", closeModal);
    document.getElementById("cancelBtn").addEventListener("click", closeModal);
    document.getElementById("addExpenseForm").addEventListener("submit", handleAddExpense);

    document.getElementById("addExpenseModal").addEventListener("click", function (e) {
        if (e.target === this) closeModal();
    });

    // Filters
    document.getElementById("applyFiltersBtn").addEventListener("click", loadExpenses);

    // Logout
    document.getElementById("logoutBtn").addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Logout?")) {
            localStorage.removeItem("user");
            localStorage.removeItem("session_token");
            window.location.href = "signin.html";
        }
    });
}

function openModal() {
    document.getElementById("addExpenseModal").classList.add("active");
    // Set today
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("expenseDate").value = today;
}

function closeModal() {
    document.getElementById("addExpenseModal").classList.remove("active");
    document.getElementById("addExpenseForm").reset();
}

// ===================================
// Utils
// ===================================

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function getCategoryColor(name) {
    const map = {
        "Food & Dining": "#667eea",
        "Transportation": "#f093fb",
        "Rent & Utilities": "#4facfe",
        "Healthcare": "#fa709a",
        "Entertainment": "#764ba2",
        "Shopping": "#f5576c",
        "Education": "#00f2fe",
        "Others": "#cbd5e0"
    };
    return map[name] || "#718096";
}

function getCategoryIcon(name) {
    const map = {
        "Food & Dining": "🍔",
        "Transportation": "🚗",
        "Rent & Utilities": "🏠",
        "Healthcare": "💊",
        "Entertainment": "🎬",
        "Shopping": "🛍️",
        "Education": "📚",
        "Others": "📦"
    };
    return map[name] || "📝";
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}
