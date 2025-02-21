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
    $idUser = isset($_GET['idUser']) ? $_GET['idUser'] : null;

    // Préparation de la requête SQL
    if (!empty($idUser)) {
        $stmt = $con->prepare("SELECT idCible, idPhoto,idUser,pseudo as user,Photos.data as src,Cibles.nom as nomCible, Cibles.data as cible , motif from Signalements Join Photos using (idPhoto) join Cibles using (idCible)
                                join Utilisateurs using (idUser) WHERE idUser = :idUser");
        $stmt->bindParam(':idUser', $idUser, PDO::PARAM_INT);
    } else {
        $stmt = $con->prepare("SELECT idCible, idPhoto,idUser,pseudo as user,Photos.data as src,Cibles.nom as nomCible, Cibles.data as cible , motif from Signalements Join Photos using (idPhoto) join Cibles using (idCible)
                                join Utilisateurs using (idUser)");
    }

    // Exécution de la requête
    if ($stmt->execute()) {
        $signal = [];
        while($val = $stmt->fetch()){
            //encode des données des photos en base64
            $base64 = base64_encode($val['src']);
            $base = base64_encode($val['cible']);
            $elt = [
                "idCible" =>$val['idCible'],
                "idPhoto" =>$val['idPhoto'],
                "idUser" =>$val['idUser'],
                "user" => $val['user'],
                "src" => $base64,
                "cible" => $base,
                "nomCible" => $val['nomCible'],
                "motif" => $val['motif'],
            ];
            $signal[] = $elt;
        }
        echo json_encode(["status" => "success", "message" => $signal ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Erreur : ".$stmt->errorInfo()]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
