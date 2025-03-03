<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


try {
    $con = connectionPDO();
    $photo = $_POST['idPhoto'];
    if (empty($photo)){
        echo json_encode(["status" => "error", "message" => "il manque l'id de la photo"]);
        exit;
    }
    if ($_SERVER["REQUEST_METHOD"] === "POST") {

        $stmt = $con->prepare("INSERT INTO PhotoValides (idUser, idPhoto, idCible, nomPhoto, data)
            SELECT idUser, idPhoto, idCible, nomPhoto, data
            FROM Photos
            WHERE idPhoto = :idPhoto;"
        );
        $stmt->bindParam(':idPhoto', $photo);
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
