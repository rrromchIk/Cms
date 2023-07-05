<?php

include_once 'includes/dbh.inc.php';

class StudentsService {
    function validate($firstName, $lastName, $group, $gender, $birthday) {
        $groupList = ['PZ-21', 'PZ-22', 'PZ-23','PZ-24','KN-21'];
        $genderList = ['M', 'F'];

        $nameRegex = "/^[a-zA-Za-яА-Я]{2,}$/";
        $response = [
            "success" => true,
                "message" => ''
        ];
        
        if(!preg_match($nameRegex , $firstName) || !preg_match($nameRegex, $lastName)) {
            $response["message"] = "Name is incorrect!";
            $response["success"] = false;
        }

        if(!in_array($group, $groupList)){
            $response["message"] .= "Group is incorrect!";
            $response["success"] = false;
        }
            
        if(!in_array($gender,$genderList)){
            $response["message"] .= "Gender is incorrect!";
            $response["success"] = false;
        }

        $minYear = 1950;
        $currentYear = date('Y', strtotime($birthday));

        if ($birthday === "" || $currentYear < $minYear) {
                $response["message"] .= "Date birthday must be greater that " . $minYear;
            $response["success"] = false;
        }

        return $response;
    }  

    function getAll() {
        global $conn;
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $sql = "SELECT * FROM student";
        $result = mysqli_query($conn, $sql);

        $students = array();

        // Loop through results and add to array
        while($row = mysqli_fetch_assoc($result)) {
            $students[] = $row;
        }

        return $students;
    }

    function addStudent($student) {
        global $conn;

        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $group = $student["group"];
        $firstName = $student['firstName'];
        $lastName = $student['lastName'];
        $gender = $student['gender'];
        $birthday = $student['birthday'];

        $response = $this->validate($firstName, $lastName, $group, $gender, $birthday);
        if($response["success"] == false) {
            return $response;
        }

        $sql = "INSERT INTO student(`group`, `firstname`, `lastname`, `birthday`, `gender`)
            VALUES ('$group','$firstName','$lastName', '$birthday', '$gender')";

        if(mysqli_query($conn, $sql) == false) {
            return ["success" => false, "message" => "Error while adding to db"];
        }    
        
        return ["success" => true];
    }

    function editStudent($student) {
        global $conn;
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $group = $student["group"];
        $firstName = $student['firstName'];
        $lastName = $student['lastName'];
        $gender = $student['gender'];
        $birthday = $student['birthday'];
        $id = $student['id'];

        $response = $this->validate($firstName, $lastName, $group, $gender, $birthday);
        if($response["success"] == false) {
            return $response;
        }

        $sql = "UPDATE student SET `group` = '$group',
        `firstname` = '$firstName',
        `lastname` = '$lastName',
        `birthday` = '$birthday', 
        `gender` = '$gender' WHERE `id` = $id";
        
        if(mysqli_query($conn, $sql) == false) {
            return ["success" => false, "message" => "Error while editing entity in db"];
        }  
        
        return ["success" => true];
    }

    function deleteStudent($id) {
        global $conn;

        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $sql = "DELETE FROM student WHERE `id` = $id";
        
        if(mysqli_query($conn, $sql) == false) {
            return ["success" => false, "message" => "Error while deleting entity in db"];
        }  
        
        return ["success" => true];
    }
}