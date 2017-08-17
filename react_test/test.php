<?php

    header("Content-Type: application/json");
    
    $response = array(
        'prop1' => 1,
        'prop2' => true,
        'original_msg' => $_POST['message'],
        'a' => [2, 1, 3, 4]
    );
    
    echo json_encode($response);
?>