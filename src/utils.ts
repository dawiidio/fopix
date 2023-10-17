export interface Vector2Options {
    x: number;
    y: number;
}

export interface RenderOptions {
    color?: number;
    opacity?: number;
}

export interface Point2D {
    x: number;
    y: number;
}

export const getNumberOrFallback = (val: number | undefined, fallback: number): number =>
    typeof val !== 'undefined' ? val : fallback;

export const randomNumberInRange = (min: number, max: number) => Math.round(min + (Math.random() * (max - min)));

export function shuffleArray<T>(arr: Array<T>): T {
    return arr[randomNumberInRange(0, arr.length - 1)];
}

