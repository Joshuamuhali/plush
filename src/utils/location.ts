export function extractCity(location: string): string {
  // Simple extraction - improve based on your location format
  const parts = location.split(',');
  return parts[parts.length - 1]?.trim() || location;
}
