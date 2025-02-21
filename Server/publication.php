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
    $idUser = validateInput($_GET['idUser']);

    // Vérification que les champs obligatoires sont remplis
    if (empty($idUser)) {
        echo json_encode(["status" => "error", "message" => "Donnez l'id"]);
        exit;
    }

    // Préparation et exécution de la requête d'insertion
    $stmt = $con->prepare("select * from Photos JOIN Publications using (idPhoto) where idUser = :idUser");
    $stmt->bindParam(':idUser', $idUser);

    if ($stmt->execute()) {
        $publication = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => $publication]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : ".$stmt->errorInfo()]);
    }

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
