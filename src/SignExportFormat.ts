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
