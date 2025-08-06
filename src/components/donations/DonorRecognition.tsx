'use client';

import { 
  TrophyIcon,
  FireIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface TopDonor {
  name: string;
  amount: number;
  badge: string;
  isMonthly: boolean;
}

export default function DonorRecognition() {
  const topDonors: TopDonor[] = [];

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Guardião da Liberdade': return 'bg-purple-100 text-purple-800';
      case 'Sustentador': return 'bg-blue-100 text-blue-800';
      case 'Protetor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 flex items-center justify-center gap-2">
        <TrophyIcon className="h-8 w-8 text-yellow-600" />
        Nossos Heróis da Democracia
      </h2>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FireIcon className="h-6 w-6 text-orange-600" />
              Top Apoiadores desta Semana
            </h3>
            <div className="space-y-3">
              {topDonors.length > 0 ? (
                topDonors.slice(0, 3).map((donor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-800' :
                        'bg-orange-300 text-orange-900'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{donor.name}</div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${getBadgeColor(donor.badge)}`}>
                          <ShieldCheckIcon className="h-3 w-3" />
                          {donor.badge}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        R${donor.amount}{donor.isMonthly ? '/mês' : ''}
                      </div>
                      {donor.isMonthly && (
                        <div className="text-xs text-gray-500">Recorrente</div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <TrophyIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Seja o primeiro a apoiar!</p>
                  <p className="text-xs mt-1">Ajude a construir uma plataforma resistente à censura</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
              Estatísticas da Comunidade
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">0</div>
                <div className="text-sm text-blue-700">Total de Apoiadores</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-900">0</div>
                <div className="text-sm text-green-700">Apoiadores Mensais</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-900">R$0</div>
                <div className="text-sm text-purple-700">Doação Média</div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-900">0</div>
                <div className="text-sm text-yellow-700">Guardiões da Liberdade</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 mb-3 flex items-center justify-center gap-2">
            <TrophyIcon className="h-4 w-4 text-yellow-600" />
            Torne-se um apoiador mensal e ganhe badges exclusivos!
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Protetor (R$5/mês)
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Sustentador (R$15/mês)
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              <ShieldCheckIcon className="h-3 w-3 mr-1" />
              Guardião da Liberdade (R$30/mês)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}