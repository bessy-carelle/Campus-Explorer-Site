<?php
session_start();
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
    $idCibleP = isset($_GET['idCibleP']) ? $_GET['idCibleP'] : null;
    $idUser = isset($_SESSION['user']) ? $_SESSION['user']['idUSer'] : null;

    // Préparation de la requête SQL
    if (!empty($idCible)) {
        $stmt = $con->prepare("SELECT idCibleP,idUser,nomCible,url,indice,dispo FROM CiblePropose WHERE idCibleP = :idCibleP");
        $stmt->bindParam(':idCibleP', $idCibleP, PDO::PARAM_INT);
    }else if(!empty($idUser)){
        $stmt = $con->prepare("SELECT idCibleP,idUser,nomCible,url,indice,dispo FROM CiblePropose WHERE idUser = :idUser");
        $stmt->bindParam(':idUser', $idUser, PDO::PARAM_INT);
    } else {
        $stmt = $con->prepare("SELECT idCibleP,idUser,nomCible,url,indice,dispo FROM CiblePropose");
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
