import vine, { Schema } from '@vinejs/vine'

/**
 * Validator for Ethereum wallet address
 */
export const walletAddressValidator = vine.compile(
  vine.object({
    address: vine
      .string({
        trim: true,
        escape: true,
        messages: {
          required: 'The wallet address is required',
          string: 'The wallet address must be a valid string',
        },
      })
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: 'Invalid Ethereum address format',
      }),
  })
)

export type WalletAddressSchema = vine.infer<typeof walletAddressValidator>
