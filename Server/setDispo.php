<?php
require("connection.php");
header("Content-Type: application/json; charset=UTF-8");

// Autoriser l'accès depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try{
    $con = connectionPDO();

    $idCible = isset($_POST['idCible']) ? validateInput($_POST['idCible']) : '';
    //$val = $_POST['dispo'];
    $stmt = $con->prepare("UPDATE Cibles set dispo = 1 where idCible = :idcible");
    $stmt->bindParam(':idcible',$idCible);
    $stmt->execute();
    $result = $stmt->rowCount();
    if ($result > 0){
        echo json_encode(["statuts" => "success", "message" => "mofifié avec succès"]);
    }else{
        echo json_encode(["satuts" => "error","message" => "echec de la modification"]);
    } 

}catch(Exception $e){ 
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur serveur : " . $e->getMessage()]);
    exit;
}
?>