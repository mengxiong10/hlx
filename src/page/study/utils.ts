export function formatText(text: string) {
  return text.replace(/_/g, ' ').replace(/¦/g, '');
}
