<?php
require("connetion.php");
if (isset($_GET["email"]) && isset($_GET["token"])) {
    $email = filter_var($_GET["email"], FILTER_SANITIZE_EMAIL);
    $token = $_GET["token"];

    try {
        $con = connectionPDO();
        // Vérifier si l'utilisateur et le token existent
        $stmt = $con->prepare("SELECT * FROM Utilisateurs WHERE mail = :email AND token = :token AND verified = 0");
        $stmt->execute(array(":email" => $email, ":token" => $token));
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Mettre à jour le statut de l'utilisateur
            $update = $con->prepare("UPDATE Utilisateurs SET verified = 1 WHERE mail = :email");
            $update->execute(array(":email" => $email));

            echo " Votre adresse e-mail a été vérifiée avec succès !";
        } else {
            echo "Lien de vérification invalide ou déjà utilisé.";
        }

    } catch (PDOException $e) {
        die("Erreur SQL : " . $e->getMessage());
    }
} else {
    echo "Paramètres manquants.";
}
?>