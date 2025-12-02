
        // Liste des IDs de tous les champs de quantité
        const QUANTITY_IDS = ['qty_physique', 'qty_entreprise', 'qty_association'];
        const TEXT_INPUT_IDS = [
            'don_montant_libre',
            'inputNom', 'inputEmail', 'inputTelephone', // Nouveaux champs de contact
            'quick_nom', 'quick_email', 'quick_association_text', 'quick_choix'
        ];


        // --------------------------------------------------------
        // 1. FONCTIONS DE SAUVEGARDE DANS LE LOCAL STORAGE
        // --------------------------------------------------------

        function saveQuantity(id, value) {
            localStorage.setItem(id, value);
            updateCalculations(); // Recalculer après chaque changement de quantité
        }

        function saveText(id, value) {
            localStorage.setItem(id, value);
        }


        // --------------------------------------------------------
        // 2. FONCTION POUR METTRE À JOUR LA QUANTITÉ
        // --------------------------------------------------------
        function updateQuantity(button, delta, inputId) {
            const input = document.getElementById(inputId);
            if (!input) return;

            let currentValue = parseInt(input.value) || 0;
            let newValue = currentValue + delta;

            if (newValue < 0) {
                newValue = 0;
            }

            input.value = newValue;
            saveQuantity(inputId, newValue);
        }


        // --------------------------------------------------------
        // 3. LOGIQUE DE CALCUL DU TOTAL
        // --------------------------------------------------------
        function updateCalculations() {
            let total = 0;
            let totalAdhesions = 0;

            // Calculer le total des adhésions
            QUANTITY_IDS.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    const quantity = parseInt(input.value) || 0;
                    const price = parseInt(input.getAttribute('data-price')) || 0;
                    total += quantity * price;
                    totalAdhesions += quantity;
                }
            });

            // Ajouter le montant du Don Libre (Nettoyage pour s'assurer que c'est un nombre)
            const donInput = document.getElementById('don_montant_libre');
            if (donInput) {
                // Remplacer les virgules par des points et retirer tout ce qui n'est pas chiffre/point
                const donValueCleaned = donInput.value.replace(',', '.').replace(/[^\d.]/g, '');
                const donMontant = parseFloat(donValueCleaned) || 0;
                total += donMontant;
            }

            // Mettre à jour l'affichage du total dans le récapitulatif
            const totalElement = document.getElementById('recap-total');
            if (totalElement) {
                // Formattage en devise (similaire à XOF pour les Francs CFA de l'Afrique de l'Ouest)
                // Note: En JavaScript standard, nous utilisons Intl.NumberFormat
                // Pour ce format simple "X.XXX F", nous allons le faire manuellement
                const formattedTotal = total.toLocaleString('fr-FR', {
                    minimumFractionDigits: 0
                }) + ' F';

                totalElement.textContent = formattedTotal;
            }

            // Mettre à jour le compteur d'adhérents (Tab 2)
            const adherentsCountElement = document.getElementById('adherents-count');
            if (adherentsCountElement) {
                adherentsCountElement.textContent = totalAdhesions;
            }

            // Mettre à jour l'état de l'onglet 2 (Adhérents)
            const tab2Button = document.getElementById('tab2-tab');
            if (tab2Button) {
                if (totalAdhesions > 0) {
                    tab2Button.removeAttribute('disabled');
                    tab2Button.classList.add('enabled-tab');
                } else {
                    tab2Button.setAttribute('disabled', 'true');
                    tab2Button.classList.remove('enabled-tab');
                }
            }
        }


        // --------------------------------------------------------
        // 4. LOGIQUE DE NAVIGATION DES ONGLES (TABS)
        // --------------------------------------------------------

        function goToTab(tabIndex) {
            const tabElement = document.getElementById(`tab${tabIndex}-tab`);
            if (tabElement) {
                // Utilisation de l'API Tab de Bootstrap pour activer l'onglet
                const tab = new bootstrap.Tab(tabElement);
                tab.show();
                // Si on va à la dernière étape, on génère le récap
                if (tabIndex === 4) {
                    generateRecap();
                }
            }
        }

        function goToNextTab(currentTabIndex) {
            // Validation simple pour l'étape 1 (Choix de l'adhésion)
            if (currentTabIndex === 1) {
                let totalAdhesions = 0;
                QUANTITY_IDS.forEach(id => {
                    totalAdhesions += parseInt(localStorage.getItem(id)) || 0;
                });

                if (totalAdhesions === 0) {
                    alert("Veuillez choisir au moins une adhésion pour continuer.");
                    return;
                }
            }

            // Activer l'onglet suivant (N+1)
            const nextTabIndex = currentTabIndex + 1;
            const nextTabButton = document.getElementById(`tab${nextTabIndex}-tab`);

            if (nextTabButton) {
                // Rendre le prochain onglet cliquable (au cas où il était disabled)
                nextTabButton.removeAttribute('disabled');
                nextTabButton.classList.add('enabled-tab');

                // Passer à l'onglet suivant
                goToTab(nextTabIndex);
            }
        }

        // --------------------------------------------------------
        // 5. GÉNÉRATION DU RÉCAPITULATIF (ÉTAPE 4)
        // --------------------------------------------------------

        function generateRecap() {
            const recapContent = document.getElementById('recap-content');
            let html = '';

            // 1. Détail des Adhésions et Dons
            html += '<h6><i class="bi bi-cart"></i> Votre Commande :</h6><ul class="list-group mb-4">';

            QUANTITY_IDS.forEach(id => {
                const input = document.getElementById(id);
                const quantity = parseInt(localStorage.getItem(id)) || 0;
                const price = parseInt(input.getAttribute('data-price')) || 0;

                if (quantity > 0) {
                    let name = '';
                    if (id === 'qty_physique') name = 'Adhésion personne physique';
                    else if (id === 'qty_entreprise') name = 'Adhésion ENTREPRISE';
                    else if (id === 'qty_association') name = 'Adhésion ASSOCIATION';

                    const subtotal = quantity * price;

                    html += `<li class="list-group-item d-flex justify-content-between">
                    <div>${quantity} x ${name}</div>
                    <span class="fw-bold">${subtotal.toLocaleString('fr-FR')} F</span>
                </li>`;
                }
            });

            // Détail du Don Libre
            const donMontant = parseFloat(localStorage.getItem('don_montant_libre').replace(',', '.')) || 0;
            if (donMontant > 0) {
                html += `<li class="list-group-item d-flex justify-content-between bg-light">
                    <div>Don sans adhésion (Prix Libre)</div>
                    <span class="fw-bold text-success">${donMontant.toLocaleString('fr-FR')} F</span>
                </li>`;
            }

            html += '</ul>';

            // 2. Coordonnées
            const nom = localStorage.getItem('inputNom') || 'Non renseigné';
            const email = localStorage.getItem('inputEmail') || 'Non renseigné';
            const tel = localStorage.getItem('inputTelephone') || 'Non renseigné';

            html += '<h6><i class="bi bi-person-lines-fill"></i> Vos Coordonnées :</h6><ul class="list-group mb-4">';
            html += `<li class="list-group-item"><strong>Nom :</strong> ${nom}</li>`;
            html += `<li class="list-group-item"><strong>Email :</strong> ${email}</li>`;
            html += `<li class="list-group-item"><strong>Téléphone :</strong> ${tel}</li>`;
            html += '</ul>';


            recapContent.innerHTML = html;
            updateCalculations(); // Assurer que le total est à jour
        }


        // --------------------------------------------------------
        // 6. CHARGEMENT INITIAL DES DONNÉES ET ÉVÉNEMENTS
        // --------------------------------------------------------
        function loadData() {
            // Charge toutes les données enregistrées
            const allSavedIds = [...QUANTITY_IDS, ...TEXT_INPUT_IDS];

            allSavedIds.forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    const savedValue = localStorage.getItem(id);
                    if (savedValue !== null) {
                        input.value = savedValue;
                    }
                }
            });

            // Met à jour les calculs initiaux (nécessaire pour le total et l'état des tabs)
            updateCalculations();

            // Ajout des écouteurs d'événements pour les boutons radio de don
            document.querySelectorAll('input[name="don-option"]').forEach(radio => {
                radio.addEventListener('change', (e) => {
                    // Logique pour gérer les dons prédéfinis (à implémenter si besoin)
                    console.log(`Option de don sélectionnée: ${e.target.id}`);
                });
            });
        }
        // Assurez-vous que l'élément Toast existe
const toastElement = document.getElementById('adhesionToast');

// 1. Initialiser le Toast de Bootstrap
const adhesionToast = new bootstrap.Toast(toastElement, {
    autohide: true,
    delay: 4000
});

// 2. Fonction à appeler au clic du bouton "Adhérer"
document.getElementById('boutonAdherer').addEventListener('click', function() {
    adhesionToast.show();
    // Le reste de la logique (désactiver le bouton, etc.)
});

        // Lance le chargement des données lorsque la page est complètement chargée
        document.addEventListener('DOMContentLoaded', loadData);
