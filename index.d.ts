import type { Camera, Scene, WebGLRenderer, Mesh, Line, Object3D } from 'three';

export interface RenderOptions {
    color?: number;
    opacity?: number;
}

export type VisualizationStateManagerSectionType = 'words' | 'tags' | 'sign';

interface VisualizationRenderer {
    renderer: WebGLRenderer;
    camera: Camera;
    scene: Scene;

    circle(x: number, y: number, radius: number, options: RenderOptions): Mesh
    rectangle(x: number, y: number, width: number, height: number, options: RenderOptions): Mesh
    line(x1: number, y1: number, x2: number, y2: number, linewidth: number, options: RenderOptions): Line
    render(): void;
    remove(...objects: Object3D[]): void;
    destroy(): void;
    resizeToDisplaySize(): boolean;
}

export interface SignParticleExportFormat {
    row: number;
    column: number;
    color: number;
    size: number;
}

export interface SignExportFormat {
    size: {
        width: number
        height: number
    };
    manhattanSize: {
        columns: number
        rows: number
    };
    particleSize: number;
    particles: SignParticleExportFormat[]
}

export interface FopixApi {
    isFree(): boolean;

    stop(): void;

    pause(): void;

    start(): void;

    tick(): void;

    next(): void;

    on(ev: string, listener: (data: any) => void): (() => void);

    resize(width: number, height: number): void;
}

export interface SectionData {
    type: VisualizationStateManagerSectionType;
    text: (string | SignExportFormat)[];
}

export type ResizeFn = ((width: number, height: number, visualizationRenderer: VisualizationRenderer) => void);

export interface CreateFopixOptions {
    container: HTMLElement;
    sections: SectionData[];
    backgroundColor?: number;
    size?: number;
    letterSpacing?: number;
    color?: number;
    width?: number;
    height?: number;
    debug?: boolean;
    resizeFn?: ResizeFn
}

export function createFopix(options: CreateFopixOptions): FopixApi;