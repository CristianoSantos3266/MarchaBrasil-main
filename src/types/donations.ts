export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  icon: string;
  benefits: string[];
  badge?: string;
  monthlyBenefits?: string[];
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
    id: 'apoiador-base',
    name: 'Apoiador Base',
    amount: 5,
    currency: 'BRL',
    description: 'Ajude a manter a infraestrutura da plataforma',
    icon: '🛡️',
    badge: 'Protetor',
    benefits: [
      'Apoiar infraestrutura resistente à censura',
      'Habilitar ferramentas de comunicação segura',
      'Manter rede global de servidores'
    ],
    monthlyBenefits: [
      'Badge "Protetor" no perfil',
      'Acesso prioritário a atualizações',
      'Relatórios mensais de transparência'
    ]
  },
  {
    id: 'construtor',
    name: 'Construtor',
    amount: 15,
    currency: 'BRL',
    description: 'Financie o desenvolvimento da plataforma e novas funcionalidades',
    icon: '🔧',
    badge: 'Sustentador',
    benefits: [
      'Todos os benefícios do Apoiador Base',
      'Apoiar desenvolvimento de funcionalidades',
      'Medidas de segurança aprimoradas',
      'Desenvolvimento de aplicativo móvel'
    ],
    monthlyBenefits: [
      'Badge "Sustentador" no perfil',
      'Voto em prioridades de desenvolvimento',
      'Acesso beta a novas funcionalidades',
      'Chat direto com desenvolvedores'
    ]
  },
  {
    id: 'defensor',
    name: 'Defensor',
    amount: 30,
    currency: 'BRL',
    description: 'Campeão dos direitos digitais e liberdade',
    icon: '⚔️',
    badge: 'Guardião da Liberdade',
    benefits: [
      'Todos os benefícios do Construtor',
      'Solicitações de funcionalidades prioritárias',
      'Recursos de segurança avançados',
      'Múltiplos domínios espelho',
      'Integração com rede Tor'
    ],
    monthlyBenefits: [
      'Badge "Guardião da Liberdade" no perfil',
      'Influência direta no roadmap',
      'Acesso a ferramentas avançadas',
      'Reconhecimento público (opcional)',
      'Linha direta de suporte'
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