import vine from '@vinejs/vine'

interface CurrencySchema {
  currency: string
}

enum AvailableCurrencies {
  ETH = 'ETH',
  BTC = 'BTC',
  LTC = 'LTC',
  // Add other currencies as needed
}

export const currencyValidator = vine.compile<CurrencySchema>(
  vine.object({
    currency: vine.enum(AvailableCurrencies).string({
      messages: {
        required: 'This currency is not supported',
        enum: 'The currency must be one of the available types',
      },
    }),
  })
)

export type { CurrencySchema }
