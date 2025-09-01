export const CRYPTO_ADDRESSES = {
  ETH: '0x2C6C7f0FB3c318B90f7DA4c9797d514440bd0a26',
  BTC: 'bc1qvg36958gg989k0grggeudg76ndalwtakt7rsqs',
  LTC: 'ltc1qeyhg8hgen44xxsp4e65lau0zhs20ec2h72kpq3',
  DOGE: 'DSmH53iNovEv4KLG3xHeVDzK4S7a9UPN3i'
};

export type CryptoMethod = {
  key: string;
  label: string;
  note: string;
  addr: string;
  qrPath: string;
};

export const CRYPTO_METHODS: CryptoMethod[] = [
  { 
    key: 'eth', 
    label: 'Ethereum (ETH)', 
    note: 'Rede Ethereum', 
    addr: CRYPTO_ADDRESSES.ETH,
    qrPath: '/qr/eth.png'
  },
  { 
    key: 'btc', 
    label: 'Bitcoin (BTC)', 
    note: 'Rede Bitcoin', 
    addr: CRYPTO_ADDRESSES.BTC,
    qrPath: '/qr/btc.png'
  },
  { 
    key: 'ltc', 
    label: 'Litecoin (LTC)', 
    note: 'Rede Litecoin', 
    addr: CRYPTO_ADDRESSES.LTC,
    qrPath: '/qr/ltc.png'
  },
  { 
    key: 'doge', 
    label: 'Dogecoin (DOGE)', 
    note: 'Rede Dogecoin', 
    addr: CRYPTO_ADDRESSES.DOGE,
    qrPath: '/qr/doge.png'
  }
];