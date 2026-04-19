export type PlaceholderKind = 'clinic' | 'service' | 'blog' | 'user' | 'gallery';

/**
 * Повертає шлях до нейтрального SVG-плейсхолдера.
 * Використовуємо у `<img>` для пустих / відсутніх зображень і як `onError` fallback.
 */
export function getPlaceholder(kind: PlaceholderKind): string {
  return `/placeholders/${kind}.svg`;
}

/**
 * Синхронний helper для `onError` у `<img>`: замінює src на плейсхолдер.
 */
export function onImgError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  kind: PlaceholderKind,
): void {
  const target = e.currentTarget;
  const fallback = getPlaceholder(kind);
  if (target.src.endsWith(fallback)) return;
  target.src = fallback;
}
