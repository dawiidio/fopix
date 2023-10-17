import { FontManager } from '~/FontManager';
import { LetterBox } from '~/LetterBox';
import { createLetter, Letter } from '~/Letter';
import { Vector2Options } from '~/utils';

export interface WordOptions {
    x: number;
    y: number;
}

export class Word {
    public readonly boxesSize: number;
    public boxes: LetterBox[] = [];
    private _position: Vector2Options;

    constructor(
        public readonly letters: Letter[],
        public readonly options: WordOptions,
    ) {
        let lastX: number = this.options.x;
        let lastY: number = this.options.y;

        for (const letter of letters) {
            letter.update({
                x: lastX,
                y: lastY,
            });

            lastX = lastX + letter.width;
        }

        this.boxesSize = this.letters.reduce((acc, val) => {
            this.boxes = [
                ...this.boxes,
                ...val.letterBoxes.boxes,
            ];

            return acc + val.size;
        }, 0);

        this._position = {
            x: this.options.x,
            y: this.options.y,
        };
    }

    get lettersSize(): number {
        return this.letters.length;
    }

    get position(): Vector2Options {
        return this._position;
    }

    get width(): number {
        return this.letters.reduce((acc, l) => acc + l.width, 0);
    }

    get height(): number {
        return Math.max(...this.letters.map(l => l.height));
    }

    set position(vec: Vector2Options) {
        let x: number = vec.x;
        let y: number = vec.y;

        for (const letter of this.letters) {
            letter.position = { x, y };
            x = x + letter.width;
        }

        this._position = vec;
    }
}

export interface CreateWordOptions {
    x: number;
    y: number;
    font: FontManager;
    letterSpacing?: number;
    size?: number;
    color?: number;
    boxSpacing?: number;
}

export function createWord(word: string, options: CreateWordOptions): Word {
    const wordChars = word.toUpperCase().split('');

    const letters = wordChars.map(char => createLetter({
        x: options.x,
        y: options.y,
        letter: char,
        boxSpacing: options.boxSpacing,
        color: options.color || 0x000000,
        boxSize: options.size,
        margin: {
            left: options.letterSpacing,
            right: options.letterSpacing,
        },
        font: options.font,
    }));

    return new Word(letters, options);
}
