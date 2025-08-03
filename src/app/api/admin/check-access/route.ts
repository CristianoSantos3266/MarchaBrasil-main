import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userId } = await request.json();

    // Get admin email from environment variable (server-side only)
    const adminEmail = process.env.ADMIN_EMAIL;

    // Validate required data
    if (!userEmail || !userId) {
      return NextResponse.json(
        { 
          authorized: false, 
          error: 'Dados de usuário incompletos' 
        },
        { status: 400 }
      );
    }

    // Check if admin email is configured
    if (!adminEmail) {
      console.error('ADMIN_EMAIL environment variable not configured');
      return NextResponse.json(
        { 
          authorized: false, 
          error: 'Configuração de admin não encontrada' 
        },
        { status: 500 }
      );
    }

    // Check if user email matches admin email (case-insensitive)
    const isAuthorized = userEmail.toLowerCase() === adminEmail.toLowerCase();

    if (isAuthorized) {
      console.log(`✅ Admin access granted to ${userEmail}`);
      return NextResponse.json({
        authorized: true,
        message: 'Acesso autorizado'
      });
    } else {
      console.log(`❌ Admin access denied to ${userEmail} (expected: ${adminEmail})`);
      return NextResponse.json(
        { 
          authorized: false, 
          error: 'Email não autorizado para acesso administrativo' 
        },
        { status: 403 }
      );
    }

  } catch (error) {
    console.error('Error in admin access check:', error);
    return NextResponse.json(
      { 
        authorized: false, 
        error: 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}

// Block other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}