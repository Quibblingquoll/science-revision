import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';

export async function GET() {
  const query = `*[_type == "subject"][0...5]{_id, title}`;
  const data = await client.fetch(query);
  return NextResponse.json(data);
}
