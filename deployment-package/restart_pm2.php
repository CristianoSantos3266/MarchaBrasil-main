<?php
// Simple script to restart PM2
if (isset($_GET['restart'])) {
    $output = shell_exec('cd /var/www/marchabrasil && pm2 restart marchabrasil 2>&1');
    echo "<pre>$output</pre>";
}

if (isset($_GET['logs'])) {
    $output = shell_exec('cd /var/www/marchabrasil && pm2 logs marchabrasil --lines 20 2>&1');
    echo "<pre>$output</pre>";
}

if (isset($_GET['status'])) {
    $output = shell_exec('pm2 status 2>&1');
    echo "<pre>$output</pre>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>PM2 Control</title>
</head>
<body>
    <h2>PM2 Control Panel</h2>
    <a href="?restart=1">Restart Platform</a> | 
    <a href="?logs=1">View Logs</a> | 
    <a href="?status=1">PM2 Status</a>
</body>
</html>