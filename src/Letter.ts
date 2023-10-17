import { RenderOptions, Vector2Options } from '~/utils';
import { createLetterBoxes, CreateLetterBoxesArgs, LetterBox, LetterBoxes } from '~/LetterBox';
import { FontManager } from '~/FontManager';

export interface ILetter {
    boxes: LetterBox[];
    boxWidth: number;
    boxHeight: number;
    size: number;
    position: Vector2Options;
    width: number;
    height: number;

    update(options: LetterArgs): void;
}

export interface LetterArgs {
    x: number;
    y: number;
    renderOptions?: RenderOptions;
    margin?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    };
}

export class Letter implements ILetter {
    public boxes: LetterBox[];
    protected _position: Vector2Options;

    constructor(public letterBoxes: LetterBoxes, public options: LetterArgs) {
        this.boxes = this.letterBoxes.boxes;
        this._position = {
            x: this.options.x,
            y: this.options.y,
        };
    }

    update(options: LetterArgs) {
        this.options = {
            ...this.options,
            ...options
        };
        this._position = {
            x: this.options.x,
            y: this.options.y,
        };
    }

    get boxWidth(): number {
        return this.letterBoxes.width;
    }

    get boxHeight(): number {
        return this.letterBoxes.height;
    }

    get size() {
        return this.letterBoxes.boxes.length;
    }

    get position(): Vector2Options {
        return this._position;
    }

    set position(vec: Vector2Options) {
        this.recalculateLetterBoxesPositions(vec);

        this._position = vec;
    }

    get width(): number {
        const {
            width, boxSize, boxSpacing,
        } = this.letterBoxes;
        const {
            left = 0,
            right = 0,
        } = this.options.margin || {};

        return width * (boxSize + boxSpacing) + left + right;
    }

    get height(): number {
        const {
            height, boxSize, boxSpacing,
        } = this.letterBoxes;
        const {
            bottom = 0,
            top = 0,
        } = this.options.margin || {};

        return height * (boxSize + boxSpacing) + bottom + top;
    }

    protected recalculateLetterBoxesPositions(vec: Vector2Options) {
        this.boxes.forEach(b => {
            b.x = vec.x + b.column * (b.size + b.spacing);
            b.y = vec.y + b.row * (b.size + b.spacing);
        });
    }
}

export interface CreateLetterArgs extends CreateLetterBoxesArgs {
    margin?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    };
    color?: number;
    letter: string,
    font: FontManager
    boxSize?: number,
    boxSpacing?: number
}

export function createLetter(createLetterShapesArgs: CreateLetterArgs): Letter {
    const letterBoxes = createLetterBoxes(createLetterShapesArgs);

    return new Letter(letterBoxes, {
        x: createLetterShapesArgs.x,
        y: createLetterShapesArgs.y,
        margin: createLetterShapesArgs.margin,
        renderOptions: {
            color: createLetterShapesArgs.color,
        },
    });
}
