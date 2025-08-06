'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/ui/Navigation';
import VideoUpload from '@/components/video/VideoUpload';
import { VideoUploadData } from '@/types/video';
import { CloudArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

function VideoUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const protestId = searchParams.get('protestId');
  const protestTitle = searchParams.get('protestTitle');
  
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  const handleUpload = async (data: VideoUploadData): Promise<boolean> => {
    setUploadStatus('uploading');
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real app, this would upload to a server
      console.log('Uploading video:', {
        title: data.title,
        description: data.description,
        city: data.city,
        state: data.state,
        tags: data.tags,
        protestId: data.protestId,
        videoSize: data.videoFile.size,
        thumbnailSize: data.thumbnailFile?.size
      });
      
      setUploadStatus('success');
      
      // Auto-redirect after success
      setTimeout(() => {
        router.push('/videos');
      }, 3000);
      
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus('error');
      return false;
    }
  };

  if (uploadStatus === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
              <CheckCircleIcon className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🎉 Vídeo Enviado com Sucesso!
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Seu vídeo foi recebido e está sendo processado. Nossa equipe de moderação 
              irá revisar o conteúdo e, uma vez aprovado, ele será publicado na plataforma.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-blue-600 font-semibold mb-2">1. Processamento</div>
                <div className="text-blue-700">Vídeo sendo processado automaticamente</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-yellow-600 font-semibold mb-2">2. Moderação</div>
                <div className="text-yellow-700">Revisão manual pela equipe (até 24h)</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-green-600 font-semibold mb-2">3. Publicação</div>
                <div className="text-green-700">Disponibilização pública após aprovação</div>
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => router.push('/videos')}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors"
              >
                Ver Todos os Vídeos
              </button>
              <div className="text-sm text-gray-500">
                Redirecionando automaticamente em alguns segundos...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-50 to-blue-50">
      <Navigation />
      
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur rounded-full p-4">
                <CloudArrowUpIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Enviar Vídeo do Protesto
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Compartilhe vídeos dos protestos pacíficos e ajude a documentar 
              este momento histórico da democracia brasileira.
            </p>
            {protestId && protestTitle && (
              <div className="mt-6 bg-white/20 backdrop-blur rounded-lg p-4">
                <p className="text-purple-100">
                  <strong>📢 Enviando para o evento:</strong> {decodeURIComponent(protestTitle)}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Status */}
        {uploadStatus === 'uploading' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-8">
            <div className="text-center">
              <LoadingSpinner 
                size="lg" 
                color="blue" 
                text="Enviando seu vídeo..." 
                variant="wave"
              />
              <p className="text-blue-700 text-sm mt-4 max-w-md mx-auto">
                Por favor, não feche esta página. O upload pode levar alguns minutos dependendo do tamanho do arquivo.
              </p>
              <div className="mt-4 bg-blue-100 rounded-lg p-3">
                <div className="flex items-center justify-between text-xs text-blue-600">
                  <span>Progresso</span>
                  <span>Processando...</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Erro no envio</h3>
                <p className="text-red-700 text-sm">
                  Ocorreu um erro ao enviar seu vídeo. Por favor, tente novamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Important Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">
                Diretrizes de Conteúdo
              </h3>
              <div className="text-yellow-700 text-sm space-y-1">
                <p>• <strong>Apenas manifestações pacíficas:</strong> Vídeos devem mostrar protestos ordeiros e legais</p>
                <p>• <strong>Sem conteúdo ofensivo:</strong> Não são permitidos vídeos com violência, ódio ou conteúdo impróprio</p>
                <p>• <strong>Privacidade:</strong> Respeite a privacidade de outros manifestantes</p>
                <p>• <strong>Apartidarismo:</strong> Evite símbolos ou discursos partidários específicos</p>
                <p>• <strong>Moderação:</strong> Todos os vídeos passam por análise antes da publicação</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <VideoUpload
          onUpload={handleUpload}
          protestId={protestId || undefined}
          protestTitle={protestTitle ? decodeURIComponent(protestTitle) : undefined}
        />

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            💡 Dicas para um Bom Vídeo
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Qualidade Técnica:</h4>
              <ul className="space-y-1">
                <li>• Filme na horizontal (paisagem)</li>
                <li>• Mantenha a câmera estável</li>
                <li>• Certifique-se de boa iluminação</li>
                <li>• Áudio claro e sem ruídos excessivos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Conteúdo:</h4>
              <ul className="space-y-1">
                <li>• Capture momentos representativos</li>
                <li>• Mostre a organização e ordem</li>
                <li>• Inclua placas e símbolos democráticos</li>
                <li>• Documente a participação diversa</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoUploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div>Carregando...</div></div>}>
      <VideoUploadContent />
    </Suspense>
  );
}