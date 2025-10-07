// /schemas/index.ts

import topic from './topic';
import contentPage from './contentPage';
import outcome from './outcome';
import youtube from './objects/youtube';
import callout from './objects/callout';
import figure from './objects/figure';

// 👇 ADD THIS
//import crosswordIpuz from './objects/crosswordIpuz';

export const schemaTypes = [
  topic,
  contentPage,
  outcome,
  youtube,
  callout,
  figure,

  // 👇 ADD THIS
  // crosswordIpuz,
];
