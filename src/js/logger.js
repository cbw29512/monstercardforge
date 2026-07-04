export function logError(context, error) {
  console.error(`[MonsterCardForge] ${context}`, error);
}

export function safeRender(context, fallback, renderer) {
  try {
    return renderer();
  } catch (error) {
    logError(context, error);
    return fallback;
  }
}
