import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '93f80h7a',
    dataset: 'production',
  },
  /* Lets `sanity deploy` host the studio for free at <something>.sanity.studio */
  studioHost: 'magnus-realtors',
  deployment: {
    appId: 'xduecf1iyy09d4jhqo1pas7i',
  },
  autoUpdates: true,
})
