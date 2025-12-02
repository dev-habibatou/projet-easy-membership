// ---------- LOCAL STORAGE ----------
function getTypes() {
    return JSON.parse(localStorage.getItem("typesCotisation")) || [];
}
function saveTypes(types) {
    localStorage.setItem("typesCotisation", JSON.stringify(types));
}

function getPaiements() {
    return JSON.parse(localStorage.getItem("paiements")) || [];
}
function savePaiements(paiements) {
    localStorage.setItem("paiements", JSON.stringify(paiements));
}

// ---------- TYPES DE COTISATION ----------
function loadTypes() {
    const types = getTypes();
    const tbody = document.getElementById("typesList");
    const selectPaiement = document.getElementById("paiement_type");

    tbody.innerHTML = "";
    selectPaiement.innerHTML = "<option value=''>Choisir...</option>";

    types.forEach((type, index) => {
        // Table
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${type.nom}</td>
            <td>${type.montant}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editType(${index})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deleteType(${index})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);

        // Select paiement
        const option = document.createElement("option");
        option.value = type.nom;
        option.textContent = type.nom;
        selectPaiement.appendChild(option);
    });
}

// Ajouter type
document.getElementById("formTypeCotisation").addEventListener("submit", function(e) {
    e.preventDefault();
    const nom = document.getElementById("cotisation_nom").value.trim();
    const montant = parseFloat(document.getElementById("cotisation_montant").value);

    if (!nom || !montant) return alert("Remplissez tous les champs !");

    const types = getTypes();
    types.push({ nom, montant });
    saveTypes(types);
    loadTypes();
    this.reset();
});

// Supprimer / Modifier type
function deleteType(index) {
    const types = getTypes();
    types.splice(index, 1);
    saveTypes(types);
    loadTypes();
}
function editType(index) {
    const types = getTypes();
    const type = types[index];
    document.getElementById("cotisation_nom").value = type.nom;
    document.getElementById("cotisation_montant").value = type.montant;
    deleteType(index);
}

// ---------- PAIEMENTS ----------
function loadPaiements() {
    const paiements = getPaiements();
    const tbody = document.getElementById("paiementListBody");

    tbody.innerHTML = "";
    paiements.forEach((p, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.membre}</td>
            <td>${p.type}</td>
            <td>${p.montant}</td>
            <td>${p.date}</td>
            <td>${p.statut}</td>
            <td>
                <button class="btn btn-sm btn-warning me-2" onclick="editPaiement(${index})">Modifier</button>
                <button class="btn btn-sm btn-danger" onclick="deletePaiement(${index})">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Ajouter paiement
document.getElementById("formPaiement").addEventListener("submit", function(e) {
    e.preventDefault();

    const membre = document.getElementById("paiement_membre").value.trim();
    const type = document.getElementById("paiement_type").value;
    const montant = parseFloat(document.getElementById("paiement_montant").value);
    const date = document.getElementById("paiement_date").value;
    const statut = document.getElementById("paiement_statut").value;

    if (!membre || !type || !montant || !date) return alert("Remplissez tous les champs !");

    const paiements = getPaiements();
    paiements.push({ membre, type, montant, date, statut });
    savePaiements(paiements);
    loadPaiements();
    this.reset();
});

// Supprimer / Modifier paiement
function deletePaiement(index) {
    const paiements = getPaiements();
    paiements.splice(index, 1);
    savePaiements(paiements);
    loadPaiements();
}
function editPaiement(index) {
    const paiements = getPaiements();
    const p = paiements[index];
    document.getElementById("paiement_membre").value = p.membre;
    document.getElementById("paiement_type").value = p.type;
    document.getElementById("paiement_montant").value = p.montant;
    document.getElementById("paiement_date").value = p.date;
    document.getElementById("paiement_statut").value = p.statut;
    deletePaiement(index);
}

// Initialisation
loadTypes();
loadPaiements();
