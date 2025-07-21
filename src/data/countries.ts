export interface Country {
  code: string;
  name: string;
  coordinates: [number, number];
  zoom: number;
  regions: Region[];
}

export interface Region {
  code: string;
  name: string;
  coordinates: [number, number];
  type: 'state' | 'province' | 'region' | 'territory';
}

export const countries: Country[] = [
  {
    code: 'BR',
    name: 'Brasil',
    coordinates: [-14.2350, -51.9253],
    zoom: 4,
    regions: [
      { code: 'AC', name: 'Acre', coordinates: [-70.55, -8.77], type: 'state' },
      { code: 'AL', name: 'Alagoas', coordinates: [-36.66, -9.71], type: 'state' },
      { code: 'AP', name: 'Amapá', coordinates: [-51.77, 1.41], type: 'state' },
      { code: 'AM', name: 'Amazonas', coordinates: [-63.90, -3.07], type: 'state' },
      { code: 'BA', name: 'Bahia', coordinates: [-41.58, -12.96], type: 'state' },
      { code: 'CE', name: 'Ceará', coordinates: [-39.28, -5.20], type: 'state' },
      { code: 'DF', name: 'Distrito Federal', coordinates: [-47.86, -15.83], type: 'state' },
      { code: 'ES', name: 'Espírito Santo', coordinates: [-40.30, -19.19], type: 'state' },
      { code: 'GO', name: 'Goiás', coordinates: [-49.31, -16.64], type: 'state' },
      { code: 'MA', name: 'Maranhão', coordinates: [-45.44, -4.90], type: 'state' },
      { code: 'MT', name: 'Mato Grosso', coordinates: [-56.10, -12.64], type: 'state' },
      { code: 'MS', name: 'Mato Grosso do Sul', coordinates: [-54.25, -20.51], type: 'state' },
      { code: 'MG', name: 'Minas Gerais', coordinates: [-45.24, -18.10], type: 'state' },
      { code: 'PA', name: 'Pará', coordinates: [-52.22, -5.53], type: 'state' },
      { code: 'PB', name: 'Paraíba', coordinates: [-36.72, -7.06], type: 'state' },
      { code: 'PR', name: 'Paraná', coordinates: [-52.03, -24.89], type: 'state' },
      { code: 'PE', name: 'Pernambuco', coordinates: [-37.07, -8.28], type: 'state' },
      { code: 'PI', name: 'Piauí', coordinates: [-43.68, -8.28], type: 'state' },
      { code: 'RJ', name: 'Rio de Janeiro', coordinates: [-43.68, -22.84], type: 'state' },
      { code: 'RN', name: 'Rio Grande do Norte', coordinates: [-36.95, -5.22], type: 'state' },
      { code: 'RS', name: 'Rio Grande do Sul', coordinates: [-53.50, -30.17], type: 'state' },
      { code: 'RO', name: 'Rondônia', coordinates: [-63.34, -9.92], type: 'state' },
      { code: 'RR', name: 'Roraima', coordinates: [-61.33, 1.89], type: 'state' },
      { code: 'SC', name: 'Santa Catarina', coordinates: [-49.44, -27.33], type: 'state' },
      { code: 'SP', name: 'São Paulo', coordinates: [-46.44, -23.68], type: 'state' },
      { code: 'SE', name: 'Sergipe', coordinates: [-37.57, -10.30], type: 'state' },
      { code: 'TO', name: 'Tocantins', coordinates: [-47.63, -10.17], type: 'state' }
    ]
  },
  {
    code: 'AR',
    name: 'Argentina',
    coordinates: [-38.4161, -63.6167],
    zoom: 4,
    regions: [
      { code: 'C', name: 'Ciudad de Buenos Aires', coordinates: [-58.3816, -34.6037], type: 'province' },
      { code: 'B', name: 'Buenos Aires', coordinates: [-59.0, -36.0], type: 'province' },
      { code: 'K', name: 'Catamarca', coordinates: [-66.0, -27.0], type: 'province' },
      { code: 'H', name: 'Chaco', coordinates: [-60.0, -26.0], type: 'province' },
      { code: 'U', name: 'Chubut', coordinates: [-67.0, -44.0], type: 'province' },
      { code: 'X', name: 'Córdoba', coordinates: [-64.1810, -31.4201], type: 'province' },
      { code: 'W', name: 'Corrientes', coordinates: [-58.0, -28.0], type: 'province' },
      { code: 'E', name: 'Entre Ríos', coordinates: [-59.0, -32.0], type: 'province' },
      { code: 'P', name: 'Formosa', coordinates: [-59.0, -24.0], type: 'province' },
      { code: 'Y', name: 'Jujuy', coordinates: [-65.0, -23.0], type: 'province' },
      { code: 'L', name: 'La Pampa', coordinates: [-65.0, -37.0], type: 'province' },
      { code: 'F', name: 'La Rioja', coordinates: [-67.0, -29.0], type: 'province' },
      { code: 'M', name: 'Mendoza', coordinates: [-68.8431, -32.8895], type: 'province' },
      { code: 'N', name: 'Misiones', coordinates: [-55.0, -26.0], type: 'province' },
      { code: 'Q', name: 'Neuquén', coordinates: [-68.0, -38.0], type: 'province' },
      { code: 'R', name: 'Río Negro', coordinates: [-67.0, -41.0], type: 'province' },
      { code: 'A', name: 'Salta', coordinates: [-65.0, -25.0], type: 'province' },
      { code: 'J', name: 'San Juan', coordinates: [-68.0, -31.0], type: 'province' },
      { code: 'D', name: 'San Luis', coordinates: [-66.0, -33.0], type: 'province' },
      { code: 'Z', name: 'Santa Cruz', coordinates: [-70.0, -50.0], type: 'province' },
      { code: 'S', name: 'Santa Fe', coordinates: [-61.0, -30.0], type: 'province' },
      { code: 'G', name: 'Santiago del Estero', coordinates: [-63.0, -27.0], type: 'province' },
      { code: 'V', name: 'Tierra del Fuego', coordinates: [-67.0, -54.0], type: 'province' },
      { code: 'T', name: 'Tucumán', coordinates: [-65.0, -26.0], type: 'province' }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    coordinates: [39.8283, -98.5795],
    zoom: 4,
    regions: [
      { code: 'AL', name: 'Alabama', coordinates: [-86.79113, 32.377716], type: 'state' },
      { code: 'AK', name: 'Alaska', coordinates: [-152.404419, 61.370716], type: 'state' },
      { code: 'AZ', name: 'Arizona', coordinates: [-111.431221, 33.729759], type: 'state' },
      { code: 'AR', name: 'Arkansas', coordinates: [-92.373123, 34.969704], type: 'state' },
      { code: 'CA', name: 'California', coordinates: [-119.681564, 36.116203], type: 'state' },
      { code: 'CO', name: 'Colorado', coordinates: [-105.311104, 39.059811], type: 'state' },
      { code: 'CT', name: 'Connecticut', coordinates: [-72.755371, 41.767], type: 'state' },
      { code: 'DC', name: 'District of Columbia', coordinates: [-77.026817, 38.897438], type: 'territory' },
      { code: 'DE', name: 'Delaware', coordinates: [-75.507141, 39.318523], type: 'state' },
      { code: 'FL', name: 'Florida', coordinates: [-81.686783, 27.771659], type: 'state' },
      { code: 'GA', name: 'Georgia', coordinates: [-83.643074, 33.040619], type: 'state' },
      { code: 'HI', name: 'Hawaii', coordinates: [-157.826182, 21.30895], type: 'state' },
      { code: 'ID', name: 'Idaho', coordinates: [-114.478828, 44.240459], type: 'state' },
      { code: 'IL', name: 'Illinois', coordinates: [-88.986137, 40.349457], type: 'state' },
      { code: 'IN', name: 'Indiana', coordinates: [-86.147685, 39.790942], type: 'state' },
      { code: 'IA', name: 'Iowa', coordinates: [-93.620866, 42.590794], type: 'state' },
      { code: 'KS', name: 'Kansas', coordinates: [-96.726486, 38.572954], type: 'state' },
      { code: 'KY', name: 'Kentucky', coordinates: [-84.670067, 37.668140], type: 'state' },
      { code: 'LA', name: 'Louisiana', coordinates: [-91.867805, 30.391830], type: 'state' },
      { code: 'ME', name: 'Maine', coordinates: [-69.765261, 44.323535], type: 'state' },
      { code: 'MD', name: 'Maryland', coordinates: [-76.501157, 39.045755], type: 'state' },
      { code: 'MA', name: 'Massachusetts', coordinates: [-71.530106, 42.230171], type: 'state' },
      { code: 'MI', name: 'Michigan', coordinates: [-84.536095, 43.326618], type: 'state' },
      { code: 'MN', name: 'Minnesota', coordinates: [-93.094306, 45.677471], type: 'state' },
      { code: 'MS', name: 'Mississippi', coordinates: [-89.678696, 32.741646], type: 'state' },
      { code: 'MO', name: 'Missouri', coordinates: [-92.189283, 38.572954], type: 'state' },
      { code: 'MT', name: 'Montana', coordinates: [-110.454353, 46.965260], type: 'state' },
      { code: 'NE', name: 'Nebraska', coordinates: [-99.901813, 41.492537], type: 'state' },
      { code: 'NV', name: 'Nevada', coordinates: [-117.055374, 38.313515], type: 'state' },
      { code: 'NH', name: 'New Hampshire', coordinates: [-71.563896, 43.452492], type: 'state' },
      { code: 'NJ', name: 'New Jersey', coordinates: [-74.521011, 40.298904], type: 'state' },
      { code: 'NM', name: 'New Mexico', coordinates: [-106.248482, 34.307144], type: 'state' },
      { code: 'NY', name: 'New York', coordinates: [-74.948051, 42.165726], type: 'state' },
      { code: 'NC', name: 'North Carolina', coordinates: [-79.806419, 35.630066], type: 'state' },
      { code: 'ND', name: 'North Dakota', coordinates: [-99.784012, 47.528912], type: 'state' },
      { code: 'OH', name: 'Ohio', coordinates: [-82.764915, 40.269789], type: 'state' },
      { code: 'OK', name: 'Oklahoma', coordinates: [-96.928917, 35.565342], type: 'state' },
      { code: 'OR', name: 'Oregon', coordinates: [-122.070938, 44.931109], type: 'state' },
      { code: 'PA', name: 'Pennsylvania', coordinates: [-77.209755, 40.269789], type: 'state' },
      { code: 'RI', name: 'Rhode Island', coordinates: [-71.51178, 41.82355], type: 'state' },
      { code: 'SC', name: 'South Carolina', coordinates: [-80.945007, 33.856892], type: 'state' },
      { code: 'SD', name: 'South Dakota', coordinates: [-99.976726, 44.2619], type: 'state' },
      { code: 'TN', name: 'Tennessee', coordinates: [-86.692345, 35.517491], type: 'state' },
      { code: 'TX', name: 'Texas', coordinates: [-97.563461, 31.054487], type: 'state' },
      { code: 'UT', name: 'Utah', coordinates: [-111.892622, 40.269789], type: 'state' },
      { code: 'VT', name: 'Vermont', coordinates: [-72.710686, 44.0659], type: 'state' },
      { code: 'VA', name: 'Virginia', coordinates: [-78.169968, 37.768814], type: 'state' },
      { code: 'WA', name: 'Washington', coordinates: [-121.1187, 47.042418], type: 'state' },
      { code: 'WV', name: 'West Virginia', coordinates: [-80.954570, 38.468319], type: 'state' },
      { code: 'WI', name: 'Wisconsin', coordinates: [-89.616508, 44.268543], type: 'state' },
      { code: 'WY', name: 'Wyoming', coordinates: [-107.30249, 42.750941], type: 'state' }
    ]
  },
  {
    code: 'FR',
    name: 'France',
    coordinates: [46.603354, 1.888334],
    zoom: 6,
    regions: [
      { code: 'IDF', name: 'Île-de-France', coordinates: [48.8566, 2.3522], type: 'region' },
      { code: 'ARA', name: 'Auvergne-Rhône-Alpes', coordinates: [45.7640, 4.8357], type: 'region' },
      { code: 'HDF', name: 'Hauts-de-France', coordinates: [50.4801, 2.7930], type: 'region' },
      { code: 'PAC', name: 'Provence-Alpes-Côte d\'Azur', coordinates: [43.9352, 6.0679], type: 'region' },
      { code: 'OCC', name: 'Occitanie', coordinates: [43.6047, 1.4442], type: 'region' },
      { code: 'NAQ', name: 'Nouvelle-Aquitaine', coordinates: [45.8336, -0.5680], type: 'region' },
      { code: 'GES', name: 'Grand Est', coordinates: [48.6999, 6.1878], type: 'region' },
      { code: 'BFC', name: 'Bourgogne-Franche-Comté', coordinates: [47.2800, 4.9900], type: 'region' },
      { code: 'NOR', name: 'Normandie', coordinates: [49.1829, -0.3707], type: 'region' },
      { code: 'CVL', name: 'Centre-Val de Loire', coordinates: [47.7516, 1.6751], type: 'region' },
      { code: 'PDL', name: 'Pays de la Loire', coordinates: [47.4632, -0.7516], type: 'region' },
      { code: 'BRE', name: 'Bretagne', coordinates: [48.2020, -2.9326], type: 'region' },
      { code: 'COR', name: 'Corse', coordinates: [42.0396, 9.0129], type: 'region' }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    coordinates: [56.1304, -106.3468],
    zoom: 3,
    regions: [
      { code: 'AB', name: 'Alberta', coordinates: [53.9333, -116.5765], type: 'province' },
      { code: 'BC', name: 'British Columbia', coordinates: [53.7267, -127.6476], type: 'province' },
      { code: 'MB', name: 'Manitoba', coordinates: [53.7609, -98.8139], type: 'province' },
      { code: 'NB', name: 'New Brunswick', coordinates: [46.5653, -66.4619], type: 'province' },
      { code: 'NL', name: 'Newfoundland and Labrador', coordinates: [53.1355, -57.6604], type: 'province' },
      { code: 'NT', name: 'Northwest Territories', coordinates: [61.2181, -113.5034], type: 'territory' },
      { code: 'NS', name: 'Nova Scotia', coordinates: [44.6820, -63.7443], type: 'province' },
      { code: 'NU', name: 'Nunavut', coordinates: [70.2998, -83.1076], type: 'territory' },
      { code: 'ON', name: 'Ontario', coordinates: [51.2538, -85.3232], type: 'province' },
      { code: 'PE', name: 'Prince Edward Island', coordinates: [46.5107, -63.4168], type: 'province' },
      { code: 'QC', name: 'Quebec', coordinates: [53.9214, -72.7665], type: 'province' },
      { code: 'SK', name: 'Saskatchewan', coordinates: [52.9399, -106.4509], type: 'province' },
      { code: 'YT', name: 'Yukon', coordinates: [64.0685, -139.0725], type: 'territory' }
    ]
  },
  {
    code: 'JP',
    name: 'Japão',
    coordinates: [36.2048, 138.2529],
    zoom: 5,
    regions: [
      { code: 'TOK', name: 'Tóquio', coordinates: [35.6762, 139.6503], type: 'region' },
      { code: 'OSA', name: 'Osaka', coordinates: [34.6937, 135.5023], type: 'region' },
      { code: 'KAN', name: 'Kanagawa', coordinates: [35.4478, 139.6425], type: 'region' },
      { code: 'AIC', name: 'Aichi', coordinates: [35.1802, 136.9066], type: 'region' },
      { code: 'SAI', name: 'Saitama', coordinates: [35.8617, 139.6455], type: 'region' },
      { code: 'CHI', name: 'Chiba', coordinates: [35.6074, 140.1065], type: 'region' },
      { code: 'GUN', name: 'Gunma', coordinates: [36.3914, 139.0608], type: 'region' },
      { code: 'IBA', name: 'Ibaraki', coordinates: [36.3418, 140.4468], type: 'region' }
    ]
  },
  {
    code: 'PT',
    name: 'Portugal',
    coordinates: [39.3999, -8.2245],
    zoom: 6,
    regions: [
      { code: 'LIS', name: 'Lisboa', coordinates: [38.7223, -9.1393], type: 'region' },
      { code: 'POR', name: 'Porto', coordinates: [41.1579, -8.6291], type: 'region' },
      { code: 'SET', name: 'Setúbal', coordinates: [38.5244, -8.8882], type: 'region' },
      { code: 'BRA', name: 'Braga', coordinates: [41.5518, -8.4229], type: 'region' },
      { code: 'AVE', name: 'Aveiro', coordinates: [40.6443, -8.6455], type: 'region' },
      { code: 'FAR', name: 'Faro', coordinates: [37.0194, -7.9322], type: 'region' },
      { code: 'COI', name: 'Coimbra', coordinates: [40.2033, -8.4103], type: 'region' }
    ]
  },
  {
    code: 'ES',
    name: 'Espanha',
    coordinates: [40.4637, -3.7492],
    zoom: 6,
    regions: [
      { code: 'MAD', name: 'Madrid', coordinates: [40.4168, -3.7038], type: 'region' },
      { code: 'BCN', name: 'Barcelona', coordinates: [41.3851, 2.1734], type: 'region' },
      { code: 'VAL', name: 'Valencia', coordinates: [39.4699, -0.3763], type: 'region' },
      { code: 'SEV', name: 'Sevilla', coordinates: [37.3891, -5.9845], type: 'region' },
      { code: 'BIL', name: 'Bilbao', coordinates: [43.2627, -2.9253], type: 'region' },
      { code: 'MAL', name: 'Málaga', coordinates: [36.7213, -4.4214], type: 'region' },
      { code: 'LAS', name: 'Las Palmas', coordinates: [28.1248, -15.4300], type: 'region' }
    ]
  },
  {
    code: 'IT',
    name: 'Itália',
    coordinates: [41.8719, 12.5674],
    zoom: 6,
    regions: [
      { code: 'ROM', name: 'Roma', coordinates: [41.9028, 12.4964], type: 'region' },
      { code: 'MIL', name: 'Milano', coordinates: [45.4642, 9.1900], type: 'region' },
      { code: 'NAP', name: 'Napoli', coordinates: [40.8518, 14.2681], type: 'region' },
      { code: 'FLO', name: 'Firenze', coordinates: [43.7696, 11.2558], type: 'region' },
      { code: 'VEN', name: 'Venezia', coordinates: [45.4408, 12.3155], type: 'region' },
      { code: 'TOR', name: 'Torino', coordinates: [45.0703, 7.6869], type: 'region' },
      { code: 'BOL', name: 'Bologna', coordinates: [44.4949, 11.3426], type: 'region' }
    ]
  },
  {
    code: 'GB',
    name: 'Reino Unido',
    coordinates: [55.3781, -3.4360],
    zoom: 6,
    regions: [
      { code: 'LON', name: 'Londres', coordinates: [51.5074, -0.1278], type: 'region' },
      { code: 'MAN', name: 'Manchester', coordinates: [53.4808, -2.2426], type: 'region' },
      { code: 'BIR', name: 'Birmingham', coordinates: [52.4862, -1.8904], type: 'region' },
      { code: 'LIV', name: 'Liverpool', coordinates: [53.4084, -2.9916], type: 'region' },
      { code: 'EDI', name: 'Edinburgh', coordinates: [55.9533, -3.1883], type: 'region' },
      { code: 'GLA', name: 'Glasgow', coordinates: [55.8642, -4.2518], type: 'region' },
      { code: 'BRI', name: 'Bristol', coordinates: [51.4545, -2.5879], type: 'region' }
    ]
  },
  {
    code: 'DE',
    name: 'Alemanha',
    coordinates: [51.1657, 10.4515],
    zoom: 6,
    regions: [
      { code: 'BER', name: 'Berlin', coordinates: [52.5200, 13.4050], type: 'region' },
      { code: 'MUN', name: 'München', coordinates: [48.1351, 11.5820], type: 'region' },
      { code: 'HAM', name: 'Hamburg', coordinates: [53.5511, 9.9937], type: 'region' },
      { code: 'FRA', name: 'Frankfurt', coordinates: [50.1109, 8.6821], type: 'region' },
      { code: 'COL', name: 'Köln', coordinates: [50.9375, 6.9603], type: 'region' },
      { code: 'STU', name: 'Stuttgart', coordinates: [48.7758, 9.1829], type: 'region' },
      { code: 'DUS', name: 'Düsseldorf', coordinates: [51.2277, 6.7735], type: 'region' }
    ]
  },
  {
    code: 'AU',
    name: 'Austrália',
    coordinates: [-25.2744, 133.7751],
    zoom: 4,
    regions: [
      { code: 'NSW', name: 'New South Wales', coordinates: [-33.8688, 151.2093], type: 'state' },
      { code: 'VIC', name: 'Victoria', coordinates: [-37.8136, 144.9631], type: 'state' },
      { code: 'QLD', name: 'Queensland', coordinates: [-27.4698, 153.0251], type: 'state' },
      { code: 'WA', name: 'Western Australia', coordinates: [-31.9505, 115.8605], type: 'state' },
      { code: 'SA', name: 'South Australia', coordinates: [-34.9285, 138.6007], type: 'state' },
      { code: 'TAS', name: 'Tasmania', coordinates: [-42.8821, 147.3272], type: 'state' },
      { code: 'ACT', name: 'Australian Capital Territory', coordinates: [-35.2809, 149.1300], type: 'territory' },
      { code: 'NT', name: 'Northern Territory', coordinates: [-12.4634, 130.8456], type: 'territory' }
    ]
  },
  {
    code: 'PY',
    name: 'Paraguai',
    coordinates: [-23.4425, -58.4438],
    zoom: 6,
    regions: [
      { code: 'ASU', name: 'Asunción', coordinates: [-25.2637, -57.5759], type: 'region' },
      { code: 'CDE', name: 'Ciudad del Este', coordinates: [-25.5095, -54.6142], type: 'region' },
      { code: 'PJC', name: 'Pedro Juan Caballero', coordinates: [-22.5486, -55.7364], type: 'region' },
      { code: 'ENC', name: 'Encarnación', coordinates: [-27.3378, -55.8664], type: 'region' },
      { code: 'COR', name: 'Coronel Oviedo', coordinates: [-25.4458, -56.4503], type: 'region' }
    ]
  },
  {
    code: 'UY',
    name: 'Uruguai',
    coordinates: [-32.5228, -55.7658],
    zoom: 7,
    regions: [
      { code: 'MON', name: 'Montevideo', coordinates: [-34.9011, -56.1645], type: 'region' },
      { code: 'CAN', name: 'Canelones', coordinates: [-34.5278, -56.2778], type: 'region' },
      { code: 'MAL', name: 'Maldonado', coordinates: [-34.9000, -54.9500], type: 'region' },
      { code: 'COL', name: 'Colonia', coordinates: [-34.4633, -57.8400], type: 'region' },
      { code: 'SAL', name: 'Salto', coordinates: [-31.3833, -57.9667], type: 'region' }
    ]
  }
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getRegionByCode = (countryCode: string, regionCode: string): Region | undefined => {
  const country = getCountryByCode(countryCode);
  return country?.regions.find(region => region.code === regionCode);
};