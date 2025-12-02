// --- Chargement des membres depuis localStorage ---
let membres = JSON.parse(localStorage.getItem("membres")) || [];


// --- Fonction pour afficher les membres ---
function afficherMembres() {
    const tbody = document.getElementById("membersListBody");
    tbody.innerHTML = "";

    membres.forEach((membre, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${membre.nom}</td>
            <td>${membre.statut}</td>
            <td>${membre.role}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-modifier" data-index="${index}">Modifier</button>
                <button class="btn btn-sm btn-danger btn-supprimer" data-index="${index}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Gestion du bouton Supprimer
    document.querySelectorAll(".btn-supprimer").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            membres.splice(i, 1);
            sauvegarderEtRafraichir();
        });
    });

    // Gestion du bouton Modifier
    document.querySelectorAll(".btn-modifier").forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            const newName = prompt("Modifier le nom :", membres[i].nom);
            if (newName && newName.trim() !== "") {
                membres[i].nom = newName.trim();
                sauvegarderEtRafraichir();
            }
        });
    });
}


// --- Sauvegarde dans localStorage ---
function sauvegarderEtRafraichir() {
    localStorage.setItem("membres", JSON.stringify(membres));
    afficherMembres();
}


// --- Ajout d'un membre ---
document.getElementById("formAddMember").addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = document.getElementById("member_name").value.trim();
    const phone = document.getElementById("member_phone").value.trim();
    const email = document.getElementById("member_email").value.trim();
    const role = document.getElementById("member_role").value;

    if (!nom || !phone) {
        alert("Veuillez remplir les champs obligatoires !");
        return;
    }

    membres.push({
        nom,
        phone,
        email,
        role,
        statut: "Actif"
    });

    e.target.reset();
    sauvegarderEtRafraichir();
});


// --- Initialisation ---
afficherMembres();
