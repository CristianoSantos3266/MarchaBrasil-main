export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  currency: string;
  lastUpdated: string;
}

export interface CryptoAddress {
  currency: string;
  name: string;
  address: string;
  network?: string;
  icon: string;
}

export const DONATION_TIERS: DonationTier[] = [
  {
    id: 'supporter',
    name: 'Base Supporter',
    amount: 10,
    currency: 'USD',
    description: 'Help maintain the platform infrastructure',
    icon: '🛡️',
    benefits: [
      'Support censorship-resistant infrastructure',
      'Enable secure communication tools',
      'Maintain global server network'
    ]
  },
  {
    id: 'builder',
    name: 'Builder',
    amount: 50,
    currency: 'USD',
    description: 'Fund platform development and new features',
    icon: '🔧',
    benefits: [
      'All Base Supporter benefits',
      'Support feature development',
      'Enhanced security measures',
      'Mobile app development'
    ]
  },
  {
    id: 'defender',
    name: 'Defender',
    amount: 200,
    currency: 'USD',
    description: 'Champion of digital rights and freedom',
    icon: '⚔️',
    benefits: [
      'All Builder benefits',
      'Priority feature requests',
      'Advanced security features',
      'Multiple mirror domains',
      'Tor network integration'
    ]
  }
];

export const CRYPTO_ADDRESSES: CryptoAddress[] = [
  {
    currency: 'BTC',
    name: 'Bitcoin',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    icon: '₿'
  },
  {
    currency: 'USDT',
    name: 'Tether (TRC20)',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    network: 'TRON',
    icon: '₮'
  },
  {
    currency: 'XMR',
    name: 'Monero',
    address: '4AdUndXHHZ6cfufTMvppY6JwXNouMBzSkbLYfpAV5Usx3skxNgYeYTRj5UzqtReoS44qo9mtmXCqY45DJ852K5Jv2684Rge',
    icon: 'ɱ'
  },
  {
    currency: 'LTC',
    name: 'Litecoin',
    address: 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    icon: 'Ł'
  }
];