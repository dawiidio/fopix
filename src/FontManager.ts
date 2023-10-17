export interface Character {
    char: string;
    matrix: Array<Array<number>>;
}

export class FontManager {
    private characters = new Map<string, Array<Array<number>>>();

    constructor(chars: Character[] = []) {
        this.registerCharacters(chars);
    }

    registerCharacter(char: string, arr: Array<Array<number>>) {
        return this.characters.set(char, arr);
    }

    registerCharacters(chars: Character[]) {
        chars.forEach(c => this.registerCharacter(c.char, c.matrix));
    }

    removeCharacter(char: string) {
        return this.characters.delete(char);
    }

    getCharacterMatrix(char: string): Array<Array<number>> {
        const m = this.characters.get(char);

        if (!m) {
            throw new Error(`Unknown char: ${char}`);
        }

        return m;
    }

    clear() {
        this.characters.clear();
    }
}
