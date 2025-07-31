<?php
// Simple deployment script
if (isset($_POST['deploy'])) {
    $commands = [
        'cd /var/www',
        'rm -rf marchabrasil',
        'mkdir marchabrasil',
        'cd marchabrasil',
        'wget https://github.com/your-repo/releases/download/latest/marchabrasil-complete.tar.gz',
        'tar -xzf marchabrasil-complete.tar.gz',
        'npm install --production',
        'pm2 restart marchabrasil'
    ];
    
    foreach ($commands as $cmd) {
        echo "<pre>Running: $cmd</pre>";
        $output = shell_exec($cmd . ' 2>&1');
        echo "<pre>$output</pre>";
        echo "<hr>";
    }
}
?>

<!DOCTYPE html>
<html>
<head><title>Deploy Platform</title></head>
<body>
    <h2>Deploy Complete Platform</h2>
    <form method="post">
        <button type="submit" name="deploy" onclick="return confirm('This will replace the entire platform. Continue?')">Deploy Now</button>
    </form>
</body>
</html>