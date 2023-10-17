import { defaultWordOptions, WordRotator, WordRotatorOptions } from '~/WordRotator';
import { createWord, Word } from '~/Word';
import { VisualizationWorld } from '~/VisualizationWorld';
import { createSpecialSignWord, isSpecialSign } from '~/SpecialSign';
import { SignExportFormat } from '~/SignExportFormat';
import { EventEmitter } from '~/engine/utils';

export interface VisualizationStateManagerOptions extends WordRotatorOptions {
    loop?: boolean
}

export type VisualizationStateManagerSectionType = 'words' | 'tags' | 'sign';

class VisualizationStateManagerSection {
    private activeWord: Word | null = null;
    private usedWords: Word[] = [];

    constructor(
        public type: VisualizationStateManagerSectionType,
        private words: Word[],
    ) {
    }

    next() {
        this.activeWord = this.words.shift() as Word;
        this.usedWords.push(this.activeWord);

        return this.activeWord;
    }

    isFinished(): boolean {
        return !this.words.length;
    }

    reset() {
        this.words = this.usedWords;
        this.usedWords = [];
    }
}

export class VisualizationStateManager extends EventEmitter {
    private readonly wordRotator: WordRotator;
    private sections: VisualizationStateManagerSection[] = [];
    private finishedSections: VisualizationStateManagerSection[] = [];
    private activeSection: VisualizationStateManagerSection | null = null;
    private tagsCounters = new WeakMap<VisualizationStateManagerSection, number>();
    public readonly options: VisualizationStateManagerOptions;
    public free: boolean = false;

    constructor(
        public visualizationWorld: VisualizationWorld,
        options: Partial<VisualizationStateManagerOptions> = {},
    ) {
        super();
        this.options = {
            ...defaultWordOptions,
            ...options,
        };

        this.wordRotator = new WordRotator(this.visualizationWorld, this.options);
    }

    private mapToWord = (word: string) => createWord(word, {
        size: this.options.particleSize,
        color: this.options.renderOptions.color,
        font: this.options.font,
        x: this.options.x,
        y: this.options.y,
        letterSpacing: this.options.letterSpacing,
    });

    private mapToSignWord = (sign: SignExportFormat) => createSpecialSignWord({
        x: this.options.x,
        y: this.options.y,
        sign,
    });

    addSection(type: 'sign', words: SignExportFormat[]): void;
    addSection(type: 'words', words: string[]): void;
    addSection(type: 'tags', words: string[]): void;
    addSection(type: VisualizationStateManagerSectionType, words: string[] | SignExportFormat[]): void {
        this.sections.push(new VisualizationStateManagerSection(type, words.map(w => {
            if (type === 'sign' && isSpecialSign(w)) {
                return this.mapToSignWord(w);
            }

            return this.mapToWord(w as string);
        })));
    }

    next() {
        if (!this.activeSection) {
            this.activeSection = this.sections.shift() as VisualizationStateManagerSection;
        }

        if (!this.sections.length && this.activeSection.isFinished()) {
            this.trigger('finish', {});

            if (!this.options.loop)
                return;

            this.finishedSections.push(this.activeSection);
            this.sections = this.finishedSections;
            this.sections.forEach(s => {
                s.reset();
                this.tagsCounters.set(s, 0);
            });
            this.finishedSections = [];
            this.activeSection = this.sections.shift() as VisualizationStateManagerSection;
        } else if (this.sections.length && this.activeSection.isFinished()) {
            this.finishedSections.push(this.activeSection);
            this.activeSection = this.sections.shift() as VisualizationStateManagerSection;
        }

        if (this.activeSection.type === 'words' || this.activeSection.type === 'sign') {
            this.wordRotator.setWord(this.activeSection.next());
            this.free = false;
        } else {
            if (!this.tagsCounters.has(this.activeSection)) {
                this.tagsCounters.set(this.activeSection, 0);
            }

            const counter = this.tagsCounters.get(this.activeSection) || 0;

            if (counter % 2) {
                this.wordRotator.setWord(this.activeSection.next());
                this.free = false;
            } else {
                this.wordRotator.free();
                this.free = true;
            }

            this.tagsCounters.set(this.activeSection, counter + 1);
        }
    }
}
