// Content scanning for security threats
interface ScanResult {
  isClean: boolean
  threats: ThreatDetection[]
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
}

interface ThreatDetection {
  type: 'violence' | 'weapons' | 'illegal_activity' | 'hate_speech' | 'misinformation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  detectedTerms: string[]
  context: string
}

interface ImageAnalysisResult {
  hasWeapons: boolean
  hasViolence: boolean
  hasInappropriateContent: boolean
  detectedObjects: string[]
  confidence: number
}

class ContentScanner {
  private weaponKeywords: string[] = [
    // Portuguese weapon-related terms
    'arma', 'armas', 'pistola', 'revólver', 'rifle', 'espingarda', 'fuzil',
    'faca', 'facas', 'punhal', 'machado', 'martelo', 'bastão', 'cassetete',
    'bomba', 'bombas', 'explosivo', 'explosivos', 'granada', 'granadas',
    'molotov', 'cocktail molotov', 'dinamite', 'pólvora', 'munição',
    'bala', 'balas', 'cartucho', 'cartuchos', 'projétil', 'projéteis',
    // English weapon terms (for international content)
    'gun', 'guns', 'pistol', 'rifle', 'weapon', 'weapons', 'knife', 'bomb',
    'explosive', 'ammunition', 'bullet', 'bullets', 'grenade', 'molotov'
  ]

  private violenceKeywords: string[] = [
    // Portuguese violence terms
    'matar', 'matar', 'assassinar', 'violência', 'violento', 'agressão',
    'agredir', 'atacar', 'ataque', 'destruir', 'destruição', 'quebrar',
    'incendiar', 'queimar', 'explodir', 'explosão', 'morte', 'morrer',
    'sangue', 'ferimento', 'ferir', 'machucar', 'bater', 'pancada',
    'luta', 'brigar', 'briga', 'guerra', 'combate', 'conflito',
    // Specific threats
    'vamos matar', 'vou matar', 'morte aos', 'eliminar', 'exterminar',
    'linchar', 'linchamento', 'enforcar', 'fuzilar', 'executar',
    // English violence terms
    'kill', 'murder', 'violence', 'attack', 'destroy', 'burn', 'fight'
  ]

  private illegalActivityKeywords: string[] = [
    // Portuguese illegal activity terms
    'invasão', 'invadir', 'ocupação', 'ocupar', 'vandalismo', 'vandalizar',
    'depredação', 'depredar', 'saque', 'saquear', 'roubo', 'roubar',
    'furto', 'furtar', 'crime', 'criminoso', 'ilegal', 'ilegalidade',
    'terrorismo', 'terrorista', 'sequestro', 'sequestrar', 'chantagear',
    'extorsão', 'corrupção', 'suborno', 'propina', 'lavagem de dinheiro',
    // Drug-related
    'drogas', 'tráfico', 'narcóticos', 'cocaína', 'maconha', 'crack',
    // English illegal terms
    'terrorism', 'illegal', 'crime', 'robbery', 'theft', 'vandalism'
  ]

  private hateSpeechKeywords: string[] = [
    // Discriminatory terms (censored for safety)
    'ódio', 'odiar', 'preconceito', 'discriminação', 'racismo', 'racista',
    'homofobia', 'homofóbico', 'xenofobia', 'xenófobo', 'fascismo', 'fascista',
    'nazismo', 'nazista', 'supremacia', 'superioridade', 'inferioridade',
    // Specific hate targets
    'exterminar', 'eliminar todos', 'morte a todos', 'queimar todos',
    // Religious/ethnic hate (general terms)
    'seita', 'herege', 'infiel', 'impuro', 'raça inferior'
  ]

  private misinformationPatterns: RegExp[] = [
    // Common misinformation patterns
    /urna.*fraude/gi,
    /eleição.*fraudada/gi,
    /voto.*alterado/gi,
    /sistema.*hackeado/gi,
    /mídia.*mentirosa/gi,
    /fake.*news.*verdade/gi,
    /conspiração.*mundial/gi,
    /governo.*secreto/gi,
    /chip.*controle/gi,
    /5g.*vírus/gi
  ]

  async scanText(text: string, context: string = ''): Promise<ScanResult> {
    const threats: ThreatDetection[] = []
    const textLower = text.toLowerCase()

    // Check for weapons
    const weaponMatches = this.findMatches(textLower, this.weaponKeywords)
    if (weaponMatches.length > 0) {
      threats.push({
        type: 'weapons',
        severity: 'high',
        description: 'Menções a armas ou objetos perigosos detectadas',
        detectedTerms: weaponMatches,
        context: context
      })
    }

    // Check for violence
    const violenceMatches = this.findMatches(textLower, this.violenceKeywords)
    if (violenceMatches.length > 0) {
      threats.push({
        type: 'violence',
        severity: this.assessViolenceSeverity(violenceMatches),
        description: 'Linguagem violenta ou ameaças detectadas',
        detectedTerms: violenceMatches,
        context: context
      })
    }

    // Check for illegal activities
    const illegalMatches = this.findMatches(textLower, this.illegalActivityKeywords)
    if (illegalMatches.length > 0) {
      threats.push({
        type: 'illegal_activity',
        severity: 'medium',
        description: 'Menções a atividades ilegais detectadas',
        detectedTerms: illegalMatches,
        context: context
      })
    }

    // Check for hate speech
    const hateMatches = this.findMatches(textLower, this.hateSpeechKeywords)
    if (hateMatches.length > 0) {
      threats.push({
        type: 'hate_speech',
        severity: 'high',
        description: 'Discurso de ódio ou discriminação detectado',
        detectedTerms: hateMatches,
        context: context
      })
    }

    // Check for misinformation patterns
    const misinfoMatches = this.findPatternMatches(text, this.misinformationPatterns)
    if (misinfoMatches.length > 0) {
      threats.push({
        type: 'misinformation',
        severity: 'medium',
        description: 'Possível desinformação detectada',
        detectedTerms: misinfoMatches,
        context: context
      })
    }

    const riskLevel = this.calculateRiskLevel(threats)
    const confidence = this.calculateConfidence(threats, text)

    return {
      isClean: threats.length === 0,
      threats,
      riskLevel,
      confidence
    }
  }

  async scanImage(imageData: string | File): Promise<ImageAnalysisResult> {
    // This is a simplified implementation
    // In production, you would use actual image recognition APIs like:
    // - Google Vision API
    // - AWS Rekognition
    // - Azure Computer Vision
    // - TensorFlow.js models

    try {
      // For demo purposes, we'll simulate image analysis
      const analysis = await this.simulateImageAnalysis(imageData)
      return analysis
    } catch (error) {
      console.error('Image analysis failed:', error)
      return {
        hasWeapons: false,
        hasViolence: false,
        hasInappropriateContent: false,
        detectedObjects: [],
        confidence: 0
      }
    }
  }

  private async simulateImageAnalysis(imageData: string | File): Promise<ImageAnalysisResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // For demo, randomly flag some images as containing threats
    // In production, this would be real ML-based detection
    const random = Math.random()
    
    if (random < 0.05) { // 5% chance of weapon detection
      return {
        hasWeapons: true,
        hasViolence: false,
        hasInappropriateContent: false,
        detectedObjects: ['weapon', 'knife', 'gun'],
        confidence: 0.85
      }
    }
    
    if (random < 0.1) { // 5% chance of violence detection
      return {
        hasWeapons: false,
        hasViolence: true,
        hasInappropriateContent: false,
        detectedObjects: ['violence', 'fight'],
        confidence: 0.75
      }
    }

    return {
      hasWeapons: false,
      hasViolence: false,
      hasInappropriateContent: false,
      detectedObjects: ['people', 'crowd', 'signs', 'banners'],
      confidence: 0.9
    }
  }

  private findMatches(text: string, keywords: string[]): string[] {
    const matches: string[] = []
    for (const keyword of keywords) {
      if (text.includes(keyword)) {
        matches.push(keyword)
      }
    }
    return matches
  }

  private findPatternMatches(text: string, patterns: RegExp[]): string[] {
    const matches: string[] = []
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        matches.push(...match)
      }
    }
    return matches
  }

  private assessViolenceSeverity(matches: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const criticalTerms = ['matar', 'assassinar', 'morte aos', 'exterminar', 'linchar', 'kill', 'murder']
    const highTerms = ['violência', 'atacar', 'destruir', 'explodir', 'violence', 'attack', 'destroy']
    
    const hasCritical = matches.some(match => criticalTerms.some(term => match.includes(term)))
    const hasHigh = matches.some(match => highTerms.some(term => match.includes(term)))
    
    if (hasCritical) return 'critical'
    if (hasHigh) return 'high'
    if (matches.length > 2) return 'medium'
    return 'low'
  }

  private calculateRiskLevel(threats: ThreatDetection[]): 'low' | 'medium' | 'high' | 'critical' {
    if (threats.length === 0) return 'low'
    
    const maxSeverity = threats.reduce((max, threat) => {
      const severityMap = { low: 1, medium: 2, high: 3, critical: 4 }
      const currentSeverity = severityMap[threat.severity]
      const maxSeverityValue = severityMap[max]
      return currentSeverity > maxSeverityValue ? threat.severity : max
    }, 'low' as 'low' | 'medium' | 'high' | 'critical')
    
    return maxSeverity
  }

  private calculateConfidence(threats: ThreatDetection[], text: string): number {
    if (threats.length === 0) return 0.95 // High confidence in clean content
    
    const textLength = text.length
    const threatDensity = threats.reduce((sum, threat) => sum + threat.detectedTerms.length, 0) / textLength
    
    // Higher density = higher confidence in threat detection
    const baseConfidence = Math.min(0.6 + threatDensity * 100, 0.95)
    
    // Adjust based on number of different threat types
    const threatTypeBonus = Math.min(threats.length * 0.1, 0.3)
    
    return Math.min(baseConfidence + threatTypeBonus, 0.98)
  }

  // Context-aware scanning for different types of content
  async scanEventDescription(description: string): Promise<ScanResult> {
    return this.scanText(description, 'event_description')
  }

  async scanEventTitle(title: string): Promise<ScanResult> {
    return this.scanText(title, 'event_title')
  }

  async scanUserComment(comment: string): Promise<ScanResult> {
    return this.scanText(comment, 'user_comment')
  }

  async scanUserProfile(profileText: string): Promise<ScanResult> {
    return this.scanText(profileText, 'user_profile')
  }

  // Batch scanning for multiple content pieces
  async batchScan(contents: { text: string; context: string; id: string }[]): Promise<Map<string, ScanResult>> {
    const results = new Map<string, ScanResult>()
    
    for (const content of contents) {
      const result = await this.scanText(content.text, content.context)
      results.set(content.id, result)
    }
    
    return results
  }

  // Generate a report for admin review
  generateThreatReport(scanResult: ScanResult, contentId: string, userId?: string): {
    id: string
    timestamp: string
    userId?: string
    contentId: string
    riskLevel: string
    threats: ThreatDetection[]
    requiresReview: boolean
    autoAction: 'none' | 'flag' | 'block' | 'delete'
  } {
    const autoAction = this.determineAutoAction(scanResult)
    
    return {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId,
      contentId,
      riskLevel: scanResult.riskLevel,
      threats: scanResult.threats,
      requiresReview: scanResult.riskLevel === 'high' || scanResult.riskLevel === 'critical',
      autoAction
    }
  }

  private determineAutoAction(scanResult: ScanResult): 'none' | 'flag' | 'block' | 'delete' {
    if (scanResult.riskLevel === 'critical') return 'delete'
    if (scanResult.riskLevel === 'high') return 'block'
    if (scanResult.riskLevel === 'medium') return 'flag'
    return 'none'
  }
}

// Singleton instance
export const contentScanner = new ContentScanner()

// Helper function for React components
export async function scanContentSafety(content: string, type: string = 'general'): Promise<{
  isSafe: boolean
  message?: string
  riskLevel: string
}> {
  try {
    const result = await contentScanner.scanText(content, type)
    
    if (result.isClean) {
      return {
        isSafe: true,
        riskLevel: 'low'
      }
    }
    
    const criticalThreats = result.threats.filter(t => t.severity === 'critical')
    const highThreats = result.threats.filter(t => t.severity === 'high')
    
    if (criticalThreats.length > 0) {
      return {
        isSafe: false,
        message: 'Conteúdo contém ameaças graves e não pode ser publicado.',
        riskLevel: 'critical'
      }
    }
    
    if (highThreats.length > 0) {
      return {
        isSafe: false,
        message: 'Conteúdo contém linguagem inadequada que pode violar nossas diretrizes.',
        riskLevel: 'high'
      }
    }
    
    return {
      isSafe: false,
      message: 'Conteúdo requer revisão manual antes da publicação.',
      riskLevel: result.riskLevel
    }
  } catch (error) {
    console.error('Content scanning error:', error)
    return {
      isSafe: false,
      message: 'Erro na análise de conteúdo. Tente novamente.',
      riskLevel: 'medium'
    }
  }
}

// Hook for real-time content scanning in forms
export function useContentScanning() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResults, setScanResults] = useState<Map<string, ScanResult>>(new Map())
  
  const scanContent = async (content: string, id: string, type: string = 'general') => {
    setIsScanning(true)
    try {
      const result = await contentScanner.scanText(content, type)
      setScanResults(prev => new Map(prev).set(id, result))
      return result
    } catch (error) {
      console.error('Content scanning failed:', error)
      return null
    } finally {
      setIsScanning(false)
    }
  }
  
  const getScanResult = (id: string) => scanResults.get(id)
  
  const clearResults = () => setScanResults(new Map())
  
  return {
    isScanning,
    scanContent,
    getScanResult,
    clearResults
  }
}