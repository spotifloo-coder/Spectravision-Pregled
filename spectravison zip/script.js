document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. Logika za Burger Meni (navSlide)
    // =======================================================
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');

        if (burger && nav) {
            burger.addEventListener('click', () => {
                // Toggle Nav
                nav.classList.toggle('nav-active');

                // Animiraj linkove
                navLinks.forEach((link, index) => {
                    if (nav.classList.contains('nav-active')) {
                        link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                    } else {
                        link.style.animation = ``; // Uklonite animaciju pri zatvaranju
                    }
                });

                // Animacija Burger ikone
                burger.classList.toggle('toggle');
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
        autoSlideInterval = setInterval(showSlides, intervalTime);
    }

    // Dodela globalnih funkcija globalnom objektu (window)
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
                const response = await fetch('send_email.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                     // Baca grešku u zavisnosti od statusa (npr. 404, 500)
                     throw new Error(`HTTP greška! Status: ${response.status}`);
                }

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
    if (slides.length > 0) {
        showSlides(1); // Prikazuje prvu sliku
        autoSlideInterval = setInterval(showSlides, intervalTime); // Pokreće automatski klizač
    }
    navSlide(); // Pokreće logiku za Burger Meni
});