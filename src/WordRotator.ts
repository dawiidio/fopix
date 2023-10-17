import { FontManager } from '~/FontManager';
import { getDefaultFont } from '~/defaultFont';
import { Vector2 } from 'three';
import { randomNumberInRange, RenderOptions, shuffleArray } from '~/utils';
import { Word } from '~/Word';
import { VisualizationWorld } from '~/VisualizationWorld';

export interface WordRotatorOptions {
    x: number,
    y: number,
    particleSize: number
    letterSpacing: number
    renderOptions: RenderOptions
    font: FontManager
}

export const defaultWordOptions: WordRotatorOptions = {
    x: 0,
    y: 0,
    particleSize: 10,
    letterSpacing: 5,
    renderOptions: {
        color: 0x000000,
    },
    font: getDefaultFont(),
};

export class WordRotator {
    private activeWord: Word | null = null;
    public readonly options: WordRotatorOptions;

    constructor(
        public visualizationWorld: VisualizationWorld,
        options: Partial<WordRotatorOptions> = {},
    ) {
        this.options = {
            ...defaultWordOptions,
            ...options,
        };
    }

    private getMissedParticlesNumber(word: Word): number {
        return Math.max(0, word.boxesSize - this.visualizationWorld.objects.length);
    }

    private maybeCreateMissedParticles() {
        if (!this.activeWord)
            return;

        const missed = this.getMissedParticlesNumber(this.activeWord);

        if (missed <= 0)
            return;

        this.createParticles(missed);
    }

    private createParticles(counter: number) {
        for (let i = 0; i < counter; ++i) {
            this.visualizationWorld.createParticle(
                this.options.x,
                this.options.y,
                this.options.particleSize,
                this.options.particleSize,
                {
                    particleOptions: {
                        mass: 0.1,
                    },
                    renderOptions: { ...this.options.renderOptions },
                },
            );
        }
    }

    setWord(word: Word) {
        this.activeWord = word;

        if (this.activeWord === null)
            return;

        this.maybeCreateMissedParticles();

        const { objects, options: { renderer } } = this.visualizationWorld;

        this.activeWord.position = {
            x: (renderer.options.width / 2) - (this.activeWord.width / 2),
            y: (renderer.options.height / 2) - (this.activeWord.height / 2),
        };

        for (let i = 0; i < objects.length; ++i) {
            const box = i < this.activeWord.boxesSize
                ? this.activeWord.boxes[i]
                : shuffleArray(this.activeWord.boxes);
            const object = objects[i];
            const particle = object.particle;

            object.renderOptions.color = box.color;
            particle.mass = 0.1;
            particle.motionMode = 'linearApproach';
            particle.setDestination(new Vector2(box.x, box.y));
        }
    }

    free() {
        const {
            objects, options: {
                renderer: {
                    options: {
                        width, height,
                    },
                },
            },
        } = this.visualizationWorld;
        const dest = new Vector2(width / 2, height / 2);

        for (let i = 0; i < objects.length; ++i) {
            const object = objects[i];
            const particle = object.particle;

            object.renderOptions.color = 0;
            particle.mass = randomNumberInRange(1, 5);
            particle.motionMode = 'forces';
            particle.setDestination(dest);
        }
    }
}
