const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginStatus = document.getElementById("adminLoginStatus");
const entriesTableBody = document.getElementById("entriesTableBody");
const dashboardStatus = document.getElementById("dashboardStatus");
const logoutBtn = document.getElementById("logoutBtn");

const tokenKey = "portfolio_admin_token";

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    adminLoginStatus.textContent = "Logging in...";

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem(tokenKey, data.token);
      window.location.href = "admin-dashboard.html";
    } catch (error) {
      adminLoginStatus.textContent = error.message;
    }
  });
}

const renderEntries = (entries) => {
  entriesTableBody.innerHTML = "";

  if (!entries.length) {
    entriesTableBody.innerHTML = '<tr><td colspan="4">No contact entries yet.</td></tr>';
    return;
  }

  entries.forEach((entry) => {
    const row = document.createElement("tr");
    const createdDate = new Date(entry.createdAt).toLocaleString();

    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.email}</td>
      <td>${entry.message}</td>
      <td>${createdDate}</td>
    `;

    entriesTableBody.appendChild(row);
  });
};

const loadDashboardEntries = async () => {
  if (!entriesTableBody) {
    return;
  }

  const token = localStorage.getItem(tokenKey);
  if (!token) {
    window.location.href = "admin-login.html";
    return;
  }

  dashboardStatus.textContent = "Loading entries...";

  try {
    const response = await fetch("/api/contact", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Could not load entries.");
    }

    renderEntries(data);
    dashboardStatus.textContent = `Loaded ${data.length} entries.`;
  } catch (error) {
    dashboardStatus.textContent = error.message;
    if (error.message.toLowerCase().includes("not authorized")) {
      localStorage.removeItem(tokenKey);
      setTimeout(() => {
        window.location.href = "admin-login.html";
      }, 1000);
    }
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(tokenKey);
    window.location.href = "admin-login.html";
  });
}

loadDashboardEntries();
