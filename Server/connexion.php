<?php

require("connection.php");
header("Content-Type: application/json; charset=UTF-8");

// Autoriser l'accès depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
    $con = connectionPDO();

    // Vérifier si les données POST existent
    $nom = isset($_POST['name']) ? validateInput($_POST['name']) : '';
    $passWord = isset($_POST['pass']) ? validateInput($_POST['pass']) : '';

    if (empty($nom) || empty($passWord)) {
        echo json_encode(["status" => "error", "message" => "Remplissez tous les champs"]);
        exit;
    }

    // Vérification de l'utilisateur
    $stmt = $con->prepare("SELECT idUser,pseudo, passWord FROM Utilisateurs WHERE pseudo = :name");
    $stmt->bindParam(':name', $nom);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    // Vérification de l'administrateur
    $req = $con->prepare("SELECT idAdmin, pseudo, passWord FROM Administrateurs WHERE pseudo = :name");
    $req->bindParam(':name', $nom);
    $req->execute();
    $retour = $req->fetch(PDO::FETCH_ASSOC);
   
    $verif = ($passWord===$result['passWord']);
    // Vérification du mot de passe pour l'utilisateur
    if ($result && $verif) {
        echo json_encode(["status" => "success", "message" => "Utilisateur", "id" => $result['idUser'],"pseudo"=>$result['pseudo']]);
        exit;
    }
    $vraie = ($passWord===$retour['passWord']);
    // Vérification du mot de passe pour l'administrateur
    if ($retour && $vraie) {
       
        echo json_encode(["status" => "success", "message" => "Administrateur", "id" => $retour['idAdmin'],"pseudo"=>$retour['pseudo']]);
        exit;
    }

    // Si aucun utilisateur n'a été trouvé
    echo json_encode(["status" => "error", "message" => "Nom ou mot de passe incorrect"]);
    exit;

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur serveur : " . $e->getMessage()]);
    exit;
}
?>
