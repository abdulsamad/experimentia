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
      'https://abdulsamad.us.auth0.com/oauth/token',
      {
        grant_type: `client_credentials`,
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `http://experimentia.api.com`,
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
