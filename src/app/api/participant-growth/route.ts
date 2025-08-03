import { NextRequest, NextResponse } from 'next/server';
import { ParticipantGrowthService } from '@/lib/participantGrowth';

export async function POST(request: NextRequest) {
  try {
    // Verificar se é uma chamada autorizada (opcionalmente com chave de API)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'default-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Processar crescimento para todos os eventos
    await ParticipantGrowthService.processGrowthForAllEvents();

    return NextResponse.json({
      success: true,
      message: 'Participant growth processed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in participant growth API:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Permitir GET para teste manual
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testMode = searchParams.get('test') === 'true';
    
    if (testMode) {
      await ParticipantGrowthService.processGrowthForAllEvents();
      
      return NextResponse.json({
        success: true,
        message: 'Test run completed',
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      message: 'Participant Growth API is running',
      usage: 'POST to trigger growth processing',
      test: 'Add ?test=true to GET for manual test'
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Error in test mode' },
      { status: 500 }
    );
  }
}