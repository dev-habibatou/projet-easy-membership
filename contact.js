
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('contactForm');
            
            const formInputs = {
                name: document.getElementById('contactName'),
                email: document.getElementById('contactEmail'),
                phone: document.getElementById('contactPhone'),
                subject: document.getElementById('contactSubject'),
                message: document.getElementById('contactMessage')
            };

            if (form) {
                form.addEventListener('submit', function(event) {
                    event.preventDefault();

                    const formData = {
                        nom: formInputs.name.value.trim(),
                        email: formInputs.email.value.trim(),
                        telephone: formInputs.phone.value.trim(),
                        sujet: formInputs.subject.value.trim(),
                        message: formInputs.message.value.trim(),
                        dateSoumission: new Date().toLocaleString('fr-FR')
                    };

                    if (formData.nom === '' || formData.email === '') {
                        alert("Veuillez remplir au moins les champs 'Votre nom*' et 'Votre email*'.");
                        return;
                    }

                    try {
                        let messages = JSON.parse(localStorage.getItem('messagesContact')) || [];
                        messages.push(formData);

                        localStorage.setItem('messagesContact', JSON.stringify(messages));

                        alert('Votre message a été sauvegardé!\n\n' +
                            'Nom: ' + formData.nom + '\n' +
                            'Email: ' + formData.email + '\n' +
                            'Message: ' + formData.message.substring(0, 50) + '...');

                        form.reset();

                    } catch (e) {
                        console.error("Erreur lors de l'accès au LocalStorage :", e);
                        alert("Erreur de stockage local. Veuillez réessayer.");
                    }
                });
            } else {
                console.error("Erreur: Impossible de trouver le formulaire de contact.");
            }
        });