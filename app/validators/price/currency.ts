import vine from '@vinejs/vine'
import { AvailableCurrencies } from '#types/currency'

/**
 * Validator for currency
 */
export const currencyValidator = vine.compile(
  vine.object({
    currency: vine.enum(Object.values(AvailableCurrencies), {
      messages: {
        required: 'This currency is not supported',
        enum: 'The currency must be one of the available types',
      },
    }),
  })
)

export type CurrencySchema = vine.infer<typeof currencyValidator>
