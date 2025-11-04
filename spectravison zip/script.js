document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
// 1. Logika za Burger Meni (navSlide)
// =======================================================
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li a'); // Dodato 'a' da dohvatimo same linkove

    if (burger && nav) {
        
        // Funkcija za zatvaranje menija
        const closeNav = () => {
            if (nav.classList.contains('nav-active')) {
                // Ukloni aktivnu klasu (zatvara meni)
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');

                // Ukloni animaciju sa linkova
                document.querySelectorAll('.nav-links li').forEach(link => {
                    link.style.animation = ''; 
                });
            }
        };

        // 1. Klik na Burger Ikonu (otvara/zatvara)
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animiraj linkove (ostavljamo stari kod za animaciju)
            document.querySelectorAll('.nav-links li').forEach((link, index) => {
                if (nav.classList.contains('nav-active')) {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                } else {
                    link.style.animation = ``; // Uklonite animaciju pri zatvaranju
                }
            });

            // Animacija Burger ikone
            burger.classList.toggle('toggle');
        });


        // 2. Klik na Link unutar menija (zatvara nakon navigacije)
        // Sada iteriramo kroz sve 'a' tagove unutar menija
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Pozivamo funkciju za zatvaranje menija
                closeNav();
            });
        });
    }
}


    // =======================================================
    // 2. Logika za Klizač Slika (Slider)
    // =======================================================
    let slideIndex = 0;
    let autoSlideInterval;
    const slides = document.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.dot');
    const intervalTime = 4000; // 4 sekunde

    function showSlides(n) {
        if (n === undefined) {
            slideIndex++;
        } else {
            slideIndex = n;
        }

        if (slideIndex > slides.length) {
            slideIndex = 1
        }
        if (slideIndex < 1) {
            slideIndex = slides.length
        }

        slides.forEach(slide => slide.style.display = "none");
        dots.forEach(dot => dot.classList.remove("active-dot"));

        if (slides.length > 0) {
            slides[slideIndex - 1].style.display = "block";
            if (dots.length > 0) {
                dots[slideIndex - 1].classList.add("active-dot"); 
            }
        }
    }

    function plusSlides(n) {
        resetAutoSlide();
        showSlides(slideIndex + n);
    }

    function currentSlide(n) {
        resetAutoSlide();
        showSlides(n);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        // Da ne bi odmah pokrenuo, već sa malim delay-em
        setTimeout(() => {
            autoSlideInterval = setInterval(showSlides, intervalTime);
        }, 100); 
    }

    // Dodela globalnih funkcija globalnom objektu (window)
    // Ove su potrebne jer se pozivaju direktno iz onclick atributa u HTML-u
    window.plusSlides = plusSlides;
    window.currentSlide = currentSlide;
    
    // =======================================================
    // 3. Logika za Modal 'Pitaj Eksperta' i PHP Slanje
    // =======================================================
    
    const modal = document.getElementById("expert-modal");
    const btn = document.getElementById("pitaj-eksperta-btn");
    const closeBtn = document.getElementsByClassName("close-btn")[0]; 
    const form = document.getElementById("expert-form");
    const formMessage = document.getElementById("form-message");

    // B) Zatvaranje modala
    function closeModal() {
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; 
            if (formMessage) formMessage.textContent = ''; 
            if (form) form.reset(); 
        }
    }
    
    // A) Prikaz modala na klik
    if (btn && modal) {
        btn.onclick = function(e) {
            e.preventDefault(); 
            modal.style.display = "block";
            document.body.style.overflow = 'hidden'; 
        }
    }

    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }

    // Zatvaranje modala klikom van njega
    window.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // C) Obrada slanja forme (AJAX na PHP)
    if (form && formMessage) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            formMessage.textContent = 'Šaljem... Molimo sačekajte.';
            formMessage.style.color = '#007bff'; 

            const formData = new FormData(form);

            try {
                // Poziva send_email.php
                const response = await fetch('send_email.php', { 
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP greška! Status: ${response.status}`);
                }

                // PHP vraća JSON odgovor (uspeh ili neuspeh)
                const result = await response.json();

                if (result.success) {
                    formMessage.textContent = result.message;
                    formMessage.style.color = 'green';
                    
                    form.reset();
                    // Zatvori modal nakon 3 sekunde
                    setTimeout(() => {
                        closeModal();
                    }, 3000);

                } else {
                    formMessage.textContent = result.message;
                    formMessage.style.color = 'red';
                }

            } catch (error) {
                console.error('Došlo je do greške u slanju:', error);
                formMessage.textContent = 'Došlo je do greške u konekciji ili na serveru. Pokušajte ponovo.';
                formMessage.style.color = 'red';
            }
        });
    }

    // =======================================================
    // 4. Inicijalizacija
    // =======================================================

    // =======================================================
// 4. Inicijalizacija (Postojeći kod)
// =======================================================
    if (slides.length > 0) {
        showSlides(1); // Prikazuje prvu sliku
        autoSlideInterval = setInterval(showSlides, intervalTime); // Pokreće automatski klizač
    }
    navSlide(); // Pokreće logiku za Burger Meni
});

// =======================================================
// 5. Aktivacija Nav Linkova pri Skrolovanju (NOVI KOD)
// =======================================================

// 5.1 Dohvatanje svih sekcija koje imaju ID (ankere) i svih navigacionih linkova
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links li a');

const observerOptions = {
    root: null, // Gleda se vidno polje (viewport)
    rootMargin: '0px',
    // Procenti kada se sekcija smatra aktivnom: 
    // Threshold 0.3 znači da je 30% sekcije vidljivo da bi se aktivirala.
    threshold: 0.3 
};

// Funkcija koja se poziva kada sekcija uđe/izađe iz vidnog polja
const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        const targetId = entry.target.getAttribute('id');
        const currentLink = document.querySelector(`.nav-links a[href="#${targetId}"]`);
        
        // Funkcija za uklanjanje 'active' klase sa svih linkova
        const removeActive = () => {
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
        };

        if (entry.isIntersecting) {
            // Ako sekcija ulazi u vidno polje
            
            // 1. Ukloni active klasu sa SVIH (osim Naslovna, koja je 'index.html')
            removeActive();

            // 2. Dodaj active klasu trenutnom linku
            if (currentLink) {
                currentLink.classList.add('active');
            }

        } else {
            // Ako sekcija izlazi iz vidnog polja (opcionalno, ali pomaže u čišćenju)
            // Uklanja active klasu sa linka kada sekcija izađe (tj. kada uđe sledeća)
            if (currentLink) {
                currentLink.classList.remove('active');
            }
        }

        // Dodatni Fiks: Proverava da li je korisnik skrolovan do samog vrha stranice.
        // Ako jeste, aktiviraj Naslovnu
        if (window.scrollY < 100) { 
            removeActive();
            document.querySelector('.nav-links a[href="index.html"]').classList.add('active');
        }
    });
}, observerOptions);

// Prijavi sve sekcije na posmatranje
sections.forEach(section => {
    sectionObserver.observe(section);
});

    // 6. Automatsko ažuriranje godine
const yearSpan = document.getElementById('current-year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
