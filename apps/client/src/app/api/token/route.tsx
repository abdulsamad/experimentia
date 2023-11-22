import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import axios from 'axios';

export async function GET() {
  try {
    const session = await getSession();

    if (!session?.user)
      return NextResponse.json(
        { succes: false, err: 'User is not authenticated' },
        { status: 400 }
      );

    const { data } = await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        grant_type: `client_credentials`,
        client_id: process.env.AUTH0_CLIENT_ID as string,
        client_secret: process.env.AUTH0_CLIENT_SECRET as string,
        audience: process.env.AUTH0_AUDIENCE,
      },
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      }
    );

    return NextResponse.json({ success: true, session, token: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, err }, { status: 500 });
  }
}
