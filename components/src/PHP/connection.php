<?php
// Credenciales de SpiderDND en IONOS
$servername = "db5020056423.hosting-data.io";
$username = "dbu5204942";
$password = "ProyectoGaboPerron123";
$dbname = "dbs15463356"; 

try {
    $conexion = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Respuesta en JSON por si React intenta consultar y falla
    header('Content-Type: application/json');
    echo json_encode(["error" => "Fallo de conexión: " . $e->getMessage()]);
    exit;
}
?>