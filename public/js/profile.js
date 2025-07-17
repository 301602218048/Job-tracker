const api = "http://localhost:3000";
const modal = document.getElementById("careerGoalModal");
const openBtn = document.getElementById("cgoals");
const cancelBtn = document.getElementById("cancelBtn");
const logout = document.getElementById("logout");
const cgoalDOM = document.getElementById("cgoalDOM");
const token = localStorage.getItem("token");

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});

openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get(`${api}/profile/getCGoals`, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (res.data.success) {
      rendercgoals(res.data.cgoals);
    } else {
      cgoalDOM.innerHTML = "<p>No Career Goals. Click on edit to update.</p>";
    }
  } catch (err) {
    console.log(err);
  }

  function rendercgoals(cgoals) {
    const table = document.createElement("table");
    table.className = "job-table";

    table.innerHTML = `
    <thead>
      <tr>
        <th>Career Goal</th>
        <th>Target Title</th>
        <th>Target Date</th>
        <th>Min Salary</th>
        <th>Max Salary</th>
      </tr>
    </thead>
    <tbody>
      ${cgoals
        .map((cgoal) => {
          const careerGoal = `${cgoal.careerGoal}`;
          const targetTitle = cgoal.targetTitle;
          const targetDate = formatDate(cgoal.targetDate);
          const minSalary = cgoal.minSalary;
          const maxSalary = cgoal.maxSalary;

          return `
          <tr data-job='${JSON.stringify(cgoal)}'>
            <td>${careerGoal}</td>
            <td>${targetTitle}</td>
            <td>${targetDate}</td>
            <td>${minSalary}</td>
            <td>${maxSalary}</td>
          </tr>
        `;
        })
        .join("")}
    </tbody>
  `;

    cgoalDOM.innerHTML = "";
    cgoalDOM.appendChild(table);
  }

  function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "N/A";
    return d.toISOString().split("T")[0];
  }
});

async function handlePInfo(e) {
  try {
    e.preventDefault();
    const editProfile = {
      name: e.target.name.value,
      email: e.target.email.value,
    };
    const response = await axios.post(`${api}/user/edit`, editProfile, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (response.data.status === 200) {
      alert("updated successfully");
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleCareerGoal(e) {
  try {
    e.preventDefault();
    const careerGoal = {
      careerGoal: e.target.career_goal.value,
      targetTitle: e.target.target_title.value,
      targetDate: e.target.target_date.value,
      minSalary: e.target.salary_min.value,
      maxSalary: e.target.salary_max.value,
    };
    const response = await axios.post(`${api}/profile/cgoal`, careerGoal, {
      headers: { authorization: `Bearer ${token}` },
    });
    if (response.status === 201) {
      modal.style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}
