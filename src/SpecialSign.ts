import { ILetter, Letter } from '~/Letter';
import { CreateLetterBoxesArgs, LetterBox, LetterBoxes } from '~/LetterBox';
import { SignExportFormat } from '~/SignExportFormat';
import { Word } from '~/Word';

export class SpecialSign extends Letter implements ILetter {

}

interface CreateSpecialSignBoxesSettings {
    sign: SignExportFormat,
    x: number,
    y: number,
    boxSpacing?: number
}

export function createSpecialSignBoxes({
                                           sign,
                                           x,
                                           y,
                                           boxSpacing = 0,
                                       }: CreateSpecialSignBoxesSettings): LetterBoxes {
    const {
        particles,
    } = sign;
    let smallestRow: number = -1;
    let biggestRow: number = -1;
    let smallestCol: number = -1;
    let biggestCol: number = -1;
    let boxSize: number = -1;

    const boxes: LetterBox[] = particles
        .map(({ color, row, column, size }) => {
            smallestRow = smallestRow === -1 || row < smallestRow ? row : smallestRow;
            biggestRow = biggestRow === -1 || row > biggestRow ? row : biggestRow;
            smallestCol = smallestCol === -1 || column < smallestCol ? column : smallestCol;
            biggestCol = biggestCol === -1 || column > biggestCol ? column : biggestCol;
            boxSize = size;

            return {
                color, row, column, size,
            };
        })
        .map<LetterBox>(({ color, row, column, size }) => {
            return {
                row: column - smallestCol,
                column: row - smallestRow,
                x: x + (row - smallestRow) * (size + boxSpacing),
                y: y + (column - smallestCol) * (size + boxSpacing),
                color,
                size,
                spacing: boxSpacing,
            };
        });

    return {
        boxes,
        height: (biggestCol - smallestCol),
        width: (biggestRow - smallestRow),
        boxSize,
        boxSpacing,
    };
}

interface CreateSpecialSign extends Omit<CreateLetterBoxesArgs, 'letter' | 'font'> {
    margin?: {
        top?: number
        right?: number
        bottom?: number
        left?: number
    };
    sign: SignExportFormat,
}

export const createSpecialSign = (createSpecialSignSettings: CreateSpecialSign) => {
    const letterBoxes = createSpecialSignBoxes(createSpecialSignSettings);

    return new SpecialSign(letterBoxes, {
        x: createSpecialSignSettings.x,
        y: createSpecialSignSettings.y,
        margin: createSpecialSignSettings.margin,
    });
};

export const createSpecialSignWord = (createSpecialSignSettings: CreateSpecialSign): Word => {
    return new Word([createSpecialSign(createSpecialSignSettings)], {
        ...createSpecialSignSettings,
    });
};

export const isSpecialSign = (sign: SignExportFormat | string): sign is SignExportFormat => typeof sign !== 'string';
