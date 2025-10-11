'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';

// Structured single-bank Cloze
import ClozeBlock, { type ClozeBlockProps } from '@/components/ClozeBlock';
// Paste-once Cloze (parses [brackets])
import ClozePasteBlock, { type ClozePasteBlockProps } from '@/components/ClozePasteBlock';

const components: PortableTextComponents = {
  types: {
    clozeBlock: ({ value }: { value: ClozeBlockProps }) => <ClozeBlock {...value} />,
    clozePasteBlock: ({ value }: { value: ClozePasteBlockProps }) => <ClozePasteBlock {...value} />,
  },
};

type CustomObject = { _type: string; [key: string]: unknown };

interface PortableBodyProps {
  // Allow standard blocks plus custom objects
  value: (PortableTextBlock | CustomObject)[];
}

export default function PortableBody({ value }: PortableBodyProps) {
  return (
    <PortableText
      // Cast because @portabletext/react’s value type is narrower than our union
      value={value as unknown as PortableTextBlock[]}
      components={components}
    />
  );
}
