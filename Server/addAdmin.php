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
    $stmt = $con->prepare("INSERT INTO Administrateurs (pseudo, mail, passWord) VALUES (:name, :mail, :pass)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':mail', $mail);
    $stmt->bindParam(':pass', $pass);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Utilisateur ajouté avec succès."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors de l'ajout de l'utilisateur."]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
