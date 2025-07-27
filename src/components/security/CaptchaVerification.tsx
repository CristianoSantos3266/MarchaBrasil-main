'use client'

import { useState, useEffect, useRef } from 'react'
import {
  ShieldCheckIcon,
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface CaptchaVerificationProps {
  onVerify: (isVerified: boolean) => void
  onReset?: () => void
  className?: string
}

interface MathChallenge {
  question: string
  answer: number
}

interface ImageChallenge {
  images: string[]
  correctIndices: number[]
  instruction: string
}

export default function CaptchaVerification({ onVerify, onReset, className = '' }: CaptchaVerificationProps) {
  const [challengeType, setChallengeType] = useState<'math' | 'image' | 'slider'>('math')
  const [mathChallenge, setMathChallenge] = useState<MathChallenge>({ question: '', answer: 0 })
  const [imageChallenge, setImageChallenge] = useState<ImageChallenge>({ images: [], correctIndices: [], instruction: '' })
  const [userAnswer, setUserAnswer] = useState('')
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [sliderValue, setSliderValue] = useState(0)
  const [targetSliderValue, setTargetSliderValue] = useState(0)
  const [isVerified, setIsVerified] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Initialize challenge on mount
  useEffect(() => {
    generateNewChallenge()
  }, [])

  const generateMathChallenge = (): MathChallenge => {
    const operations = ['+', '-', '×']
    const operation = operations[Math.floor(Math.random() * operations.length)]
    
    let num1: number, num2: number, answer: number, question: string
    
    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        answer = num1 + num2
        question = `${num1} + ${num2} = ?`
        break
      case '-':
        num1 = Math.floor(Math.random() * 30) + 10
        num2 = Math.floor(Math.random() * num1)
        answer = num1 - num2
        question = `${num1} - ${num2} = ?`
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        answer = num1 * num2
        question = `${num1} × ${num2} = ?`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        question = '5 + 3 = ?'
    }
    
    return { question, answer }
  }

  const generateImageChallenge = (): ImageChallenge => {
    // Demo image challenge with emoji representations
    const challenges = [
      {
        instruction: 'Selecione todas as imagens com veículos',
        images: ['🚗', '🌳', '🚛', '🏠', '🚌', '🌸', '🚲', '✈️', '🌼'],
        correctIndices: [0, 2, 4, 6, 7] // car, truck, bus, bike, plane
      },
      {
        instruction: 'Selecione todas as imagens com símbolos do Brasil',
        images: ['🇧🇷', '🇺🇸', '⚽', '🎭', '🇫🇷', '🏖️', '🌴', '🇬🇧', '🐆'],
        correctIndices: [0, 2, 3, 5, 6, 8] // Brazil flag, soccer, carnival mask, beach, palm tree, jaguar
      },
      {
        instruction: 'Selecione todas as imagens com elementos cívicos',
        images: ['🗳️', '🎂', '⚖️', '🎵', '🏛️', '🌮', '📊', '🎨', '📋'],
        correctIndices: [0, 2, 4, 6, 8] // ballot box, scales, government building, chart, clipboard
      }
    ]
    
    return challenges[Math.floor(Math.random() * challenges.length)]
  }

  const generateSliderChallenge = () => {
    const target = Math.floor(Math.random() * 80) + 10 // 10-90
    setTargetSliderValue(target)
    setSliderValue(0)
  }

  const generateNewChallenge = () => {
    setError('')
    setUserAnswer('')
    setSelectedImages([])
    setSliderValue(0)
    
    // Randomly select challenge type
    const types: ('math' | 'image' | 'slider')[] = ['math', 'image', 'slider']
    const newType = types[Math.floor(Math.random() * types.length)]
    setChallengeType(newType)
    
    switch (newType) {
      case 'math':
        setMathChallenge(generateMathChallenge())
        break
      case 'image':
        setImageChallenge(generateImageChallenge())
        break
      case 'slider':
        generateSliderChallenge()
        break
    }
  }

  const verifyAnswer = () => {
    setLoading(true)
    setError('')
    
    setTimeout(() => {
      let isCorrect = false
      
      switch (challengeType) {
        case 'math':
          isCorrect = parseInt(userAnswer) === mathChallenge.answer
          break
        case 'image':
          const correctSet = new Set(imageChallenge.correctIndices)
          const selectedSet = new Set(selectedImages)
          isCorrect = correctSet.size === selectedSet.size && 
                     [...correctSet].every(x => selectedSet.has(x))
          break
        case 'slider':
          const tolerance = 5
          isCorrect = Math.abs(sliderValue - targetSliderValue) <= tolerance
          break
      }
      
      if (isCorrect) {
        setIsVerified(true)
        onVerify(true)
      } else {
        setAttempts(prev => prev + 1)
        if (attempts >= 2) {
          setError('Muitas tentativas incorretas. Gerando novo desafio...')
          setTimeout(() => {
            generateNewChallenge()
            setAttempts(0)
          }, 2000)
        } else {
          setError('Resposta incorreta. Tente novamente.')
        }
        onVerify(false)
      }
      
      setLoading(false)
    }, 1000) // Simulate verification delay
  }

  const handleImageToggle = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const resetCaptcha = () => {
    setIsVerified(false)
    setAttempts(0)
    generateNewChallenge()
    onReset?.()
  }

  if (isVerified) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Verificação Concluída</p>
            <p className="text-sm text-green-700">Você foi verificado como humano</p>
          </div>
          <button
            onClick={resetCaptcha}
            className="ml-auto p-1 text-green-600 hover:text-green-700"
            title="Gerar novo desafio"
          >
            <ArrowPathIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-900">Verificação de Segurança</span>
        <button
          onClick={generateNewChallenge}
          className="ml-auto p-1 text-gray-600 hover:text-gray-700"
          title="Gerar novo desafio"
        >
          <ArrowPathIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Math Challenge */}
      {challengeType === 'math' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Resolva a operação matemática:</p>
            <div className="text-2xl font-bold text-gray-900 bg-white p-4 rounded border">
              {mathChallenge.question}
            </div>
          </div>
          
          <div className="flex gap-3">
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Sua resposta"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && verifyAnswer()}
            />
            <button
              onClick={verifyAnswer}
              disabled={loading || !userAnswer}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        </div>
      )}

      {/* Image Challenge */}
      {challengeType === 'image' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">{imageChallenge.instruction}</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {imageChallenge.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageToggle(index)}
                  className={`w-20 h-20 text-4xl border-2 rounded-lg transition-colors ${
                    selectedImages.includes(index)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  {image}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={verifyAnswer}
            disabled={loading || selectedImages.length === 0}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Verificar Seleção'}
          </button>
        </div>
      )}

      {/* Slider Challenge */}
      {challengeType === 'slider' && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Mova o controle deslizante para a posição: <strong>{targetSliderValue}%</strong>
            </p>
            
            <div className="relative mb-4">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span className="font-medium">Atual: {sliderValue}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={verifyAnswer}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Verificar Posição'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-600 text-sm">
          <ExclamationCircleIcon className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Attempts Counter */}
      {attempts > 0 && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          Tentativas: {attempts}/3
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
          transition: background .15s ease-in-out;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #2563eb;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </div>
  )
}