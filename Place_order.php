<?php

header("Content-Type: application/json");

include "db.php";

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!$data) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request"
    ]);

    exit;
}

$name = $data["customer_name"] ?? "";
$phone = $data["phone"] ?? "";
$items = $data["items"] ?? [];

if ($name === "" || $phone === "" || empty($items)) {

    echo json_encode([
        "success" => false,
        "message" => "Please provide all details"
    ]);

    exit;
}

$total = 0;

foreach ($items as $item) {

    $price = (float)$item["price"];
    $quantity = (int)$item["quantity"];

    $total += $price * $quantity;
}

$stmt = $conn->prepare(
    "INSERT INTO orders
    (customer_name, phone, total, status)
    VALUES (?, ?, ?, 'Pending')"
);

$stmt->bind_param(
    "ssd",
    $name,
    $phone,
    $total
);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true,
        "message" => "Order placed successfully"
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Failed to place order"
    ]);
}

$stmt->close();
$conn->close();

?>
