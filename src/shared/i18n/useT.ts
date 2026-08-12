import { useContext } from 'react'
import { LocaleContext, type LocaleContextValue } from './locale-context'

/** Tarjima funksiyasi va joriy til. */
export function useT(): LocaleContextValue {
    const context = useContext(LocaleContext)
    if (!context) throw new Error('useT must be used inside <LocaleProvider>')
    return context
}
