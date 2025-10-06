import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity.client';

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return NextResponse.json(
      { ok: false, reason: 'Missing envs', projectId, dataset },
      { status: 500 }
    );
  }

  // simple ping query
  const topics = await client.fetch<number>(`count(*[_type == "topic"])`);
  return NextResponse.json({ ok: true, projectId, dataset, topics });
}
