// Charger depuis LocalStorage
let events = JSON.parse(localStorage.getItem("events")) || [];
let membres = JSON.parse(localStorage.getItem("membres")) || [];

//---------------------------------------------
// Afficher liste des membres (checkbox)
function afficherInvites() {
    const container = document.getElementById("membersCheckboxList");
    container.innerHTML = "";

    membres.forEach((m, index) => {
        container.innerHTML += `
            <div class="col-md-4 mb-2">
                <label>
                    <input type="checkbox" value="${m.name}">
                    ${m.name}
                </label>
            </div>
        `;
    });
}

//---------------------------------------------
// Afficher la liste des événements
function afficherEvenements() {
    const tbody = document.getElementById("eventsListBody");
    tbody.innerHTML = "";

    events.forEach((ev, index) => {
        const count = ev.invites.length;
        tbody.innerHTML += `
            <tr>
                <td>${ev.titre}</td>
                <td>${ev.datetime}</td>
                <td>${ev.type}</td>
                <td>${count} invités</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="voirDetails(${index})">Détails</button>
                    <button class="btn btn-danger btn-sm" onclick="supprimerEvent(${index})">Supprimer</button>
                </td>
            </tr>
        `;
    });
}

//---------------------------------------------
// Supprimer un événement
function supprimerEvent(i) {
    if (confirm("Voulez-vous supprimer cet événement ?")) {
        events.splice(i, 1);
        localStorage.setItem("events", JSON.stringify(events));
        afficherEvenements();
    }
}

//---------------------------------------------
// Formulaire création événement
document.getElementById("formEvent").addEventListener("submit", (e) => {
    e.preventDefault();

    let invites = [];
    document.querySelectorAll('#membersCheckboxList input:checked')
        .forEach(chk => invites.push({
            nom: chk.value,
            presence: "Non répondu"
        }));

    const newEvent = {
        titre: document.getElementById("event_title").value,
        type: document.getElementById("event_type").value,
        datetime: document.getElementById("event_datetime").value,
        lieu: document.getElementById("event_location").value,
        description: document.getElementById("event_description").value,
        invites: invites
    };

    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));

    e.target.reset();
    afficherEvenements();
    alert("Événement créé avec succès !");
});

//---------------------------------------------
// Voir détails de l'événement
function voirDetails(i) {
    const ev = events[i];

    let message = `
${ev.titre}
Type : ${ev.type}
Date : ${ev.datetime}
Lieu : ${ev.lieu}
Description : ${ev.description}
Invités :
    `;

    ev.invites.forEach(inv => {
        message += ` - ${inv.nom} : ${inv.presence}\n`;
    });

    alert(message);
}

//---------------------------------------------
// Initialisation
afficherInvites();
afficherEvenements();
