'use client';

import { useState } from 'react';
import { ProtestType } from '@/types';
import { countries } from '@/data/countries';

interface EmailSubscriptionFormProps {
  onSubmit: (email: string, selectedCountries: string[], selectedTypes: ProtestType[]) => void;
}

const protestTypeOptions = [
  { value: 'marcha', label: 'Marchas' },
  { value: 'motociata', label: 'Motociatas' },
  { value: 'carreata', label: 'Carreatas' },
  { value: 'caminhoneiros', label: 'Caminhoneiros' },
  { value: 'assembleia', label: 'Assembleias' },
  { value: 'manifestacao', label: 'Manifestações' },
  { value: 'outro', label: 'Outros' }
];

export default function EmailSubscriptionForm({ onSubmit }: EmailSubscriptionFormProps) {
  const [email, setEmail] = useState('');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<ProtestType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCountryChange = (countryCode: string, checked: boolean) => {
    if (checked) {
      setSelectedCountries(prev => [...prev, countryCode]);
    } else {
      setSelectedCountries(prev => prev.filter(code => code !== countryCode));
    }
  };

  const handleTypeChange = (type: ProtestType, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, type]);
    } else {
      setSelectedTypes(prev => prev.filter(t => t !== type));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(email, selectedCountries, selectedTypes);
      setEmail('');
      setSelectedCountries([]);
      setSelectedTypes([]);
      alert('Inscrição realizada com sucesso! Você receberá alertas sobre os protestos selecionados.');
    } catch (error) {
      alert('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectAllCountries = () => {
    setSelectedCountries(countries.map(country => country.code));
  };

  const clearAllCountries = () => {
    setSelectedCountries([]);
  };

  const selectAllTypes = () => {
    setSelectedTypes(protestTypeOptions.map(option => option.value as ProtestType));
  };

  const clearAllTypes = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📬 Receber Alertas por Email
      </h2>
      <p className="text-gray-600 mb-6">
        Inscreva-se para receber notificações sobre novos protestos em suas regiões de interesse.
        Suas informações são mantidas em anonimato.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="seu.email@exemplo.com"
          />
        </div>

        {/* Countries selection */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Países de Interesse *
            </label>
            <div className="space-x-2">
              <button
                type="button"
                onClick={selectAllCountries}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Selecionar Todos
              </button>
              <button
                type="button"
                onClick={clearAllCountries}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Limpar
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
            {countries.map((country) => (
              <label key={country.code} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCountries.includes(country.code)}
                  onChange={(e) => handleCountryChange(country.code, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="truncate" title={country.name}>
                  {country.name}
                </span>
              </label>
            ))}
          </div>
          {selectedCountries.length === 0 && (
            <p className="text-red-500 text-xs mt-1">Selecione pelo menos um país</p>
          )}
        </div>

        {/* Protest types selection */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Tipos de Protestos *
            </label>
            <div className="space-x-2">
              <button
                type="button"
                onClick={selectAllTypes}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Selecionar Todos
              </button>
              <button
                type="button"
                onClick={clearAllTypes}
                className="text-xs text-gray-600 hover:text-gray-800"
              >
                Limpar
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {protestTypeOptions.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(option.value as ProtestType)}
                  onChange={(e) => handleTypeChange(option.value as ProtestType, e.target.checked)}
                  className="w-4 h-4"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          {selectedTypes.length === 0 && (
            <p className="text-red-500 text-xs mt-1">Selecione pelo menos um tipo de protesto</p>
          )}
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 text-sm mb-2">🔒 Privacidade</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Seu email é armazenado de forma anônima</li>
            <li>• Não coletamos nem armazenamos dados pessoais</li>
            <li>• Você pode cancelar a inscrição a qualquer momento</li>
            <li>• Não compartilhamos seu email com terceiros</li>
          </ul>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || selectedCountries.length === 0 || selectedTypes.length === 0}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isSubmitting ? 'Inscrevendo...' : 'Inscrever-se nos Alertas'}
        </button>
      </form>
    </div>
  );
}