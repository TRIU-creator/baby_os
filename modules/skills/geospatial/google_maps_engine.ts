export interface RoutePoint {
  lat: number;
  lng: number;
}

export function routeDistanceKm(points: RoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].lat - points[i - 1].lat;
    const dy = points[i].lng - points[i - 1].lng;
    total += Math.sqrt(dx * dx + dy * dy) * 111;
  }
  return total;
}
