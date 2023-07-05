<?php

include_once 'includes/dbh.inc.php';

class UsersService {
    function addUser($user) {
        global $conn;

        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $login = $user["login"];
        $firstName = $user['firstName'];
        $lastName = $user['lastName'];
        $password = $user['password'];
        $fullName = $firstName . " " . $lastName;

        $sql = "INSERT INTO user(`login`, `fullName`, `password`)
            VALUES ('$login','$fullName', sha1('$password'))";

        try {
            if(mysqli_query($conn, $sql) == false) {
                return ["success" => false, "message" => "Sign up fault"];
            }  
        } catch(Exception $exc) {
            return ["success" => false, "message" => "Full name must be unique"];
        }
          
        
        return ["success" => true, "message" => "Sign up success"];
    }

    function checkIfUserExist($user) {
        global $conn;

        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $login = $user["login"];
        $password = $user['password'];
        //$firstName;
        //$lastName;

        $sql = "SELECT * FROM user WHERE `login`='$login' AND `password`=sha1('$password')";

        $result = mysqli_query($conn, $sql);
        $resultCheck = mysqli_num_rows($result);
        
        //$response;

        if($resultCheck > 0 ) {
            $row = mysqli_fetch_assoc($result);
            $fullName = $row["fullName"];
            $parts = explode(" ", $fullName);
            $firstName = $parts[0];
            $lastName = $parts[1];
            $userId = $row["id"];
            $response = ["success" => true, 
                "message" => "Sign in success",
                "firstName" => $firstName,
                "lastName" => $lastName,
                "userId" => $userId];
        } else {
            $response = ["success" => false, "message" => "Sign in fault. No such user"];
        }
        
        return $response;
    }

    function getAll() {
        global $conn;
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $sql = "SELECT * FROM user";
        $result = mysqli_query($conn, $sql);

        $users = array();

        // Loop through results and add to array
        while($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }

        return $users;
    }
}