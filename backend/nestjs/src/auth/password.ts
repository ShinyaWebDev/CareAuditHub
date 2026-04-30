import { timingSafeEqual, scryptSync } from 'node:crypto'

const KEY_LENGTH = 32

export function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, salt, expected] = passwordHash.split(':')

  if (algorithm !== 'scrypt' || !salt || !expected) {
    return false
  }

  const actual = scryptSync(password, salt, KEY_LENGTH)
  const expectedBuffer = Buffer.from(expected, 'hex')

  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer)
}
