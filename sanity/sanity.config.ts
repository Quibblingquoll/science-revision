import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas'; // <-- changed to named import

// ✅ Resolve environment variables (with safe fallbacks)
const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID || 'm1eg7dpg';
const dataset = import.meta.env.SANITY_STUDIO_DATASET || 'production';

// 🧠 Log helpful info in development
if (process.env.NODE_ENV === 'development') {
  console.log(`🧩 Using Sanity project: ${projectId}, dataset: ${dataset}`);
}

// 🚨 Validate only if empty after fallback
if (!projectId || !dataset) {
  throw new Error(
    'Sanity configuration is missing projectId or dataset.\n' +
      '→ Check your sanity/.env.local file for SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET.'
  );
}

export default defineConfig({
  name: 'science-revision-studio',
  title: 'Science Revision',

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(), // Enables GROQ queries inside Studio
  ],

  schema: { types: schemaTypes }, // <-- changed here too
});
