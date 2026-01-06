import frFR from './fr-fr'

export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  locale: 'fr',
  missingWarn: false,
  messages: {
    'fr': frFR
  }
}))
