export function useNotifyAction() {
  const { t } = useI18n()
  const { notify } = useNotify()

  const withNotify = async <T>(
    action: () => Promise<T>,
    options?: {
      successContent?: string
      errorContent?: string
      rethrow?: boolean
    }
  ): Promise<T | undefined> => {
    try {
      const result = await action()

      if (options?.successContent) {
        notify({
          state: 'success',
          title: t('common.api.success-title'),
          content: options.successContent,
        })
      }

      return result
    } catch (error) {
      notify({
        state: 'error',
        title: t('common.api.error-title'),
        content: options?.errorContent,
      })

      if (options?.rethrow) throw error
    }
  }

  return {
    withNotify,
  }
}
