import vine from '@vinejs/vine'
import { AvailableCurrencies } from '#types/currency_enum'

/**
 * Validator for currency
 */
interface CurrencySchema {
  currency: string
}

export const currencyValidator = vine.compile<CurrencySchema>(
  vine.object({
    currency: vine.enum(AvailableCurrencies, {
      messages: {
        required: 'This currency is required',
        enum: 'The currency must be one of the available types',
      },
    }),
  })
)

export type { CurrencySchema }
