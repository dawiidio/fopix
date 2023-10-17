import { FontManager } from '~/FontManager';

export interface LetterBox {
    x: number;
    y: number;
    size: number;
    spacing: number;
    row: number;
    column: number;
    color: number;
}

export interface CreateLetterBoxesArgs {
    letter: string,
    x: number,
    y: number,
    font: FontManager
    boxSize?: number,
    boxSpacing?: number
    color?: number
}

export interface LetterBoxes {
    boxes: LetterBox[];
    width: number;
    height: number;
    boxSize: number;
    boxSpacing: number;
}

export function createLetterBoxes({
                                      font,
                                      letter,
                                      x,
                                      y,
                                      boxSize = 10,
                                      boxSpacing = 0,
                                      color = 0x000000,
                                  }: CreateLetterBoxesArgs): LetterBoxes {
    const matrix = font.getCharacterMatrix(letter);
    const boxes: LetterBox[] = [];

    for (let i = 0; i < matrix.length; ++i) {
        const row = matrix[i];

        for (let j = 0; j < row.length; ++j) {
            if (!row[j]) continue;

            boxes.push({
                x: x + j * (boxSize + boxSpacing),
                y: y + i * (boxSize + boxSpacing),
                size: boxSize,
                spacing: boxSpacing,
                row: i,
                column: j,
                color,
            });
        }
    }

    return {
        boxes,
        height: matrix.length,
        width: matrix[0].length,
        boxSize,
        boxSpacing,
    };
}
