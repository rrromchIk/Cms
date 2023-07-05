<?php

//include_once 'includes/dbh.inc.php';
include_once 'StudentsService.php';
include_once 'UsersService.php';

//for other domains getting this resource
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Credentials: true");

$studentsService = new StudentsService();
$usersService = new UsersService();

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);
$routes = [];

route('/students/add', function () {
    global $studentsService, $data;
    echo json_encode($studentsService->addStudent($data));
});

route('/students/edit', function () {
    global $studentsService, $data;
    echo json_encode($studentsService->editStudent($data));
});

route('/students/delete', function () {
    global $studentsService, $data;
    echo json_encode($studentsService->deleteStudent($data["id"]));
});

route('/students', function () {
    global $studentsService;
    echo json_encode($studentsService->getAll());
});

route('/users/add', function () {
    global $usersService, $data;
    echo json_encode($usersService->addUser($data));
});

route('/users', function () {
    global $usersService, $data;
    echo json_encode($usersService->checkIfUserExist($data));
});

route('/users/all', function () {
    global $usersService, $data;
    echo json_encode($usersService->getAll());
});

function route(string $path, callable $callback) {
  global $routes;
  $routes[$path] = $callback;
}

run();

function run() {
    global $routes;
    $uri = $_SERVER['REQUEST_URI'];

    $found = false;
    foreach ($routes as $path => $callback) {
      if (!str_ends_with($uri, $path)) continue;

      $found = true;
      $callback();
    }
}
?>