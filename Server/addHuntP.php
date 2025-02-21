<?php
session_start();
require("connection.php");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    $con = connectionPDO();
    // Validation des données POST
    $nom = validateInput($_POST['nom']);
    $hint = validateInput($_POST['indice']);
    $idUser = validateInput($_POST['idUser']);

    $url = 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/images/cibles/';

     // Vérification des champs requis
    if (empty($hint) || empty($nom)) {
        echo json_encode(["status" => "error", "message" => "Il manque l'indice ou le nom de la cible."]);
        exit;
    }if(empty($idUser)){
        echo json_encode(["status" => "error", "message" => "Il manquel'idUser"]);
        exit; 
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $fileInfo = pathinfo($_FILES['image']['name']);
        $basename = $fileInfo['basename'];
        $fileType = strtolower($fileInfo['extension']);
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($fileType, $allowedTypes)) {
            $targetDir ='../images/cibles/'; // Chemin vers le dossier cible
            $targetPath = $targetDir . $basename;
            $res = move_uploaded_file($_FILES['image']['tmp_name'], $targetPath);
            $chemin = $url . $basename;

            if ($res) {
                $stmt = $con->prepare("INSERT INTO CiblePropose (idUser,nomCible,url, indice) VALUES (:idUser,:nom, :url, :hint)");
                $stmt->bindParam(':idUser',$idUser);
                $stmt->bindParam(':nom',$nom);
                $stmt->bindParam(':url',$chemin );
                $stmt->bindParam(':hint', $hint);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "OK", "message" => "Image téléchargée et données insérées avec succès"]);
                } else {
                    $rep = $stmt -> errorInfo();
                    echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $rep[2]]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "echec lors du deplacement du fichier.Verifiez les permissions"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Format de fichier non autorisé"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur lors du téléchargement. Code : " . $_FILES['image']['error']]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Erreur : " . htmlspecialchars($e->getMessage())]);
}
?>
