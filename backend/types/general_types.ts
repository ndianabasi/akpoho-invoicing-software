export type SanitiserConfig = {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  allowedIframeHostnames?: string[]
}
export interface SanitiseHTML {
  (input?: string, config?: SanitiserConfig): string
}
