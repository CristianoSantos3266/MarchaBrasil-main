import { BrazilState } from '@/types';

export const brazilStates: BrazilState[] = [
  { code: 'AC', name: 'Acre', coordinates: [-70.55, -8.77] },
  { code: 'AL', name: 'Alagoas', coordinates: [-36.66, -9.71] },
  { code: 'AP', name: 'Amapá', coordinates: [-51.77, 1.41] },
  { code: 'AM', name: 'Amazonas', coordinates: [-63.90, -3.07] },
  { code: 'BA', name: 'Bahia', coordinates: [-41.58, -12.96] },
  { code: 'CE', name: 'Ceará', coordinates: [-39.28, -5.20] },
  { code: 'DF', name: 'Distrito Federal', coordinates: [-47.86, -15.83] },
  { code: 'ES', name: 'Espírito Santo', coordinates: [-40.30, -19.19] },
  { code: 'GO', name: 'Goiás', coordinates: [-49.31, -16.64] },
  { code: 'MA', name: 'Maranhão', coordinates: [-45.44, -4.90] },
  { code: 'MT', name: 'Mato Grosso', coordinates: [-56.10, -12.64] },
  { code: 'MS', name: 'Mato Grosso do Sul', coordinates: [-54.25, -20.51] },
  { code: 'MG', name: 'Minas Gerais', coordinates: [-45.24, -18.10] },
  { code: 'PA', name: 'Pará', coordinates: [-52.22, -5.53] },
  { code: 'PB', name: 'Paraíba', coordinates: [-36.72, -7.06] },
  { code: 'PR', name: 'Paraná', coordinates: [-52.03, -24.89] },
  { code: 'PE', name: 'Pernambuco', coordinates: [-37.07, -8.28] },
  { code: 'PI', name: 'Piauí', coordinates: [-43.68, -8.28] },
  { code: 'RJ', name: 'Rio de Janeiro', coordinates: [-43.68, -22.84] },
  { code: 'RN', name: 'Rio Grande do Norte', coordinates: [-36.95, -5.22] },
  { code: 'RS', name: 'Rio Grande do Sul', coordinates: [-53.50, -30.17] },
  { code: 'RO', name: 'Rondônia', coordinates: [-63.34, -9.92] },
  { code: 'RR', name: 'Roraima', coordinates: [-61.33, 1.89] },
  { code: 'SC', name: 'Santa Catarina', coordinates: [-49.44, -27.33] },
  { code: 'SP', name: 'São Paulo', coordinates: [-46.44, -23.68] },
  { code: 'SE', name: 'Sergipe', coordinates: [-37.57, -10.30] },
  { code: 'TO', name: 'Tocantins', coordinates: [-47.63, -10.17] }
];

export const getStateByCode = (code: string): BrazilState | undefined => {
  return brazilStates.find(state => state.code === code);
};