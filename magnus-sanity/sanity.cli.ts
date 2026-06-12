import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '93f80h7a',
    dataset: 'production',
  },
  /* Lets `sanity deploy` host the studio for free at <something>.sanity.studio */
  studioHost: 'magnus-realtors',
  autoUpdates: true,
})
