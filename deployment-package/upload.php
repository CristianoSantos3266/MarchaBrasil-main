<?php
// Upload and deploy script
if (isset($_FILES['archive'])) {
    $uploadDir = '/tmp/';
    $uploadFile = $uploadDir . 'marchabrasil-complete.tar.gz';
    
    if (move_uploaded_file($_FILES['archive']['tmp_name'], $uploadFile)) {
        echo "<h3>✅ File uploaded successfully!</h3>";
        
        // Deploy commands
        $commands = [
            'cd /var/www',
            'sudo rm -rf marchabrasil',
            'sudo mkdir marchabrasil', 
            'sudo chown -R u537066198:u537066198 marchabrasil',
            'cd marchabrasil',
            'tar -xzf /tmp/marchabrasil-complete.tar.gz',
            'npm install --production --silent',
            'pm2 stop marchabrasil 2>/dev/null || true',
            'pm2 delete marchabrasil 2>/dev/null || true', 
            'pm2 start server.js --name marchabrasil',
            'pm2 save'
        ];
        
        foreach ($commands as $cmd) {
            echo "<pre><strong>Running:</strong> $cmd</pre>";
            $output = shell_exec($cmd . ' 2>&1');
            echo "<pre>$output</pre>";
            echo "<hr>";
        }
        
        echo "<h3>🎉 Platform deployed at: <a href='http://147.93.42.174:3000' target='_blank'>http://147.93.42.174:3000</a></h3>";
    } else {
        echo "<h3>❌ Upload failed!</h3>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Deploy Complete Platform</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .upload-area { border: 2px dashed #ccc; padding: 50px; text-align: center; margin: 20px 0; }
        button { background: #007cba; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 16px; cursor: pointer; }
        button:hover { background: #005a87; }
        pre { background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🚀 Deploy Marcha Brasil Platform</h1>
    <p>Upload the complete platform archive to deploy with all features:</p>
    
    <form method="post" enctype="multipart/form-data">
        <div class="upload-area">
            <h3>📦 Select Platform Archive</h3>
            <input type="file" name="archive" accept=".tar.gz" required>
            <br><br>
            <button type="submit">Deploy Complete Platform</button>
        </div>
    </form>
    
    <h3>✨ Features Included:</h3>
    <ul>
        <li>✅ Mapbox GL JS integration with navigation</li>
        <li>✅ Gamification system with rankings & scores</li>
        <li>✅ Stripe payment processing</li>
        <li>✅ Admin dashboard with analytics</li>
        <li>✅ Event management system</li>
        <li>✅ User authentication & profiles</li>
        <li>✅ All pages & functionality</li>
    </ul>
</body>
</html>