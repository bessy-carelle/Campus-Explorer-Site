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
    $con = connectionPDO(); // Assurez-vous que cette fonction retourne une instance PDO
    
    // Récupération et validation des données d'entrée
    $name = validateInput($_POST['pseudo']);
    $mail = validateInput($_POST['mail']);
    $pass = validateInput($_POST['passWord']);

    // Vérification que les champs obligatoires sont remplis
    if (empty($name) || empty($mail) || empty($pass)) {
        echo json_encode(["status" => "error", "message" => "Veuillez remplir tous les champs."]);
        exit;
    }

    // Préparation et exécution de la requête d'insertion
    //IMportant : Hachez le mot de passe
    //$crypte = password_hash($pass, PASSWORD_DEFAULT);
    $stmt = $con->prepare("INSERT INTO Utilisateurs (pseudo, mail, passWord) VALUES (:name, :mail, :pass)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':mail', $mail);
    $stmt->bindParam(':pass', $pass);

    if ($stmt->execute()) {
        header("Location: https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Campus-Explorer/Pages/welcome/connexion.html");
        echo json_encode(["status" => "success", "message" => "Utilisateur ajouté avec succès."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : ".$stmt->errorInfo()]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
