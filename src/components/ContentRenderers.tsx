'use client';

import { PortableTextComponents } from '@portabletext/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { urlFor } from '@/lib/sanity.image';
import clsx from 'clsx';

// ...your existing variants/components (Figure, Callout, etc.)

function SimpleImage({ value }: any) {
  // value is a Sanity image object
  const lqip = value?.asset?.metadata?.lqip;
  const alt = value?.alt || '';
  const src = urlFor(value).width(1600).fit('max').url();

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className={clsx('my-6')}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="w-full h-auto rounded-xl shadow"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        sizes="(min-width:1024px) 800px, 100vw"
      />
    </motion.figure>
  );
}

export const components: PortableTextComponents = {
  // keep your existing mappings…
  types: {
    figure: Figure, // already present
    callout: Callout, // already present
    image: SimpleImage, // 👈 add this
  },
  // block/marks as you already have them
};
