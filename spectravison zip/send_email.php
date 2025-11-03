<?php
// Postavite vašu ciljnu e-mail adresu
$recipient = "office@spectravision.rs";

// Provera da li je zahtev stigao preko POST metode
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Prikupljanje i čišćenje podataka iz forme
    $imePrezime = strip_tags(trim($_POST["ime-prezime"]));
    $email = filter_var(trim($_POST["email-adresa"]), FILTER_SANITIZE_EMAIL);
    $pitanje = trim($_POST["pitanje"]);

    // Provera obaveznih polja
    if (empty($pitanje) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        //HTTP odgovor za grešku
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Molimo popunite sva obavezna polja i unesite validnu e-mail adresu."]);
        exit;
    }

    // Telo e-maila
    $email_content = "Pitanje za Spectra Vision - Pitaj Eksperta:\n\n";
    $email_content .= "Ime i Prezime: " . (!empty($imePrezime) ? $imePrezime : "Nije uneto") . "\n";
    $email_content .= "E-mail adresa: $email\n\n";
    $email_content .= "Pitanje:\n$pitanje\n";

    // Zaglavlje e-maila
    $email_subject = "NOVO PITANJE ZA EKSPERTA SA SAJTA - " . (!empty($imePrezime) ? $imePrezime : "Anonimno");
    $email_headers = "From: Spectra Vision Kontakt <office@spectravision.rs>";
    $email_headers .= "\r\nReply-To: $email";
    
    // Slanje e-maila
    if (mail($recipient, $email_subject, $email_content, $email_headers)) {
        // Uspešno slanje
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Vaše pitanje je uspešno poslato! Hvala Vam."]);
    } else {
        // Greška pri slanju
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Došlo je do greške na serveru. Pokušajte ponovo kasnije."]);
    }

} else {
    // Ako nije POST zahtev
    http_response_code(403);
    echo json_encode(["success" => false, "message" => "Pokušaj direktnog pristupa nije dozvoljen."]);
}
?>