// app.js

// Charger les événements depuis le localStorage ou initialiser vide
let events = JSON.parse(localStorage.getItem('events')) || [];

// Fonction pour afficher les événements dans le tableau
function afficherEvenements() {
    const tbody = document.getElementById('eventsListBody');
    tbody.innerHTML = ''; // vide le tableau

    events.forEach((event, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${event.title}</td>
            <td>${event.date}</td>
            <td>${event.inviteAll ? 'Tous' : 'Sélectionnés'}</td>
            <td>
                <button class="btn btn-sm btn-warning btn-modifier" data-index="${index}">Modifier</button>
                <button class="btn btn-sm btn-danger btn-supprimer" data-index="${index}">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Boutons Supprimer
    document.querySelectorAll('.btn-supprimer').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = btn.getAttribute('data-index');
            events.splice(idx, 1); // supprime l'événement du tableau
            sauvegarderEtAfficher();
        });
    });

    // Boutons Modifier
    document.querySelectorAll('.btn-modifier').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = btn.getAttribute('data-index');
            const event = events[idx];
            
            const nouveauTitre = prompt("Modifier le titre de l'événement :", event.title);
            if (nouveauTitre && nouveauTitre.trim() !== "") {
                event.title = nouveauTitre.trim();
            }
            
            const nouvelleDate = prompt("Modifier la date (YYYY-MM-DD) :", event.date);
            if (nouvelleDate) event.date = nouvelleDate;
            
            const nouvelInviteAll = confirm("Inviter tous les membres ?");
            event.inviteAll = nouvelInviteAll;

            sauvegarderEtAfficher();
        });
    });
}

// Fonction pour sauvegarder dans localStorage et rafraîchir l'affichage
function sauvegarderEtAfficher() {
    localStorage.setItem('events', JSON.stringify(events));
    afficherEvenements();
}

// Gestion du formulaire de création d'événement
document.getElementById('formCreateEvent').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event_title').value.trim();
    const type = document.getElementById('event_type').value;
    const date = document.getElementById('event_date').value;
    const location = document.getElementById('event_location').value.trim();
    const inviteAll = document.getElementById('invite_all').checked;

    if (!title || !date) {
        alert("Veuillez remplir les champs obligatoires !");
        return;
    }

    // Ajouter l'événement
    events.push({ title, type, date, location, inviteAll });

    // Réinitialiser le formulaire
    e.target.reset();

    // Sauvegarder et afficher
    sauvegarderEtAfficher();
});

// Afficher les événements au chargement
afficherEvenements();
