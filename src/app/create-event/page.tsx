'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createEvent } from '@/lib/supabase'
import { saveDemoEvent } from '@/lib/demo-events'

// Set Portuguese locale for the entire document
if (typeof window !== 'undefined') {
  document.documentElement.lang = 'pt-BR'
}
import { 
  DocumentTextIcon,
  CalendarIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  HandRaisedIcon,
  MapPinIcon,
  TruckIcon,
  BuildingLibraryIcon,
  RocketLaunchIcon,
  PaperAirplaneIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function CreateEventPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'manifestacao' as 'manifestacao' | 'marcha' | 'caminhoneiros' | 'carreata' | 'motociata' | 'tratorada' | 'assembleia',
    date: '',
    time: '',
    meeting_point: '',
    final_destination: '',
    city: '',
    state: '',
    expected_attendance: '',
    whatsapp_contact: '',
    isNational: false
  })

  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const protestTypes = [
    { value: 'manifestacao', label: 'Manifestação', icon: HandRaisedIcon },
    { value: 'marcha', label: 'Marcha', icon: MapPinIcon },
    { value: 'caminhoneiros', label: 'Caminhoneiros', icon: TruckIcon },
    { value: 'carreata', label: 'Carreata', icon: TruckIcon },
    { value: 'motociata', label: 'Motociata', icon: MapPinIcon },
    { value: 'tratorada', label: 'Tratorada', icon: TruckIcon },
    { value: 'assembleia', label: 'Assembleia', icon: BuildingLibraryIcon }
  ]

  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 
    'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ]

  const brazilianCapitals = [
    { state: 'AC', capital: 'Rio Branco' },
    { state: 'AL', capital: 'Maceió' },
    { state: 'AP', capital: 'Macapá' },
    { state: 'AM', capital: 'Manaus' },
    { state: 'BA', capital: 'Salvador' },
    { state: 'CE', capital: 'Fortaleza' },
    { state: 'DF', capital: 'Brasília' },
    { state: 'ES', capital: 'Vitória' },
    { state: 'GO', capital: 'Goiânia' },
    { state: 'MA', capital: 'São Luís' },
    { state: 'MT', capital: 'Cuiabá' },
    { state: 'MS', capital: 'Campo Grande' },
    { state: 'MG', capital: 'Belo Horizonte' },
    { state: 'PA', capital: 'Belém' },
    { state: 'PB', capital: 'João Pessoa' },
    { state: 'PR', capital: 'Curitiba' },
    { state: 'PE', capital: 'Recife' },
    { state: 'PI', capital: 'Teresina' },
    { state: 'RJ', capital: 'Rio de Janeiro' },
    { state: 'RN', capital: 'Natal' },
    { state: 'RS', capital: 'Porto Alegre' },
    { state: 'RO', capital: 'Porto Velho' },
    { state: 'RR', capital: 'Boa Vista' },
    { state: 'SC', capital: 'Florianópolis' },
    { state: 'SP', capital: 'São Paulo' },
    { state: 'SE', capital: 'Aracaju' },
    { state: 'TO', capital: 'Palmas' }
  ]

  // Check if we're in demo mode
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'

  useEffect(() => {
    // Set Brazilian Portuguese locale for date/time inputs
    if (typeof window !== 'undefined') {
      document.documentElement.lang = 'pt-BR'
      // Set locale for date/time formatting
      try {
        const meta = document.createElement('meta')
        meta.httpEquiv = 'Content-Language'
        meta.content = 'pt-BR'
        document.head.appendChild(meta)
      } catch (e) {
        console.log('Locale meta already set')
      }
    }

    // In demo mode, allow access without authentication
    if (isDemoMode) {
      setLoading(false)
      return
    }

    if (!user) {
      router.push('/login')
      return
    }

    if (!userProfile || userProfile.role !== 'organizer') {
      if (userProfile?.role === 'organizer-pending') {
        router.push('/')
        return
      } else if (userProfile?.role === 'user') {
        router.push('/criar-perfil')
        return
      }
    }
  }, [user, userProfile, router, isDemoMode])

  useEffect(() => {
    // Close calendar when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const calendar = document.querySelector('.calendar-container')
      if (calendar && !calendar.contains(event.target as Node)) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar])

  const formatDateToBrazilian = (date: string) => {
    // Convert from YYYY-MM-DD to DD-MM-YYYY
    if (!date) return ''
    if (date.includes('-') && date.length === 10) {
      const parts = date.split('-')
      if (parts.length === 3 && parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }
    return date
  }

  const formatDateToISO = (date: string) => {
    // Convert from DD-MM-YYYY to YYYY-MM-DD for backend/input
    if (!date) return ''
    if (date.includes('-') && date.length === 10) {
      const parts = date.split('-')
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`
      }
    }
    return date
  }

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const handleDateSelect = (day: number) => {
    const selectedDate = `${day.toString().padStart(2, '0')}-${(currentMonth + 1).toString().padStart(2, '0')}-${currentYear}`
    setFormData(prev => ({ ...prev, date: selectedDate }))
    setShowCalendar(false)
  }

  const navigateMonth = (direction: number) => {
    if (direction === 1) {
      if (currentMonth === 11) {
        setCurrentMonth(0)
        setCurrentYear(currentYear + 1)
      } else {
        setCurrentMonth(currentMonth + 1)
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11)
        setCurrentYear(currentYear - 1)
      } else {
        setCurrentMonth(currentMonth - 1)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const processFile = (file: File) => {
    console.log('File selected:', file.name, file.type, file.size)
    
    // Clear any previous error messages
    setMessage('')
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF).')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('❌ A imagem deve ter no máximo 5MB.')
      return
    }

    setThumbnailFile(file)
    
    // Create preview URL
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnail(event.target.result as string)
        setMessage('✅ Imagem carregada com sucesso!')
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000)
      }
    }
    reader.onerror = () => {
      setMessage('❌ Erro ao ler a imagem. Tente novamente.')
    }
    reader.readAsDataURL(file)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailFile(null)
    // Reset file input
    const fileInput = document.getElementById('thumbnail') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const validateDate = (dateStr: string) => {
    if (!dateStr) return false
    
    // For Brazilian format DD-MM-YYYY
    if (dateStr.length === 10 && dateStr.includes('-')) {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const month = parseInt(parts[1])
        const year = parseInt(parts[2])
        
        if (day < 1 || day > 31 || month < 1 || month > 12 || year < new Date().getFullYear()) {
          return false
        }
        
        // Check if date is valid
        const date = new Date(year, month - 1, day)
        return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year
      }
    }
    
    return true // Let the browser handle validation for date input
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setMessage('')

    // Validate date format
    if (!validateDate(formData.date)) {
      setMessage('❌ Data inválida. Use o formato dd-mm-aaaa (ex: 25-12-2024)')
      setLoading(false)
      return
    }

    try {
      // In demo mode, save event to localStorage
      if (isDemoMode) {
        await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate network delay
        
        // Save the demo event(s) with thumbnail (convert date to ISO for consistency)
        const savedEvents = saveDemoEvent({ 
          ...formData, 
          date: formatDateToISO(formData.date),
          thumbnail 
        });
        
        if (formData.isNational) {
          setMessage(`Eventos criados com sucesso! (Modo Demo - ${savedEvents.length} manifestações criadas em todas as capitais)`)
        } else {
          setMessage(`Evento criado com sucesso! (Modo Demo - ${savedEvents[0].title})`)
        }
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'manifestacao',
          date: '',
          time: '',
          meeting_point: '',
          final_destination: '',
          city: '',
          state: '',
          expected_attendance: '',
          whatsapp_contact: '',
          isNational: false
        })
        setThumbnail(null)
        setThumbnailFile(null)

        // Don't auto-redirect in demo mode - let user see the success message
        return
      }

      if (!user) return

      const eventData = {
        creator_id: user.id,
        ...formData,
        date: formatDateToISO(formData.date), // Convert to ISO format for backend
        expected_attendance: formData.expected_attendance ? parseInt(formData.expected_attendance) : null,
        status: 'pending' as const,
        is_international: false,
        country: null
      }

      const { data, error } = await createEvent(eventData)
      if (error) throw error

      setMessage('Evento criado com sucesso! Aguarde aprovação dos moderadores.')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'manifestacao',
        date: '',
        time: '',
        meeting_point: '',
        final_destination: '',
        city: '',
        state: '',
        expected_attendance: '',
        whatsapp_contact: '',
        isNational: false
      })
      setThumbnail(null)
      setThumbnailFile(null)

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)

    } catch (error: any) {
      setMessage(error.message || 'Erro ao criar evento')
    } finally {
      setLoading(false)
    }
  }

  // In demo mode, show loading until ready, then allow access
  if (!isDemoMode && (!user || !userProfile)) {
    return <div>Carregando...</div>
  }

  if (!isDemoMode && userProfile?.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-yellow-200">
            <div className="text-4xl mb-4">⏳</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Aguardando Aprovação</h1>
            <p className="text-gray-600">
              {userProfile.role === 'organizer-pending' 
                ? 'Seu perfil de organizador está sendo revisado pelos moderadores. Você receberá um email quando for aprovado.'
                : 'Você precisa criar um perfil de organizador para criar eventos.'
              }
            </p>
            {userProfile.role === 'user' && (
              <button
                onClick={() => router.push('/criar-perfil')}
                className="mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                Criar Perfil de Organizador
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50" lang="pt-BR">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <HandRaisedIcon className="h-8 w-8 text-green-600" />
              Criar Nova Manifestação
            </h1>
            <p className="text-lg text-gray-600">
              Organize uma manifestação pacífica em defesa da democracia
            </p>
            <div className="mt-2 text-sm text-blue-600">
              {isDemoMode ? (
                <span><strong>Modo Demo</strong> - Teste a criação de eventos</span>
              ) : (
                <>Organizador: <strong>{userProfile?.public_name}</strong></>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6 text-green-600" />
                Informações Básicas
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Manifestação *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Marcha pela Liberdade de Expressão"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Manifestação *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {protestTypes.map(type => {
                      const IconComponent = type.icon;
                      return (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Descreva os objetivos e propósitos da manifestação..."
                  required
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem de Destaque (opcional)
                </label>
                
                {!thumbnail ? (
                  <div 
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      isDragging 
                        ? 'border-green-500 bg-green-100' 
                        : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <label htmlFor="thumbnail" className="cursor-pointer block">
                      <PhotoIcon className={`h-16 w-16 mx-auto mb-4 ${
                        isDragging ? 'text-green-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-lg font-medium block mb-2 ${
                        isDragging ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {isDragging ? 'Solte a imagem aqui' : 'Clique para adicionar uma imagem'}
                      </span>
                      <span className="text-sm text-gray-500 block mb-4">
                        ou arraste e solte aqui
                      </span>
                      <div className="bg-green-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors">
                        Escolher Arquivo
                      </div>
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-4">
                      Formatos aceitos: PNG, JPG, JPEG, GIF | Tamanho máximo: 5MB
                    </p>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={thumbnail}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeThumbnail}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                    <div className="mt-2 text-sm text-gray-600">
                      {thumbnailFile?.name} ({((thumbnailFile?.size || 0) / 1024 / 1024).toFixed(1)}MB)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date and Location */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-blue-600" />
                Data e Local
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      onClick={() => setShowCalendar(!showCalendar)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      placeholder="dd-mm-aaaa"
                      readOnly
                      required
                    />
                    <CalendarIcon 
                      className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 cursor-pointer" 
                      onClick={() => setShowCalendar(!showCalendar)}
                    />
                    
                    {showCalendar && (
                      <div className="calendar-container absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80">
                        <div className="flex justify-between items-center mb-4">
                          <button 
                            type="button"
                            onClick={() => navigateMonth(-1)} 
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            ←
                          </button>
                          <span className="font-semibold text-lg">
                            {monthNames[currentMonth]} {currentYear}
                          </span>
                          <button 
                            type="button"
                            onClick={() => navigateMonth(1)} 
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            →
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {dayNames.map(day => (
                            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-7 gap-1">
                          {generateCalendar().map((day, index) => {
                            if (day === null) {
                              return <div key={index} className="h-8"></div>
                            }
                            
                            const today = new Date()
                            const isToday = day === today.getDate() && 
                                          currentMonth === today.getMonth() && 
                                          currentYear === today.getFullYear()
                            const isPast = new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                            
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => !isPast && handleDateSelect(day)}
                                className={`h-8 w-8 text-sm rounded hover:bg-blue-100 flex items-center justify-center ${
                                  isPast 
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-gray-700 hover:text-blue-600 cursor-pointer'
                                } ${
                                  isToday ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                                }`}
                                disabled={isPast}
                              >
                                {day}
                              </button>
                            )
                          })}
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setShowCalendar(false)}
                            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                          >
                            Fechar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horário * (Formato 24h)
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecione o horário</option>
                    {Array.from({ length: 24 }, (_, hour) =>
                      Array.from({ length: 4 }, (_, quarter) => {
                        const h = hour.toString().padStart(2, '0')
                        const m = (quarter * 15).toString().padStart(2, '0')
                        const timeValue = `${h}:${m}`
                        return (
                          <option key={timeValue} value={timeValue}>
                            {timeValue}
                          </option>
                        )
                      })
                    ).flat()}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Localização *
                  </label>
                  
                  {/* National Event Toggle */}
                  <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isNational}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          isNational: e.target.checked,
                          state: e.target.checked ? '' : prev.state,
                          city: e.target.checked ? '' : prev.city
                        }))}
                        className="h-4 w-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm font-medium text-green-800">
                        🇧🇷 Evento Nacional - Todas as Capitais Brasileiras
                      </span>
                    </label>
                    {formData.isNational && (
                      <p className="text-xs text-green-700 mt-2">
                        Criará automaticamente 27 eventos simultâneos (uma manifestação em cada capital)
                      </p>
                    )}
                  </div>

                  {!formData.isNational && (
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Selecione o estado</option>
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  )}

                  {formData.isNational && (
                    <div className="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-md text-green-800 font-medium">
                      Todas as 27 capitais brasileiras
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {!formData.isNational && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: São Paulo"
                      required={!formData.isNational}
                    />
                  </div>
                )}

                <div className={formData.isNational ? "md:col-span-2" : ""}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.isNational ? 'Ponto de Encontro Base (opcional)' : 'Ponto de Encontro *'}
                  </label>
                  <input
                    type="text"
                    name="meeting_point"
                    value={formData.meeting_point}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={formData.isNational 
                      ? "Ex: Centro da cidade (será aplicado a todas as capitais)" 
                      : "Ex: Avenida Paulista, em frente ao MASP"
                    }
                    required={!formData.isNational}
                  />
                  {formData.isNational && (
                    <p className="text-xs text-gray-600 mt-1">
                      Se não especificado, será usado "Centro de [Capital]" para cada cidade
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destino Final <span className="text-gray-500">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="final_destination"
                  value={formData.final_destination}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Congresso Nacional, Palácio do Planalto"
                />
              </div>
            </div>

            {/* Contact and Details */}
            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PhoneIcon className="h-6 w-6 text-yellow-600" />
                Contato e Detalhes
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp para Verificação * <span className="text-xs text-gray-500">(não público)</span>
                  </label>
                  <input
                    type="tel"
                    name="whatsapp_contact"
                    value={formData.whatsapp_contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimativa de Participantes <span className="text-gray-500">(opcional)</span>
                  </label>
                  <input
                    type="number"
                    name="expected_attendance"
                    value={formData.expected_attendance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Ex: 500"
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                Diretrizes Importantes
              </h3>
              <div className="text-sm text-red-700 space-y-2">
                <p>• <strong>Manifestação Pacífica:</strong> Todos os eventos devem ser pacíficos e ordenados</p>
                <p>• <strong>Respeito às Leis:</strong> Cumpra todas as normas de trânsito e regulamentações locais</p>
                <p>• <strong>Neutralidade:</strong> Evite símbolos partidários ou violentos</p>
                <p>• <strong>Moderação:</strong> Todos os eventos são revisados antes da publicação</p>
                <p>• <strong>Responsabilidade:</strong> O organizador é responsável pela conduta dos participantes</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md text-sm ${
                message.includes('sucesso') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <PaperAirplaneIcon className="h-6 w-6" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="h-6 w-6" />
                    Criar Manifestação
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Seu evento será revisado pelos moderadores antes da publicação
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}