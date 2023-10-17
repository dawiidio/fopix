import { VisualizationRenderer } from '~/VisualizationRenderer';
import { VisualizationWorld } from '~/VisualizationWorld';
import { ParticleSystem } from '~/engine/ParticleSystem';
import { Mouse } from '~/engine/Mouse';
import {
    VisualizationStateManager,
    VisualizationStateManagerSectionType,
} from '~/VisualizationStateManager';
import { Runner } from '~/engine/Runner';
import { SignExportFormat } from '~/SignExportFormat';

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

const defaultResizeFn: ResizeFn = (width, height, visualizationRenderer) => {
    visualizationRenderer.resizeToDisplaySize();
}

export function createFopix({
                                        container,
                                        sections,
                                        letterSpacing = 5,
                                        size = 12,
                                        backgroundColor = 0xffffffff,
                                        color = 0x000000,
                                        debug = false,
                                        width: userWidth,
                                        height: userHeight,
                                        resizeFn = defaultResizeFn,
                                    }: CreateFopixOptions): FopixApi {
    const { width, height } = (userHeight && userWidth)
        ? ({ width: userWidth, height: userHeight })
        : container.getBoundingClientRect();

    const visualizationRenderer = new VisualizationRenderer({
        container,
        height,
        width,
        backgroundColor,
        debug,
    });

    const visualizationWorld = new VisualizationWorld({
        physicsEngine: new ParticleSystem(
            new Mouse(container),
        ),
        renderer: visualizationRenderer,
    });

    const visualizationStateManager = new VisualizationStateManager(
        visualizationWorld,
        {
            particleSize: size,
            letterSpacing,
            renderOptions: {
                color,
            },
        },
    );

    // @ts-ignore
    sections.forEach(d => visualizationStateManager.addSection(d.type, d.text));

    const runner = new Runner();

    runner.on('beforeTick', () => {
        visualizationWorld.update();
    });

    runner.on('tick', () => {
        visualizationWorld.render();
    });

    return {
        stop: () => {
            runner.stop();
            visualizationWorld.destroy();
        },
        pause: () => {
            runner.stop();
        },
        start: () => {
            runner.start();
        },
        tick: () => {
            runner.tick(document.timeline.currentTime as number);
        },
        next: () => {
            visualizationStateManager.next();
        },
        isFree() {
            return visualizationStateManager.free;
        },
        resize: (width: number, height: number) => {
            resizeFn(width, height, visualizationRenderer);
        },
        on(ev: string, listener: (data: any) => void) {
            return visualizationStateManager.on(ev, listener);
        },
    };
}
