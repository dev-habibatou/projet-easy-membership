/* =============================
      LOCAL STORAGE
============================= */
function getRoles() {
    return JSON.parse(localStorage.getItem("roles")) || [];
}

function saveRoles(roles) {
    localStorage.setItem("roles", JSON.stringify(roles));
}

/* =============================
      AFFICHER LES ROLES
============================= */
function loadRoles() {
    const roles = getRoles();
    const tbody = document.getElementById("rolesListBody");
    tbody.innerHTML = "";

    roles.forEach((role, index) => {
        const perms = Array.isArray(role.permissions)
            ? role.permissions.join(", ")
            : "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${role.name}</td>
            <td>${role.description || "-"}</td>
            <td>${perms}</td>
            <td>
                <button type="button" class="btn btn-sm btn-warning me-2" onclick="editRole(${index})">Modifier</button>
                <button type="button" class="btn btn-sm btn-danger" onclick="deleteRole(${index})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

/* =============================
      AJOUT / MODIFICATION
============================= */
let editIndex = null;

document.getElementById("formAddRole").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("role_name").value.trim();
    const description = document.getElementById("role_description").value.trim();

    if (!name) {
        alert("Le nom du rôle est obligatoire !");
        return;
    }

    // Récupération permissions
    const permissions = [];
    if (document.getElementById("perm_membres").checked) permissions.push("Membres");
    if (document.getElementById("perm_cotisations").checked) permissions.push("Cotisations");
    if (document.getElementById("perm_evenements").checked) permissions.push("Événements");

    const roles = getRoles();

    if (editIndex !== null) {
        // Modification
        roles[editIndex] = {
            name,
            description,
            permissions
        };
        editIndex = null;
    } else {
        // Ajout
        roles.push({
            name,
            description,
            permissions
        });
    }

    saveRoles(roles);
    loadRoles();
    this.reset();
});

/* =============================
         SUPPRIMER
============================= */
function deleteRole(index) {
    const roles = getRoles();
    if (confirm(`Supprimer le rôle "${roles[index].name}" ?`)) {
        roles.splice(index, 1);
        saveRoles(roles);
        loadRoles();
    }
}

/* =============================
          MODIFIER
============================= */
function editRole(index) {
    const roles = getRoles();
    const role = roles[index];

    document.getElementById("role_name").value = role.name;
    document.getElementById("role_description").value = role.description || "";

    const perms = role.permissions || [];

    document.getElementById("perm_membres").checked = perms.includes("Membres");
    document.getElementById("perm_cotisations").checked = perms.includes("Cotisations");
    document.getElementById("perm_evenements").checked = perms.includes("Événements");

    editIndex = index;
}

/* =============================
          INITIALISATION
============================= */
loadRoles();
