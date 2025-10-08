// /schemas/index.ts

import topic from './topic';
import contentPage from './contentPage';
import outcome from './outcome';
import youtube from './objects/youtube';
import callout from './objects/callout';
import figure from './objects/figure'; // 👈 add this line for your new figure schema

export const schemaTypes = [
  topic,
  contentPage,
  outcome,
  youtube,
  callout,
  figure, // 👈 include new object schema
];
