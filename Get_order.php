<?php

header("Content-Type: application/json");

include "db.php";

$result = $conn->query(
    "SELECT * FROM orders
     ORDER BY id DESC"
);

$orders = [];

while ($row = $result->fetch_assoc()) {

    $orders[] = $row;
}

echo json_encode($orders);

$conn->close();

?>
