const api = "http://localhost:3000/dashboard";
const logout = document.getElementById("logout");
const profile = document.getElementById("profile");
const token = localStorage.getItem("token");

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});

profile.addEventListener("click", () => {
  window.location.href = "./profile.html";
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const [statusRes, timelineRes] = await Promise.all([
      fetch(`${api}/status-summary`, {
        headers: { authorization: `Bearer ${token}` },
      }),
      fetch(`${api}/timeline`, {
        headers: { authorization: `Bearer ${token}` },
      }),
    ]);

    const statusData = await statusRes.json();
    const timelineData = await timelineRes.json();

    if (statusData.success) {
      renderStatusChart(statusData.summary);
    }

    if (timelineData.success) {
      renderTimelineChart(timelineData.timeline);
    }
  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
});

function renderStatusChart(summary) {
  const ctx = document.getElementById("statusChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(summary),
      datasets: [
        {
          label: "Job Status",
          data: Object.values(summary),
          backgroundColor: [
            "#3498db",
            "#2ecc71",
            "#f1c40f",
            "#e74c3c",
            "#9b59b6",
          ],
        },
      ],
    },
  });
}

function renderTimelineChart(timeline) {
  const ctx = document.getElementById("timelineChart").getContext("2d");
  const labels = timeline.map((entry) => entry.date);
  const data = timeline.map((entry) => entry.count);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Applications",
          data,
          fill: true,
          borderColor: "#2980b9",
          backgroundColor: "rgba(52, 152, 219, 0.2)",
          tension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
      },
    },
  });
}
