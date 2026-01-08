// ===================================
// EasyExpense Dashboard JavaScript
// ===================================

const API_BASE_URL = 'http://localhost:3000/api';

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  initDashboard();
});

function initDashboard() {
  // Set today's date as default for expense date
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("expenseDate");
  if (dateInput) {
    dateInput.value = today;
    dateInput.max = today; // Prevent future dates
  }

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
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const userNameEl = document.getElementById("userName");
      if (userNameEl) userNameEl.textContent = user.name || "User";
    }
  } catch (error) {
    console.error("Error loading user data:", error);
  }
}

function getUserId() {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);
    return user.id; // Corrected from user.user_id based on auth.js response
  }
  return null;
}

// ===================================
// Event Listeners
// ===================================

function setupEventListeners() {
  // Add expense button
  const addBtn = document.getElementById("addExpenseBtn");
  if (addBtn) addBtn.addEventListener("click", openModal);

  // Modal controls
  const closeBtn = document.getElementById("closeModal");
  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

  // Close modal on outside click
  const modal = document.getElementById("addExpenseModal");
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal();
      }
    });
  }

  // Form submission
  const form = document.getElementById("addExpenseForm");
  if (form) form.addEventListener("submit", handleAddExpense);

  // Category period change
  const periodSelect = document.getElementById("categoryPeriod");
  if (periodSelect) {
    periodSelect.addEventListener("change", function () {
      loadCategoryBreakdown(this.value);
    });
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
}

// ===================================
// Modal Functions
// ===================================

function openModal() {
  const modal = document.getElementById("addExpenseModal");
  if (modal) modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("addExpenseModal");
  if (modal) modal.classList.remove("active");

  const form = document.getElementById("addExpenseForm");
  if (form) form.reset();

  // Set today's date again
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("expenseDate");
  if (dateInput) dateInput.value = today;

  // Clear errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));
}

// ===================================
// Load Categories
// ===================================

async function loadCategories() {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/categories?user_id=${userId}`);
    const data = await response.json();

    if (data.success) {
      const select = document.getElementById("expenseCategory");
      if (!select) return;

      // Clear existing options except first
      select.innerHTML = '<option value="">Select category</option>';

      data.data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.category_id;
        option.textContent = cat.category_name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// ===================================
// Load Stats
// ===================================

async function loadStats() {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/expenses/stats?user_id=${userId}`);
    const data = await response.json();

    if (data.success) {
      updateStatsUI(data.data);
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
}

function updateStatsUI(stats) {
  const totalEl = document.getElementById("totalExpenses");
  const monthEl = document.getElementById("monthExpenses");
  const weekEl = document.getElementById("weekExpenses");
  const entriesEl = document.getElementById("totalEntries");

  if (totalEl) totalEl.textContent = `$${parseFloat(stats.totalExpenses).toFixed(2)}`;
  if (monthEl) monthEl.textContent = `$${parseFloat(stats.monthExpenses).toFixed(2)}`;
  if (weekEl) weekEl.textContent = `$${parseFloat(stats.weekExpenses).toFixed(2)}`;
  if (entriesEl) entriesEl.textContent = stats.totalEntries;
}

// ===================================
// Load Recent Expenses
// ===================================

async function loadRecentExpenses() {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/expenses/recent?user_id=${userId}`);
    const data = await response.json();

    if (data.success) {
      const container = document.getElementById("recentExpensesList");
      if (!container) return;

      if (data.data.length === 0) {
        container.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="30" stroke="#e2e8f0" stroke-width="2"/>
                        <path d="M32 20v24M20 32h24" stroke="#cbd5e0" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <p>No expenses yet</p>
                    <button class="btn-secondary" onclick="document.getElementById('addExpenseBtn').click()">Add Your First Expense</button>
                </div>
            `;
        return;
      }

      container.innerHTML = data.data.map(renderExpenseItem).join('');
    }
  } catch (error) {
    console.error("Error loading recent expenses:", error);
  }
}

function renderExpenseItem(expense) {
  return `
        <div class="expense-item">
            <div class="expense-icon" style="background: ${getCategoryColor(
    expense.category_name
  )};">
                ${getCategoryIcon(expense.category_name)}
            </div>
            <div class="expense-details">
                <div class="expense-title">${escapeHtml(expense.title)}</div>
                <div class="expense-category">${escapeHtml(
    expense.category_name
  )}</div>
            </div>
            <div>
                <div class="expense-amount">$${parseFloat(
    expense.amount
  ).toFixed(2)}</div>
                <div class="expense-date">${formatDate(expense.expense_date)}</div>
            </div>
        </div>
    `;
}

// ===================================
// Load Category Breakdown
// ===================================

// Note: The backend stats endpoint currently returns aggregated totals. 
// For a real breakdown chart, we would need a dedicated endpoint.
// For now, we will leave this as a placeholder or implement a simple client-side calc if we had all expenses.
async function loadCategoryBreakdown(period = "month") {
  try {
    const container = document.getElementById("categoryBreakdown");
    if (!container) return;

    // TODO: Implement /stats/categories endpoint
    // For now, keep showing empty state/placeholder
    // container.innerHTML = '<p class="text-center text-muted">Category breakdown coming soon...</p>';
  } catch (error) {
    console.error("Error loading category breakdown:", error);
  }
}

// ===================================
// Add Expense Handler
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

  // Validate
  if (!validateExpenseForm(formData)) {
    return;
  }

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

      // Reload dashboard data
      loadStats();
      loadRecentExpenses();
      // loadCategoryBreakdown(); 
    } else {
      alert(result.message || "Failed to add expense");
    }
  } catch (error) {
    console.error("Error adding expense:", error);
    alert("Failed to add expense. Please try again.");
  }
}

// ===================================
// Validation
// ===================================

function validateExpenseForm(data) {
  let isValid = true;

  // Clear previous errors
  document
    .querySelectorAll(".error-message")
    .forEach((el) => (el.textContent = ""));

  // Title validation
  if (!data.title || data.title.length < 1) {
    document.getElementById("titleError").textContent = "Title is required";
    isValid = false;
  } else if (data.title.length > 100) {
    document.getElementById("titleError").textContent =
      "Title must not exceed 100 characters";
    isValid = false;
  }

  // Amount validation
  if (!data.amount || parseFloat(data.amount) <= 0) {
    document.getElementById("amountError").textContent =
      "Please enter a valid amount";
    isValid = false;
  }

  // Date validation
  if (!data.date) {
    document.getElementById("dateError").textContent = "Date is required";
    isValid = false;
  }

  // Category validation
  if (!data.category) {
    document.getElementById("categoryError").textContent =
      "Please select a category";
    isValid = false;
  }

  return isValid;
}

// ===================================
// Logout Handler
// ===================================

async function handleLogout(e) {
  e.preventDefault();

  if (confirm("Are you sure you want to logout?")) {
    try {
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("session_token");

      // Redirect to signin
      window.location.href = "signin.html";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "signin.html";
    }
  }
}

// ===================================
// Utility Functions
// ===================================

function getCategoryColor(categoryName) {
  const colors = {
    "Food & Dining": "#667eea",
    Transportation: "#f093fb",
    "Rent & Utilities": "#4facfe",
    Healthcare: "#fa709a",
    Entertainment: "#764ba2",
    Shopping: "#f5576c",
    Education: "#00f2fe",
    Others: "#cbd5e0",
  };
  return colors[categoryName] || "#718096";
}

function getCategoryIcon(categoryName) {
  const icons = {
    "Food & Dining": "🍔",
    Transportation: "🚗",
    "Rent & Utilities": "🏠",
    Healthcare: "💊",
    Entertainment: "🎬",
    Shopping: "🛍️",
    Education: "📚",
    Others: "📦",
  };
  return icons[categoryName] || "📝";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===================================
// Check Authentication
// ===================================

(function checkAuth() {
  const user = localStorage.getItem("user");
  if (!user) {
    // Not logged in, redirect to signin
    window.location.href = "signin.html";
  }
})();
