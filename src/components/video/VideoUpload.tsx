'use client';

import { useState } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { VideoUploadData } from '@/types/video';

interface VideoUploadProps {
  onUpload?: (data: VideoUploadData) => Promise<boolean>;
  protestId?: string;
  protestTitle?: string;
}

export default function VideoUpload({ onUpload, protestId, protestTitle }: VideoUploadProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    state: '',
    uploaderName: '',
    tags: [] as string[]
  });
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione apenas arquivos de vídeo.');
      return;
    }

    // Check file size (max 100MB for demo)
    if (file.size > 100 * 1024 * 1024) {
      alert('O arquivo de vídeo deve ter no máximo 100MB.');
      return;
    }

    setVideoFile(file);
    
    // Create video preview
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    
    // Auto-generate title if empty
    if (!formData.title) {
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setFormData(prev => ({ ...prev, title: fileName }));
    }
  };

  const handleThumbnailUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem para a thumbnail.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setThumbnailFile(file);
    
    const url = URL.createObjectURL(file);
    setThumbnailPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        handleVideoUpload(file);
      } else if (file.type.startsWith('image/')) {
        handleThumbnailUpload(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert('Por favor, selecione um arquivo de vídeo.');
      return;
    }

    setUploading(true);

    try {
      const uploadData: VideoUploadData = {
        title: formData.title,
        description: formData.description,
        videoFile,
        thumbnailFile: thumbnailFile || undefined,
        protestId,
        city: formData.city,
        state: formData.state,
        tags: formData.tags,
        uploaderName: formData.uploaderName || undefined
      };

      const success = onUpload ? await onUpload(uploadData) : true;
      
      if (success) {
        alert('🎉 Vídeo enviado com sucesso!\n\nSeu vídeo será revisado pelos moderadores antes de ser publicado. Você receberá uma notificação quando estiver aprovado.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          city: '',
          state: '',
          uploaderName: '',
          tags: []
        });
        setVideoFile(null);
        setThumbnailFile(null);
        setVideoPreview(null);
        setThumbnailPreview(null);
      } else {
        alert('❌ Erro ao enviar vídeo. Tente novamente.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Erro ao enviar vídeo. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Video Upload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CloudArrowUpIcon className="h-6 w-6 text-purple-600" />
            Upload de Vídeo
          </h2>
          
          {!videoFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CloudArrowUpIcon className={`h-16 w-16 mx-auto mb-4 ${
                dragActive ? 'text-purple-500' : 'text-gray-400'
              }`} />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arraste seu vídeo aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Formatos aceitos: MP4, MOV, AVI | Tamanho máximo: 100MB
              </p>
              <label className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer inline-block">
                Selecionar Arquivo
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <video
                  src={videoPreview || undefined}
                  controls
                  className="w-full max-h-96"
                  preload="metadata"
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">{videoFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Video Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <DocumentTextIcon className="h-6 w-6 text-purple-600" />
            Informações do Vídeo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Manifestação pela Democracia - São Paulo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Autor (opcional)
              </label>
              <input
                type="text"
                name="uploaderName"
                value={formData.uploaderName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Deixe em branco para permanecer anônimo"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Descreva o que aconteceu, onde e quando..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: São Paulo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Selecione o estado</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Event Association */}
          {protestId && protestTitle && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>📢 Associado ao evento:</strong> {protestTitle}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (opcional)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: manifestação, democracia, liberdade..."
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Adicionar
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Thumbnail (opcional)
          </h2>
          
          {!thumbnailFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors">
              <PlayIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-3">
                Adicione uma imagem de capa para seu vídeo
              </p>
              <label className="bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors cursor-pointer">
                Selecionar Imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={thumbnailPreview || undefined}
                alt="Thumbnail preview"
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">{thumbnailFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(thumbnailFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setThumbnailFile(null);
                    setThumbnailPreview(null);
                    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-800 mb-2">
            ⚠️ Diretrizes de Conteúdo
          </h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <p>• Apenas vídeos de manifestações pacíficas e legais</p>
            <p>• Não incluir conteúdo violento, ofensivo ou partidário</p>
            <p>• Respeitar a privacidade de outros participantes</p>
            <p>• Todos os vídeos passam por moderação antes da publicação</p>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={!videoFile || uploading}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Enviando...' : 'Enviar Vídeo'}
          </button>
          <p className="text-sm text-gray-600 mt-3">
            Seu vídeo será revisado pelos moderadores antes da publicação
          </p>
        </div>
      </form>
    </div>
  );
}