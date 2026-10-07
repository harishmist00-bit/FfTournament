/** Standard BR scoring: placement table + 1 point per kill. Mirror this in Django. */
export const PLACEMENT_POINTS: Record<number, number> = { 1: 12, 2: 9, 3: 8, 4: 7, 5: 6, 6: 5, 7: 4, 8: 3, 9: 2, 10: 1 };
export const KILL_POINT = 1;
export const placementPoints = (placement: number): number => PLACEMENT_POINTS[placement] ?? 0;
export const killPoints = (kills: number): number => kills * KILL_POINT;
export const totalPoints = (placement: number, kills: number): number => placementPoints(placement) + killPoints(kills);
