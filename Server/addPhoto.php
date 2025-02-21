<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


try {
    $con = connectionPDO();
    $user = validateInput($_POST['idUser']); //id de l'utilisateur
    $cible = validateInput($_POST['idCible']);//id de la cible de la photo
    $url = 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/images/photos/';
    if (empty($cible)|| empty($user)){
        echo json_encode(["status" => "error", "message" => "Donnez l'ID de la cible de la photo ou id du joueur"]);
        exit;
    }
    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $fileInfo = pathinfo($_FILES['image']['name']);
        $nom = $fileInfo['basename'];
        $fileType = strtolower($fileInfo['extension']);
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($fileType, $allowedTypes)) {
            // Créer un nom unique pour éviter les conflits
            $targetDir ='../images/photos/'; // Chemin vers le dossier cible
            $targetPath = $targetDir . $nom;
            $res = move_uploaded_file($_FILES['image']['tmp_name'], $targetPath);
            $chemin = $url . $nom;

            if ($res) {
                $stmt = $con->prepare("INSERT INTO Photos (idUser,nomPhoto, data, idCible) VALUES (:user,:name, :data, :cible)");
                $stmt->bindParam(':user',$user);
                $stmt->bindParam(':name', $nom);
                $stmt->bindParam(':data', $chemin);
                $stmt->bindParam(':cible', $cible);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "OK", "message" => "Image téléchargée et données insérées avec succès"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $stmt->errorInfo()]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "Échec lors du déplacement du fichier"]);
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
