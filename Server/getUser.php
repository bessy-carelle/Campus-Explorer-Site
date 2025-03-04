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
    // Connexion à la base de données avec PDO
    $con = connectionPDO(); // Assurez-vous que la fonction connectionPDO() retourne une instance PDO

    // Validation de l'input
    $idUser = isset($_SESSION['user']) ? $_SESSION['user']['idUser'] : null;

    // Préparation de la requête SQL
    if (!empty($idUser)) {
        $stmt = $con->prepare("SELECT idUser, pseudo, mail, passWord,score FROM Utilisateurs WHERE idUser = :idUser");
        $stmt->bindParam(':idUser', $idUser, PDO::PARAM_INT);
    } else {
        $stmt = $con->prepare("SELECT idUser, pseudo, mail, passWord FROM Utilisateurs");
    }

    // Exécution de la requête
    if ($stmt->execute()) {
          // Récupération des résultats sous forme de tableau associatif
            $user = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => $user ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : ".$stmt->errorInfo()]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
