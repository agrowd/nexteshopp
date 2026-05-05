import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.redirect(new URL('/app/settings/payments?error=no_code', request.url));
  }

  const session = await auth();
  const tenantId = session?.user?.tenantId;

  if (!tenantId) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }

  try {
    const mpClientId = process.env.MP_CLIENT_ID;
    const mpClientSecret = process.env.MP_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://app.localhost:3000'}/api/mp/callback`;

    if (!mpClientId || !mpClientSecret) {
      throw new Error('Faltan credenciales maestras de MP en el servidor');
    }

    // Intercambiar código por token
    const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: mpClientId,
        client_secret: mpClientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData.message || 'Error al obtener token de MP');
    }

    // Guardar token en el tenant
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        mpAccessToken: tokenData.access_token,
        mpUserId: tokenData.user_id?.toString()
      }
    });

    return NextResponse.redirect(new URL('/app/settings/payments?success=mp_connected', request.url));
    
  } catch (error) {
    console.error('MP Callback Error:', error);
    return NextResponse.redirect(new URL('/app/settings/payments?error=oauth_failed', request.url));
  }
}
