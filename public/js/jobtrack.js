const api = "http://localhost:3000";
const token = localStorage.getItem("token");
const logout = document.getElementById("logout");
const profile = document.getElementById("profile");
const modal = document.getElementById("jobModal");
const openModalBtn = document.querySelector(".main-body button");
const closeModal = document.querySelector(".close");
const form = document.getElementById("jobForm");
const tbody = document.querySelector("tbody");

logout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
});

profile.addEventListener("click", () => {
  window.location.href = "./profile.html";
});

openModalBtn.addEventListener("click", () => {
  modal.style.display = "block";
  form.reset();
  form.dataset.jobId = "";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href = "./html/login.html";
  }
  document.body.style.display = "block";
  loadJobs();
  document.getElementById("search").addEventListener("input", loadJobs);
  document.getElementById("filter").addEventListener("change", loadJobs);
  document.getElementById("startDate").addEventListener("change", loadJobs);
  document.getElementById("endDate").addEventListener("change", loadJobs);
});

async function loadJobs() {
  const search = document.getElementById("search").value;
  const status = document.getElementById("filter").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  try {
    const res = await fetch(`${api}/job/getFilteredJobs?${params}`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      renderJobs(data.jobs || []);
    } else {
      tbody.innerHTML = "<tr><td colspan='9'>No jobs found</td></tr>";
    }
  } catch (err) {
    console.error("Error loading jobs:", err);
  }
}

function renderJobs(jobs) {
  tbody.innerHTML = "";

  jobs.forEach((job) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${job.title}</td>
      <td>${job.company ? job.company.company : "N/A"}</td>
      <td>${job.status}</td>
      <td>${new Date(
        job.createdAt || job.applicationDate
      ).toLocaleDateString()}</td>
      <td>${new Date(job.applicationDate).toLocaleDateString()}</td>
      <td>${
        job.followupDate ? new Date(job.followupDate).toLocaleDateString() : "—"
      }</td>
      <td>${job.resume ? `<a href="${job.resume}">link</a>` : "N/A"}</td>
      <td>${
        job.coverLetter ? `<a href="${job.coverLetter}">link</a>` : "N/A"
      }</td>
      <td>
        <button onclick='editJob(${JSON.stringify(job)})'>Edit</button>
        <button onclick='deleteJob(${job.id})'>Delete</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

async function addJob(e) {
  e.preventDefault();

  const jobId = form.dataset.jobId;
  const isUpdate = Boolean(jobId);

  const formData = new FormData();
  formData.append("company", document.getElementById("company").value);
  formData.append("title", document.getElementById("title").value);
  formData.append("applicationDate", document.getElementById("date").value);
  formData.append("followupDate", document.getElementById("follow_up").value);
  formData.append("status", document.getElementById("status").value);
  formData.append("notes", document.getElementById("notes").value);

  const resume = document.getElementById("resume").files[0];
  const coverLetter = document.getElementById("coverLetter").files[0];
  if (resume) formData.append("resume", resume);
  if (coverLetter) formData.append("coverLetter", coverLetter);

  try {
    const url = isUpdate
      ? `${api}/job/updateJob/${jobId}`
      : `${api}/job/addJob`;

    const method = isUpdate ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      loadJobs();
      modal.style.display = "none";
      form.reset();
      form.dataset.jobId = "";
    } else {
      alert(data.msg || "Something went wrong");
    }
  } catch (err) {
    console.error("Error submitting job:", err);
  }
}

function editJob(job) {
  form.dataset.jobId = job.id;
  modal.style.display = "block";

  document.getElementById("company").value = job.company.company || "";
  document.getElementById("title").value = job.title || "";
  document.getElementById("date").value = job.applicationDate
    ? job.applicationDate.split("T")[0]
    : "";
  document.getElementById("follow_up").value = job.followupDate
    ? job.followupDate.split("T")[0]
    : "";
  document.getElementById("status").value = job.status || "Applied";
  document.getElementById("notes").value = job.notes || "";
}

async function deleteJob(id) {
  if (!confirm("Are you sure you want to delete this job?")) return;

  try {
    const res = await fetch(`${api}/job/deleteJob/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    if (data.success) loadJobs();
    else alert(data.msg || "Failed to delete");
  } catch (err) {
    console.error("Delete error:", err);
  }
}
