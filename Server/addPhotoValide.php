<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


try {
    $con = connectionPDO();
    $photo = validateInput($_POST['photo']);
    $user = validateInput($_POST['user']); //id de l'utilisateur
    $cible = validateInput($_POST['cible']);//id de la cible de la photo
    $url = validateInput($_POST['url']);
    
    if (empty($cible)|| empty($user)){
        echo json_encode(["status" => "error", "message" => "Donnez l'ID de la cible de la photo ou id du joueur"]);
        exit;
    }
    if(empty($photo)){
        echo json_encode(["status" => "error", "message" => "Donnez l'id de la photo"]);
        exit;
    }
    if(empty($url)){
        echo json_encode(["status" => "error", "message" => "Donnez l'url de la photo"]);
        exit;
    }
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $stmt = $con->prepare("INSERT INTO Photos (idPhoto,idUser,data, idCible) VALUES (:photo,:user,:data, :cible)");
        $stmt->bindParam(':user',$user);
        $stmt->bindParam(':photo', $photo);
        $stmt->bindParam(':data', $url);
        $stmt->bindParam(':cible', $cible);

        if ($stmt->execute()) {
            echo json_encode(["status" => "OK", "message" => "Données insérées avec succès"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $stmt->errorInfo()]);
        }
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur : " . htmlspecialchars($e->getMessage())]);
}
?>
