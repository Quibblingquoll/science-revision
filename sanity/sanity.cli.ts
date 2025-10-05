import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'm1eg7dpg', // ← your project ID
    dataset: 'production', // ← your dataset
  },
  // You can also add: studioHost: 'science-revision'  // optional custom domain
});
