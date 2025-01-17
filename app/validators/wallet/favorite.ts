import vine from '@vinejs/vine'

export const favoriteUpdateValidator = vine.compile(
  vine.object({
    address: vine.string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: 'Invalid Ethereum address format'
      }),
    label: vine.string()
      .minLength(1)
      .maxLength(50)
  })
)