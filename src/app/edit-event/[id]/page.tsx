'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Navigation from '@/components/ui/Navigation'
import { getDemoEventById, updateDemoEvent, getThumbnail, isDemoMode } from '@/lib/demo-events'
import { Protest } from '@/types'
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

export default function EditEventPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [event, setEvent] = useState<Protest | null>(null)
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null)

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
    country: 'BR',
    isInternational: false,
    expected_attendance: '',
    whatsapp_contact: ''
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

  const canadianProvinces = [
    { code: 'ON', name: 'Ontario' },
    { code: 'QC', name: 'Quebec' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'AB', name: 'Alberta' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'YT', name: 'Yukon' },
    { code: 'NU', name: 'Nunavut' }
  ]

  // Check if we're in demo mode
  const demoMode = isDemoMode()

  useEffect(() => {
    if (!demoMode) {
      router.push('/')
      return
    }

    // Load the event data
    const eventData = getDemoEventById(id as string)
    if (!eventData) {
      router.push('/')
      return
    }

    setEvent(eventData)

    // Load existing thumbnail
    const existingThumb = getThumbnail(id as string)
    setExistingThumbnail(existingThumb || null)

    // Populate form with existing data
    setFormData({
      title: eventData.title,
      description: eventData.description,
      type: eventData.type as any,
      date: formatDateToBrazilian(eventData.date),
      time: eventData.time,
      meeting_point: eventData.location,
      final_destination: eventData.final_destination || '',
      city: eventData.city,
      state: eventData.region,
      country: eventData.country || 'BR',
      isInternational: eventData.country !== 'BR',
      expected_attendance: '',
      whatsapp_contact: ''
    })
  }, [id, demoMode, router])

  const formatDateToBrazilian = (date: string) => {
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

  const compressImage = (imageData: string, callback: (compressedData: string) => void) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions (max 800px width/height)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > height && width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      } else if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedData = canvas.toDataURL('image/jpeg', 0.7); // 70% quality
      callback(compressedData);
    };
    img.src = imageData;
  }

  const processFile = (file: File) => {
    console.log('Processing file:', file.name, file.type, file.size);
    
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
        const imageData = event.target.result as string;
        console.log('Image loaded successfully, data length:', imageData.length);
        
        // Compress image if it's too large
        if (imageData.length > 100000) { // If larger than ~100KB
          compressImage(imageData, (compressedData) => {
            console.log('Image compressed from', imageData.length, 'to', compressedData.length);
            setThumbnail(compressedData)
            setMessage('✅ Imagem carregada e comprimida com sucesso!')
            setTimeout(() => setMessage(''), 3000)
          });
        } else {
          setThumbnail(imageData)
          setMessage('✅ Imagem carregada com sucesso!')
          setTimeout(() => setMessage(''), 3000)
        }
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
    setExistingThumbnail(null)
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
    
    return true
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
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay
      
      // Prepare the thumbnail data - use the new one if uploaded, otherwise keep existing
      const thumbnailData = thumbnail || existingThumbnail;
      
      console.log('Updating event with thumbnail:', thumbnailData ? 'Present' : 'None');
      
      // Update the demo event
      const success = updateDemoEvent(id as string, { 
        ...formData, 
        date: formatDateToISO(formData.date),
        thumbnail: thumbnailData
      })
      
      if (success) {
        setMessage('✅ Evento atualizado com sucesso!')
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setMessage('❌ Erro ao atualizar evento. Tente novamente.')
      }

    } catch (error: any) {
      setMessage(error.message || 'Erro ao atualizar evento')
    } finally {
      setLoading(false)
    }
  }

  if (!event) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-green-200">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">✏️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Evento</h1>
            <p className="text-gray-600">
              Atualize as informações do seu evento
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
              message.includes('❌') 
                ? 'bg-red-100 text-red-800 border border-red-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-green-600" />
                Título do Evento
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                placeholder="Ex: Manifestação pela Democracia"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <DocumentTextIcon className="h-6 w-6 mr-2 text-green-600" />
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg resize-vertical"
                placeholder="Descreva os objetivos e detalhes da manifestação..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <HandRaisedIcon className="h-6 w-6 mr-2 text-green-600" />
                Tipo de Evento
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {protestTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={formData.type === type.value}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 peer-checked:border-green-500 peer-checked:bg-green-50 transition-all">
                      <type.icon className="h-6 w-6 mr-3 text-green-600" />
                      <span className="font-medium text-gray-900">{type.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Date */}
              <div className="relative">
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <CalendarIcon className="h-6 w-6 mr-2 text-green-600" />
                  Data
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onClick={() => setShowCalendar(!showCalendar)}
                    required
                    readOnly
                    className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg cursor-pointer"
                    placeholder="Selecione a data"
                  />
                  <CalendarIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                
                {showCalendar && (
                  <div className="calendar-container absolute top-full left-0 mt-2 bg-white border-2 border-green-200 rounded-lg shadow-lg z-50 p-4 min-w-[320px]">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        type="button"
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        ‹
                      </button>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {monthNames[currentMonth]} {currentYear}
                      </h3>
                      <button
                        type="button"
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        ›
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayNames.map(day => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {generateCalendar().map((day, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => day && handleDateSelect(day)}
                          disabled={!day}
                          className={`p-2 text-sm rounded-lg ${
                            !day
                              ? 'invisible'
                              : day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()
                              ? 'bg-blue-100 text-blue-800 font-semibold'
                              : 'hover:bg-green-100 text-gray-700'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Time */}
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <CalendarIcon className="h-6 w-6 mr-2 text-green-600" />
                  Horário (24h)
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                >
                  <option value="">Selecione o horário</option>
                  {Array.from({ length: 24 }, (_, hour) => 
                    Array.from({ length: 4 }, (_, quarter) => {
                      const h = hour.toString().padStart(2, '0')
                      const m = (quarter * 15).toString().padStart(2, '0')
                      return (
                        <option key={`${h}:${m}`} value={`${h}:${m}`}>
                          {h}:{m}
                        </option>
                      )
                    })
                  ).flat()}
                </select>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
                  Ponto de Encontro
                </label>
                <input
                  type="text"
                  name="meeting_point"
                  value={formData.meeting_point}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                  placeholder="Ex: Praça da República"
                />
              </div>

              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
                  Destino Final (Opcional)
                </label>
                <input
                  type="text"
                  name="final_destination"
                  value={formData.final_destination}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                  placeholder="Ex: Congresso Nacional"
                />
              </div>
            </div>

            {/* City and State */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
                  Estado
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-lg"
                >
                  {formData.isInternational && formData.country === 'CA' ? (
                    <>
                      <option value="">Selecione a província</option>
                      {canadianProvinces.map(province => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <>
                      <option value="">Selecione o estado</option>
                      {brazilianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Thumbnail */}
            <div>
              <label className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                <PhotoIcon className="h-6 w-6 mr-2 text-green-600" />
                Imagem do Evento (Opcional)
              </label>

              {/* Show current thumbnail */}
              {(thumbnail || existingThumbnail) && (
                <div className="mb-4 relative inline-block">
                  <img 
                    src={thumbnail || existingThumbnail!} 
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 hover:border-green-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <PhotoIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-2">
                  Arraste uma imagem aqui ou clique para selecionar
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  JPG, PNG ou GIF (máximo 5MB)
                </p>
                <input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="hidden"
                />
                <label
                  htmlFor="thumbnail"
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  <PhotoIcon className="h-4 w-4 mr-2" />
                  Selecionar Imagem
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-lg hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                    Atualizando...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-6 w-6 mr-3" />
                    Atualizar Evento
                  </>
                )}
              </button>
            </div>

            {/* Cancel Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full py-3 px-6 bg-gray-200 text-gray-800 text-lg font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}