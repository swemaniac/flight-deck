<?php
    if ($_REQUEST['action'] == 'routes') {
        // select f.departure_icao as dep_icao, dep.name as dep_name, dep.lat as dep_lat, dep.lng as dep_lng, f.destination_icao as dest_icao, dest.name as dest_name, dest.lat as dest_lat, dest.lng as dest_lng from flights f inner join airports dep on dep.icao = f.departure_icao inner join airports dest on dest.icao = f.destination_icao where f.msn != '' and f.departure_icao != f.destination_icao group by f.departure_icao, f.destination_icao

        $db = connect();

        $stmt = $db->query("select f.departure_icao as dep_icao, dep.name as dep_name, dep.lat as dep_lat, dep.lng as dep_lng, f.destination_icao as dest_icao, dest.name as dest_name, dest.lat as dest_lat, dest.lng as dest_lng from flights f inner join airports dep on dep.icao = f.departure_icao inner join airports dest on dest.icao = f.destination_icao where f.msn != '' and f.departure_icao != f.destination_icao group by f.departure_icao, f.destination_icao");
        $results = null;

        try {
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die(json_encode((object)array(
                'error' => $e->getMessage()
            )));
        }

        die(json_encode($results));
    }

    function connect() {
        return new PDO('mysql:host=localhost;dbname=flightdeck;charset=utf8mb4', 'root', '', array(PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    }
?>