// scripts/generate-qr.js
const fs = require('fs');
const path = require('path');
const QR = require('qrcode');

// TODO: paste YOUR actual addresses from src/config/crypto.ts
const ADDR = {
  ETH: '0x2C6C7f0FB3c318B90f7DA4c9797d514440bd0a26',
  BTC: 'bc1qvg36 958gg9889k0grggeudg76ndalwtakt7rsqs',   // <-- replace with your real BTC
  LTC: 'ltc1qeyhg8hgen44xxsp4e65lau0zhs20ec2h72kpq3',   // <-- replace with your real LTC
  DOGE:'DSmH53iNovEv4KLG3xHeVDZK4S7a9UPN3i',            // <-- replace with your real DOGE
};

(async () => {
  const outDir = path.join(__dirname, '..', 'public', 'qr');
  fs.mkdirSync(outDir, { recursive: true });

  for (const [key, val] of Object.entries(ADDR)) {
    const dataUrl = await QR.toDataURL(val, {
      margin: 1,
      width: 512,
      errorCorrectionLevel: 'M',
    });
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    const outPath = path.join(outDir, key.toLowerCase() + '.png');
    fs.writeFileSync(outPath, base64, 'base64');
    console.log('wrote', outPath);
  }
  console.log('✅ All QR PNGs written to /public/qr');
})();

