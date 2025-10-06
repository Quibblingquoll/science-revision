'use client';

import { PortableTextComponents } from '@portabletext/react';
import { motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import clsx from 'clsx';
import { urlFor } from '@/lib/sanity.image';

/* ---------------------------------- */
/* Types shared by our renderers      */
/* ---------------------------------- */

type MaxWidth = 'narrow' | 'wide' | 'full';

// Local fallback type until Sanity re-exports it
type SanityImageSource = {
  _type?: string;
  asset?: {
    _ref?: string;
    _type?: string;
    metadata?: {
      lqip?: string;
    };
  };
};

interface FigureImage extends SanityImageSource {
  alt?: string;
  asset?: {
    metadata?: {
      lqip?: string;
    };
  };
}

interface FigureValue {
  _type: 'figure';
  image?: FigureImage | null;
  caption?: string;
  credit?: string;
  maxWidth?: MaxWidth;
}

type CalloutStyle = 'info' | 'tip' | 'warning';

interface CalloutValue {
  _type: 'callout';
  style?: CalloutStyle;
  text?: string;
}

interface SimpleImageProps {
  value: FigureImage;
}

/* ---------------------------------- */
/* Anim variants                      */
/* ---------------------------------- */

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

/* ---------------------------------- */
/* Figure (caption/credit/maxWidth)   */
/* ---------------------------------- */

function Figure({ value }: { value: FigureValue }) {
  const { image, caption, credit, maxWidth = 'wide' } = value || {};

  if (!image) return null;

  const widthClass =
    maxWidth === 'narrow' ? 'max-w-md' : maxWidth === 'full' ? 'max-w-none' : 'max-w-3xl';

  const lqip = image.asset?.metadata?.lqip;
  const alt = image.alt ?? caption ?? '';
  const src = urlFor(image).width(1600).fit('max').url();

  return (
    <motion.figure
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeIn}
      className={clsx('mx-auto my-8', widthClass)}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        className="rounded-xl shadow-md w-full h-auto"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        sizes="(min-width:1024px) 800px, 100vw"
      />
      {(caption || credit) && (
        <figcaption className="mt-2 text-sm text-neutral-500">
          {caption} {credit && <span className="italic">({credit})</span>}
        </figcaption>
      )}
    </motion.figure>
  );
}

/* ---------------------------------- */
/* Callout (info/tip/warning)         */
/* ---------------------------------- */

function Callout({ value }: { value: CalloutValue }) {
  const styles: Record<CalloutStyle, string> = {
    info: 'border-sky-300 bg-sky-50',
    tip: 'border-emerald-300 bg-emerald-50',
    warning: 'border-amber-300 bg-amber-50',
  };
  const variant: CalloutStyle = value?.style ?? 'info';

  return (
    <motion.aside
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={fadeIn}
      className={clsx('my-6 rounded-xl border p-4 text-sm leading-relaxed', styles[variant])}
    >
      {value?.text}
    </motion.aside>
  );
}

/* ---------------------------------- */
/* Simple inline image                */
/* ---------------------------------- */

function SimpleImage({ value }: SimpleImageProps) {
  const lqip = value.asset?.metadata?.lqip;
  const alt = value.alt || '';
  const src = urlFor(value).width(1600).fit('max').url();

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      className="my-6"
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

/* ---------------------------------- */
/* Portable Text components map       */
/* ---------------------------------- */

export const components: PortableTextComponents = {
  types: {
    figure: Figure,
    callout: Callout,
    image: SimpleImage,
  },
  block: {
    h2: ({ children }) => (
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="mt-12 scroll-mt-24 text-2xl font-semibold"
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children }) => (
      <motion.h3
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="mt-8 scroll-mt-24 text-xl font-semibold"
      >
        {children}
      </motion.h3>
    ),
    normal: ({ children }) => (
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
      >
        {children}
      </motion.p>
    ),
  },
};
