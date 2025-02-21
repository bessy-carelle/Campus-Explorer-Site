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
    $idCible = isset($_GET['idCible']) ? $_GET['idCible'] : null;
    $dispo = isset($_GET['dispo']) ? $_GET['dispo'] : null;

    // Préparation de la requête SQL
    if (!empty($idCible)) {
        $stmt = $con->prepare("SELECT idCible, nom, data, indice, idAdmin,dispo FROM Cibles WHERE idCible = :idCible");
        $stmt->bindParam(':idCible', $idCible, PDO::PARAM_INT);
    }else if (!empty($dispo)){
        $stmt = $con->prepare("SELECT idCible, nom, data, indice, idAdmin,dispo FROM Cibles WHERE dispo = :d");
        $stmt->bindParam(':d', $dispo, PDO::PARAM_INT);
    } else {
        $stmt = $con->prepare("SELECT idCible, nom, data, indice, idAdmin, dispo FROM Cibles");
    }

    // Exécution de la requête
    if ($stmt->execute()) {
        $cibles = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => $cibles ]);
    } else {
        $rep = $stmt->errorInfo();
        echo json_encode(["status" => "error", "message" => "Erreur : ".$rep[2]]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
