'use client'

import Navigation from '@/components/ui/Navigation'
import { 
  HandRaisedIcon,
  CheckCircleIcon,
  XCircleIcon,
  SpeakerWaveIcon,
  ExclamationTriangleIcon,
  CameraIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function ComoAgirPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <HandRaisedIcon className="h-16 w-16 text-green-600 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Como Agir Durante as Manifestações
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Nos últimos anos, manifestações legítimas foram manchadas por infiltrados. 
            Este guia ajuda a manter a integridade do movimento.
          </p>
        </div>

        <div className="space-y-8">
          {/* O que fazer */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">O que fazer</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-green-800">Mantenha-se 100% pacífico:</strong> não responda a provocações, mantenha a disciplina.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-green-800">Registre comportamentos suspeitos:</strong> filme discretamente qualquer ato de vandalismo ou incitação à violência.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-green-800">Avise a polícia local:</strong> forneça informações claras e objetivas sobre o que está acontecendo.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-green-800">Ande em grupos:</strong> evite ficar sozinho; grupos transmitem mais segurança.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* O que evitar */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <XCircleIcon className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">O que evitar</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-red-800">Não se una a grupos ou pessoas exaltadas:</strong> lobos solitários infiltrados só causam impacto se forem seguidos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-red-800">Não aceite provocações:</strong> ignorar é resistir com sabedoria.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-red-800">Não confronte fisicamente:</strong> documente, filme, afaste-se com segurança.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-red-800">Não ande com mascarados:</strong> quem luta pela verdade não se esconde.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <strong className="text-red-800">Não entre em prédios públicos:</strong> mesmo que incentivado, isso pode ser armadilha para criminalizar o povo.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reforce a mensagem */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <SpeakerWaveIcon className="h-8 w-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Reforce a mensagem do povo</h2>
            </div>
            
            <p className="text-gray-700 text-lg">
              Use mensagens de paz, justiça, liberdade e soberania. Evite palavras ou símbolos que possam ser distorcidos.
            </p>
          </div>

          {/* Em caso de emergência */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">Em caso de emergência</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">Mantenha a calma</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">Afaste-se com segurança</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">Alerte as autoridades</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-3"></div>
                <div>
                  <p className="text-gray-700">
                    <CameraIcon className="h-5 w-5 inline text-yellow-600 mr-2" />
                    Filme o que puder — provas inocentam o povo
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white">
            <div className="flex items-start gap-4">
              <DocumentTextIcon className="h-8 w-8 text-white flex-shrink-0 mt-1" />
              <div>
                <blockquote className="text-lg italic mb-4 leading-relaxed">
                  "O patriotismo é firme, mas jamais violento. A desordem é a ferramenta dos inimigos da liberdade."
                </blockquote>
                <p className="font-bold">— Equipe Marcha Brasil</p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheckIcon className="h-8 w-8 text-gray-600" />
              <h3 className="text-xl font-bold text-gray-900">Lembre-se</h3>
            </div>
            
            <p className="text-gray-700">
              Manifestações pacíficas são um direito constitucional garantido pelo Art. 5º, XVI da Constituição Federal. 
              Manter a ordem e a disciplina protege esse direito e fortalece nossa democracia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}