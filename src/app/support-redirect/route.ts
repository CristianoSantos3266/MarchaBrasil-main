import { NextResponse } from 'next/server';
import { APOIAR_URL } from '@/lib/links';

export async function GET() {
  return NextResponse.redirect(new URL(APOIAR_URL, process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'), {
    status: 302
  });
}