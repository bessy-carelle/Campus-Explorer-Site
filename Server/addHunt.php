<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    $con = connectionPDO();
    // Validation des données POST
    $nom = validateInput($_POST['name']);
    $hint = validateInput($_POST['indice']);
    $admin = validateInput($_POST['admin']);

    $url = 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/images/cibles/';

     // Vérification des champs requis
    if (empty($hint) || empty($admin) || empty($nom)) {
        echo json_encode(["status" => "error", "message" => "Il manque l'idAdmin, le nom ou l'indice de la cible."]);
        exit;
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $fileInfo = pathinfo($_FILES['image']['name']);
        $basename = $fileInfo['basename'];
        $fileType = strtolower($fileInfo['extension']);
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
        $dispo = 0;

        if (in_array($fileType, $allowedTypes)) {
            $targetDir ='../images/cibles/'; // Chemin vers le dossier cible
            $targetPath = $targetDir . $basename;
            $res = move_uploaded_file($_FILES['image']['tmp_name'], $targetPath);
            $chemin = $url . $basename;

            if ($res) {
                $stmt = $con->prepare("INSERT INTO Cibles (nom,data, indice, idAdmin,dispo) VALUES (:nom, :data, :hint, :admin,:dispo)");
                $stmt->bindParam(':nom',$nom);
                $stmt->bindParam(':data',$chemin );
                $stmt->bindParam(':hint', $hint);
                $stmt->bindParam(':admin', $admin);
                $stmt->bindParam(':dispo',$dispo);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "OK", "message" => "Image téléchargée et données insérées avec succès"]);
                } else {
                    $rep = $stmt -> errorInfo();
                    echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $rep[2]]);
                }
            } else {
                echo json_encode(["status" => "error", "message" => "echec lors du deplacement du fichier. Verifiez les permissions"]);
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
