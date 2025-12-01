// evenements.js

// Rôles par défaut
const rolesParDefaut = [
    { name: "Président", color: "text-danger" },
    { name: "Trésorier", color: "text-success" },
    { name: "Secrétaire", color: "text-info" }
];

// Charger les rôles depuis le localStorage ou initialiser avec les rôles par défaut
let roles = JSON.parse(localStorage.getItem('roles'));
if (!roles || roles.length === 0) {
    roles = rolesParDefaut;
    localStorage.setItem('roles', JSON.stringify(roles));
}

// Fonction pour afficher tous les rôles
function afficherRoles() {
    const container = document.querySelector('.row.g-3');
    container.innerHTML = ''; // vider le container

    roles.forEach((role, index) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-4';
        colDiv.innerHTML = `
            <div class="card p-3 bg-light role-card" data-index="${index}">
                <h5 class="${role.color}">${role.name}</h5>
                <p>Admin.</p>

                <button class="btn btn-sm btn-dark btn-modifier">Modifier</button>
                <button class="btn btn-sm btn-danger btn-supprimer">Supprimer</button>
            </div>
        `;
        container.appendChild(colDiv);
    });

    // Gérer les boutons Supprimer
    document.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = btn.closest('.role-card').dataset.index;
            roles.splice(idx, 1);
            sauvegarderEtAfficher();
        });
    });

    // Gérer les boutons Modifier
    document.querySelectorAll('.btn-modifier').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.role-card');
            const idx = card.dataset.index;
            const nouveauNom = prompt("Modifier le nom du rôle :", roles[idx].name);
            if (nouveauNom && nouveauNom.trim() !== "") {
                roles[idx].name = nouveauNom.trim();
                sauvegarderEtAfficher();
            }
        });
    });
}

// Fonction pour sauvegarder dans localStorage et réafficher
function sauvegarderEtAfficher() {
    localStorage.setItem('roles', JSON.stringify(roles));
    afficherRoles();
}

// Ajouter un nouveau rôle
const btnNouveauRole = document.querySelector('.custom-btn-adherer');
btnNouveauRole.addEventListener('click', () => {
    const nomRole = prompt("Entrez le nom du nouveau rôle :");
    if (nomRole && nomRole.trim() !== "") {
        roles.push({ name: nomRole.trim(), color: "text-primary" });
        sauvegarderEtAfficher();
        alert(`Le rôle "${nomRole}" a été ajouté !`);
    } else {
        alert("Nom de rôle invalide !");
    }
});

// Sélectionner une carte comme active
document.addEventListener('click', function(e){
    if(e.target.closest('.role-card')) {
        document.querySelectorAll('.role-card').forEach(card => card.classList.remove('active-filter'));
        e.target.closest('.role-card').classList.add('active-filter');
    }
});

// Afficher les rôles au démarrage
afficherRoles();
