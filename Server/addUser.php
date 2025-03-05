<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
// Autoriser l'accès depuis n'importe quelle origine (à adapter selon vos besoins)
header("Access-Control-Allow-Origin: *");

// Autoriser certaines méthodes HTTP (GET, POST, etc.)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Autoriser certains en-têtes
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    $con = connectionPDO(); // 
    
    // Récupération et validation des données d'entrée
    $name = validateInput($_POST['pseudo']);
    $pass = validateInput($_POST['passWord']);
    $mail = filter_var($_POST["mail"], FILTER_SANITIZE_EMAIL);


    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        die(json_encode(["status" => "error", "message" => "Adresse e-mail invalide."]));
    }
    // Vérification que les champs obligatoires sont remplis
    if (empty($name) || empty($pass)) {
        echo json_encode(["status" => "error", "message" => "il manque le nom ou le mot de passe."]);
        exit;
    }

    // Générer un token unique (alternative à random_bytes())
    $token = md5(uniqid(rand(), true));
    $verif = 0;
    $verificationLink = "https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/PDO/verify.php?email=$mail&token=$token";

    // Préparation et exécution de la requête d'insertion
    //IMportant : Hachez le mot de passe
    //$crypte = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $con->prepare("INSERT INTO Utilisateurs (pseudo, mail, passWord,token,verified) VALUES (:name, :mail, :pass,:token,:verif)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':mail', $mail);
    $stmt->bindParam(':pass', $pass);
    $stmt->bindParam(':token', $token);
    $stmt->bindParam(':verif', $verif);
    
    // Contenu de l'e-mail
    $subject = "Vérification de votre e-mail";
    $message =`
    <html>
        <body>
            <h2>Vérifiez votre e-mail</h2>
            <p>Cliquez sur le lien ci-dessous pour confirmer votre adresse e-mail :</p>
            <a href='$verificationLink'>Confirmer mon e-mail</a>
            <p>Ce lien expirera dans 24 heures.</p>
        </body>
    </html>`;

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@ton-site.com" . "\r\n";

    // Lancement de la requête
    if ($stmt->execute()) {
        // Envoi de l'e-mail
        if (mail($mail, $subject, $message, $headers)) {
            echo json_encode(["status" => "success", "message" => "OK"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erreur lors de l'envoi de l'e-mail."]);
        }
        // header("Location: https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Campus-Explorer/Pages/welcome/connexion.html");
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : ".$stmt->errorInfo()]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
