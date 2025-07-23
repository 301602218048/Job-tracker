const api = "http://localhost:3000";
const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "./login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href = "./html/login.html";
  }
  document.body.style.display = "block";
  loadCompanies();
});

async function loadCompanies() {
  try {
    const res = await fetch(`${api}/company`, {
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) renderCompanies(data.companies || []);
  } catch (err) {
    console.error("Error fetching companies:", err);
  }
}

function renderCompanies(companies) {
  const list = document.getElementById("companyList");
  list.innerHTML = "";

  companies.forEach((company) => {
    const div = document.createElement("div");
    div.className = "company-card";
    div.innerHTML = `
      <h3>${company.company}</h3>
      <p><strong>Industry:</strong> ${company.industry || "N/A"}</p>
      <p><strong>Size:</strong> ${company.size || "N/A"}</p>
      <p><strong>Phone:</strong> ${company.contact || "N/A"}</p>
      <p><strong>Notes:</strong> ${company.notes || "—"}</p>
      <div class="actions">
        <button onclick='editCompany(${JSON.stringify(company)})'>Edit</button>
        <button class="delete" onclick='deleteCompany("${
          company.id
        }")'>Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function editCompany(company) {
  document.getElementById("formTitle").innerText = "Edit Company";
  document.getElementById("companyId").value = company.id;
  document.getElementById("name").value = company.company || "";
  document.getElementById("industry").value = company.industry || "";
  document.getElementById("size").value = company.size || "";
  document.getElementById("phone").value = company.contact || "";
  document.getElementById("notes").value = company.notes || "";

  document.getElementById("name").focus();
}

async function deleteCompany(id) {
  if (!confirm("Are you sure you want to delete this company?")) return;

  try {
    const res = await fetch(`${api}/company/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) loadCompanies();
    else alert(data.msg);
  } catch (err) {
    console.error("Delete error:", err);
  }
}

async function handleSubmit(e) {
  e.preventDefault();

  const companyId = document.getElementById("companyId").value;
  const payload = {
    company: document.getElementById("name").value.trim(),
    industry: document.getElementById("industry").value.trim(),
    size: document.getElementById("size").value.trim(),
    contact: document.getElementById("contact").value.trim(),
    notes: document.getElementById("notes").value.trim(),
  };

  try {
    const method = companyId ? "PATCH" : "POST";
    const url = companyId ? `${api}/company/${companyId}` : `${api}/company`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById("companyForm").reset();
      document.getElementById("companyId").value = "";
      document.getElementById("formTitle").innerText = "Add New Company";
      loadCompanies();
    } else {
      alert(data.msg);
    }
  } catch (err) {
    console.error("Submit error:", err);
  }
}
