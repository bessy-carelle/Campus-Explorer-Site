<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(["status" => "error", "message" => "Adresse e-mail invalide."]));
    }

    // Générer un token unique (alternative à random_bytes())
    $token = md5(uniqid(rand(), true));
    $verificationLink = "https://ton-site.com/verify.php?email=$email&token=$token";

    // Connexion à la base de données
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=ton_database", "root", "password");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insérer l'utilisateur avec un token
        $stmt = $pdo->prepare("INSERT INTO users (email, token, verified) VALUES (:email, :token, 0)");
        $stmt->execute(array(":email" => $email, ":token" => $token));

    } catch (PDOException $e) {
        die(json_encode(["status" => "error", "message" => "Erreur SQL : " . $e->getMessage()]));
    }

    // Contenu de l'e-mail
    $subject = "Vérification de votre e-mail";
    $message = "
    <html>
        <body>
            <h2>Vérifiez votre e-mail</h2>
            <p>Cliquez sur le lien ci-dessous pour confirmer votre adresse e-mail :</p>
            <a href='$verificationLink'>Confirmer mon e-mail</a>
            <p>Ce lien expirera dans 24 heures.</p>
        </body>
    </html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@ton-site.com" . "\r\n";

    // Envoi de l'e-mail
    if (mail($email, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "E-mail de vérification envoyé avec succès !"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors de l'envoi de l'e-mail."]);
    }
} else {
    die(json_encode(["status" => "error", "message" => "Méthode non autorisée."]));
}
?>