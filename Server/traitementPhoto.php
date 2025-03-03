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
    $stmt = $con->prepare("SELECT idCible, idUser, nomPhoto, idPhoto, Photos.data as photo , Cibles.data as cible from Photos
                            inner join Cibles using (idCible)
                            group by idCible ");

    // Exécution de la requête
    if ($stmt->execute()) {
        $infos = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => $infos ]);
    } else {
        $rep = $stmt->errorInfo();
        echo json_encode(["status" => "error", "message" => "Erreur : ".$rep[2]]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
