<?php
require("connection.php");

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    $con = connectionPDO();
    // Validation des données POST
    $hint = validateInput($_POST['indice']);
    $debut = validateInput($_POST['debut']);
    $fin = validateInput($_POST['fin']);
    $admin = validateInput($_POST['admin']);

    // Vérification des champs requis
    if (empty($hint) || empty($debut) || empty($fin) || empty($admin)) {
        echo json_encode(["status" => "error", "message" => "Tous les champs sont requis."]);
        exit;
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileName = basename($_FILES['image']['name']);
        $fileType = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($fileType, $allowedTypes)) {
            // Préparer l'URL et les informations d'authentification
            $url = 'https://mi-phpmut.univ-tlse2.fr/~rahman.djobo/Projet_php/images/cibles';
            $username = "rahman.djobo"; // Remplacez par votre identifiant
            $password = "Ram60#nouveau"; // Remplacez par votre mot de passe

            // Convertir le fichier pour l'envoi
            $fileTempPath = $_FILES['image']['tmp_name'];

            $data = [
                'image' => '@' . $fileTempPath . ';filename=' . $fileName,
            ];

            // Initialiser cURL
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url); // URL cible
            curl_setopt($ch, CURLOPT_POST, true); // Requête POST
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Retourner la réponse au lieu de l'afficher
            curl_setopt($ch, CURLOPT_USERPWD, "$username:$password"); // Authentification
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data); // Ajouter les données

            // Exécuter la requête
            $response = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

            // Vérifier le succès de l'opération
            if ($response && $http_code === 200) {
                $stmt = $con->prepare("INSERT INTO Cibles (nom,data,indice, dateDebut, dateFin, idAdmin) VALUES (:nom, :data, :hint, :debut, :fin, :admin)");
                $stmt->bindParam(':nom',$name);
                $stmt->bindParam(':data', $url . $fileName);
                $stmt->bindParam(':hint', $hint);
                $stmt->bindParam(':debut', $debut);
                $stmt->bindParam(':fin', $fin);
                $stmt->bindParam(':admin', $admin);

                if ($stmt->execute()) {
                    echo json_encode(["status" => "OK", "message" => "Image téléchargée et données insérées avec succès"]);
                } else {
                    echo json_encode(["status" => "error", "message" => "Erreur SQL : " . $stmt->errorInfo()]);
                }
            } else if (!$response) {
                echo json_encode(["status" => "error", "message" => "No response"]);
            } else{
                echo json_encode(["status" => "error", "reponse.http" => $response]);
            }

            curl_close($ch);
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
