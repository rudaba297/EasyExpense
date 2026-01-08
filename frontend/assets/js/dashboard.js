// ELEMENTS
const money_minus = document.getElementById("total-expense");
const monthly_total = document.getElementById("monthly-total");
const list = document.getElementById("list");
const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date-input");
const monthPicker = document.getElementById("month-picker");
const category = document.getElementById("category");
const dateDisplay = document.getElementById("date-display");
const toast = document.getElementById("toast");
const clearBtn = document.getElementById("clear-btn");
const timeFilter = document.getElementById("time-filter");
const noChartData = document.getElementById("no-chart-data");

// STATE & INIT
const todayStr = new Date().toISOString().split("T")[0];
dateInput.value = todayStr;

const currentMonthStr = new Date().toISOString().slice(0, 7);
monthPicker.value = currentMonthStr;

dateDisplay.innerText = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const localData = JSON.parse(localStorage.getItem("transactions"));
let transactions = localData !== null ? localData : [];

let myChart;

// FUNCTIONS
function addTransaction(e) {
  e.preventDefault();

  if (
    text.value.trim() === "" ||
    amount.value.trim() === "" ||
    dateInput.value === ""
  ) {
    showToast("Please fill in all fields");
    return;
  }

  const val = Math.abs(parseFloat(amount.value));
  const transaction = {
    id: Math.floor(Math.random() * 100000000),
    text: text.value,
    amount: -val,
    category: category.value,
    date: dateInput.value,
  };

  transactions.push(transaction);
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  updateLocalStorage();
  init();

  text.value = "";
  amount.value = "";
  dateInput.value = todayStr;
  showToast("Expense added successfully!");
}

function addTransactionDOM(transaction) {
  const item = document.createElement("div");
  item.className =
    "flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-all group";

  const d = new Date(transaction.date);
  const displayDate = d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  item.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="h-10 w-10 text-rose-600 bg-rose-50 rounded-full flex items-center justify-center text-lg">
                <i class="fas fa-minus-circle"></i>
            </div>
            <div>
                <p class="font-bold text-slate-800">${transaction.text}</p>
                <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">${
                  transaction.category
                } • ${displayDate}</p>
            </div>
        </div>
        <div class="flex items-center gap-4">
            <span class="font-bold text-rose-600">
                -$${Math.abs(transaction.amount).toFixed(2)}
            </span>
            <button class="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1" onclick="removeTransaction(${
              transaction.id
            })">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
  list.appendChild(item);
}

function updateValues() {
  const allTime = transactions.reduce((acc, t) => acc + t.amount, 0);
  money_minus.innerText = `$${Math.abs(allTime).toFixed(2)}`;
  updateMonthlyValue();
}

function updateMonthlyValue() {
  const target = monthPicker.value; // YYYY-MM
  if (!target) return;
  const [y, m] = target.split("-").map(Number);

  const total = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    })
    .reduce((acc, t) => acc + t.amount, 0);

  monthly_total.innerText = `$${Math.abs(total).toFixed(2)}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function showToast(msg) {
  toast.innerText = msg;
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3000);
}

function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const mode = timeFilter.value;
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  let filtered = transactions;

  if (mode === "specific") {
    const [y, m] = monthPicker.value.split("-").map(Number);
    filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === y && d.getMonth() + 1 === m;
    });
  } else if (mode !== "all") {
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    if (mode === "weekly") cutoff.setDate(now.getDate() - 7);
    else if (mode === "monthly") cutoff.setDate(now.getDate() - 30);

    filtered = transactions.filter((t) => {
      const d = new Date(t.date);
      return d >= cutoff && d <= now;
    });
  }

  const cats = [...new Set(filtered.map((t) => t.category))];
  const dataset = cats.map((c) =>
    filtered
      .filter((t) => t.category === c)
      .reduce((a, t) => a + Math.abs(t.amount), 0)
  );

  if (myChart) myChart.destroy();

  if (dataset.length === 0) {
    noChartData.classList.remove("hidden");
    return;
  }
  noChartData.classList.add("hidden");

  myChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: cats,
      datasets: [
        {
          data: dataset,
          backgroundColor: [
            "#6366f1",
            "#10b981",
            "#f43f5e",
            "#f59e0b",
            "#8b5cf6",
            "#06b6d4",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, font: { size: 10 }, padding: 15 },
        },
      },
      cutout: "70%",
    },
  });
}

function init() {
  list.innerHTML = "";
  if (transactions.length === 0) {
    list.innerHTML = `<div class="text-center py-10 text-slate-400"><i class="fas fa-receipt text-4xl mb-3 opacity-20"></i><p>No transactions yet.</p></div>`;
  } else {
    transactions.forEach(addTransactionDOM);
  }
  updateValues();
  updateChart();
}

// EVENTS
form.addEventListener("submit", addTransaction);
clearBtn.addEventListener("click", () => {
  if (transactions.length > 0 && confirm("Clear all history?")) {
    transactions = [];
    updateLocalStorage();
    init();
  }
});
monthPicker.addEventListener("change", () => {
  updateMonthlyValue();
  if (timeFilter.value === "specific") updateChart();
});
timeFilter.addEventListener("change", updateChart);

init();
