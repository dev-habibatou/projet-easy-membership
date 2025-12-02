// Charger les membres
let membres = JSON.parse(localStorage.getItem("membres")) || [];

// Sauvegarde
function save() {
    localStorage.setItem("membres", JSON.stringify(membres));
}

// Affichage liste
function afficherMembres() {
    const tbody = document.getElementById('membersListBody');
    tbody.innerHTML = "";

    membres.forEach((m, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${m.name}</td>
            <td>${m.phone}</td>
            <td>
                <select data-index="${index}" class="form-select form-select-sm changeStatus">
                    <option value="actif" ${m.status == "actif" ? "selected" : ""}>Actif</option>
                    <option value="inactif" ${m.status == "inactif" ? "selected" : ""}>Inactif</option>
                    <option value="suspendu" ${m.status == "suspendu" ? "selected" : ""}>Suspendu</option>
                </select>
            </td>
            <td>${m.role}</td>
            <td>
                <button class="btn btn-sm btn-info me-2 btn-fiche" data-index="${index}">Fiche</button>
                <button class="btn btn-sm btn-danger btn-delete" data-index="${index}">Supprimer</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Changer statut
    document.querySelectorAll(".changeStatus").forEach(sel => {
        sel.addEventListener("change", () => {
            let i = sel.dataset.index;
            membres[i].status = sel.value;
            save();
            afficherMembres();
        });
    });

    // Supprimer membre
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            let i = btn.dataset.index;
            membres.splice(i, 1);
            save();
            afficherMembres();
        });
    });

    // Fiche individuel
    document.querySelectorAll(".btn-fiche").forEach(btn => {
        btn.addEventListener("click", () => {
            let m = membres[btn.dataset.index];
            alert(`
FICHE MEMBRE
Nom : ${m.name}
Téléphone : ${m.phone}
Email : ${m.email}
Statut : ${m.status}
Rôle : ${m.role}
Date d’adhésion : ${m.date}
            `);
        });
    });
}

// Formulaire
document.getElementById("formAddMember").addEventListener("submit", (e) => {
    e.preventDefault();

    const member = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        email: document.getElementById("email").value.trim(),
        status: document.getElementById("status").value,
        role: document.getElementById("role").value,
        date: new Date().toLocaleDateString(),
        cotisations: [],
        evenements: []
    };

    membres.push(member);
    save();
    afficherMembres();
    e.target.reset();
});

afficherMembres();
