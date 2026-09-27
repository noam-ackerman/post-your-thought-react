export function firebaseErrorCode(err: unknown): string | undefined {
  return (err as { code?: string } | undefined)?.code;
}
