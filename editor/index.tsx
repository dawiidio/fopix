import React, { FunctionComponent, useEffect, useState, MouseEvent, useRef } from 'react';
import { VisualizationRenderer } from '~/VisualizationRenderer';
import { VisualizationWorld, WorldObject } from '~/VisualizationWorld';
import { ParticleSystem } from '~/engine/ParticleSystem';
import { Mouse } from '~/engine/Mouse';
import { createRoot } from 'react-dom/client';

interface PixelInfo {
    column: number;
    row: number;
    color: number;
    size: number;
}

interface Pixel extends PixelInfo {
    object: WorldObject;
}

interface ManhattanSize {
    rows: number;
    columns: number;
}

interface Size {
    width: number;
    height: number;
}

interface PixelsExportFormat {
    size: Size;
    particleSize: number;
    manhattanSize: ManhattanSize;
    particles: PixelInfo[];
}

const getPixelKey = (row: number, column: number): string => `${row},${column}`;

interface HistoryEntry {
    action: 'add' | 'remove';
    pixels: Pixel[];
}

const useHistory = () => {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [lastPop, setLastPop] = useState<HistoryEntry>();

    return {
        history,
        lastPop,
        push: (pixels: Pixel[], action: 'add' | 'remove' = 'add') => {
            console.log(pixels);

            if (!pixels.length)
                return;

            setHistory((val) => ([
                ...val,
                {
                    action,
                    pixels,
                },
            ]));
            setLastPop(undefined);
        },
        pop: () => {
            if (!history.length)
                return;

            const popped = history.slice(0, -1);

            setLastPop(history[history.length - 1]);
            setHistory(popped);

            return history[history.length - 1];
        },
        popDone: () => setLastPop(undefined),
    };
};

export const App: FunctionComponent = ({}) => {
    const [element, setElement] = useState<HTMLElement | null>();
    const [color, setColor] = useState<number>(0x000000);
    const [visualization, setVisualization] = useState<{
        world: VisualizationWorld,
        renderer: VisualizationRenderer
    }>();
    const [particleSize, setParticleSize] = useState<number>(10);
    const [manhattanSize, setManhattanSize] = useState<ManhattanSize>();
    const [size, setSize] = useState<Size>();
    const ref = useRef<{ x: number, y: number }>();
    const addedPixels = useRef(new Map<string, Pixel>());
    const [pixels, setPixels] = useState(new Map<string, Pixel>());
    const [colorString, setColorString] = useState<string>('000000');
    const [deleteMode, setDeleteMode] = useState<boolean>(false);
    const [textareaValue, setTextareaValue] = useState<string>();
    const {
        pop,
        push,
        lastPop,
        popDone,
    } = useHistory();

    useEffect(() => {
        if (!lastPop || !visualization || !size || !pixels)
            return;

        const {
            renderer,
            world,
        } = visualization;

        const {
            width,
            height,
        } = size;

        if (lastPop.action === 'add') {
            const pixelsClone = new Map(pixels.entries());

            lastPop.pixels.forEach(({ row, column }) => {
                let o = pixels.get(getPixelKey(row, column))?.object;

                if (o) {
                    world.remove(o);
                }

                pixelsClone.delete(getPixelKey(row, column));
            });

            setPixels(pixelsClone);
        } else if (lastPop.action === 'remove') {
            lastPop.pixels.forEach(({ row, column }) => {
                const object = world.createParticle(
                    (-(width / 2) + (row * particleSize)) - particleSize / 2,
                    ((height / 2) - (column * particleSize)) - particleSize / 2,
                    particleSize,
                    particleSize,
                    {
                        renderOptions: {
                            color,
                        },
                    },
                );

                setPixels(val => {
                    const m = new Map([
                        ...val.entries(),
                    ]);

                    m.set(getPixelKey(row, column), {
                        row, column, color, size: particleSize, object,
                    });

                    return m;
                });
            });
        }

        popDone();

        world.render();
        renderer.render();
    }, [lastPop, visualization, size, pixels]);

    useEffect(() => {
        if (!element) return;

        const width = 1000;
        const height = 1000;
        const columns = Math.floor(width / particleSize);
        const rows = Math.floor(height / particleSize);

        setSize({
            width,
            height,
        });

        setManhattanSize({
            columns,
            rows,
        });
    }, [element, particleSize]);

    useEffect(() => {
        if (!element || !size)
            return;

        const {
            width, height,
        } = size;

        const visualizationRenderer = new VisualizationRenderer({
            container: element,
            height,
            width,
            backgroundColor: 0xffffff,
            debug: true,
            forceSize: true,
        });

        const visualizationWorld = new VisualizationWorld({
            physicsEngine: new ParticleSystem(
                new Mouse(element),
            ),
            renderer: visualizationRenderer,
        });

        setVisualization({
            world: visualizationWorld,
            renderer: visualizationRenderer,
        });

        return () => {
            visualizationWorld.destroy();
            visualizationRenderer.destroy();
        };
    }, [element, size]);

    useEffect(() => {
        if (!manhattanSize || !particleSize || !size || !visualization)
            return;

        const {
            width,
            height,
        } = size;

        const {
            columns,
            rows,
        } = manhattanSize;

        const {
            renderer,
        } = visualization;

        for (let i = 0; i <= columns; ++i) {
            renderer.rectangle(-(width / 2) + (particleSize * i), 0, 1, height, {
                color: 0xdddddd,
            });
        }

        for (let i = 0; i <= rows; ++i) {
            renderer.rectangle(0, -(height / 2) + (particleSize * i), width, 1, {
                color: 0xdddddd,
            });
        }

        renderer.render();
    }, [manhattanSize, particleSize, size, visualization]);

    const handleClick = (ev: MouseEvent) => {
        if (!size || !visualization)
            return;

        const row = Math.ceil(ev.pageX / particleSize);
        const column = Math.floor(ev.nativeEvent.offsetY / particleSize);

        const {
            width,
            height,
        } = size;

        const {
            renderer,
            world,
        } = visualization;

        if (deleteMode) {
            let pixel = pixels.get(getPixelKey(row, column));
            let o = pixel?.object;

            push([pixel as Pixel], 'remove');

            if (o) {
                world.remove(o);
            }

            pixels.delete(getPixelKey(row, column));

            world.render();
            return;
        }

        const object = world.createParticle(
            (-(width / 2) + (row * particleSize)) - particleSize / 2,
            ((height / 2) - (column * particleSize)) - particleSize / 2,
            particleSize,
            particleSize,
            {
                renderOptions: {
                    color,
                },
            },
        );

        push([{
            row, column, color, size: particleSize, object,
        }]);

        setPixels(val => {
            const m = new Map([
                ...val.entries(),
            ]);

            m.set(getPixelKey(row, column), {
                row, column, color, size: particleSize, object,
            });

            return m;
        });

        renderer.render();
    };

    const handleMouseDown = (ev: MouseEvent) => {
        ref.current = {
            x: ev.nativeEvent.offsetX,
            y: ev.nativeEvent.offsetY,
        };
    };

    const handleMouseUp = () => {
        ref.current = undefined;

        if (deleteMode)
            return;

        const added = [...addedPixels.current.entries()];

        push(added.map(([, pixel]) => pixel));

        setPixels(val => {
            return new Map([
                ...val.entries(),
                ...added,
            ]);
        });

        addedPixels.current.clear();
    };

    const handleMouseMoveCapture = (ev: MouseEvent) => {
        if (ref.current) {
            if (!size || !visualization)
                return;

            const row = Math.ceil(ev.nativeEvent.offsetX / particleSize);
            const column = Math.floor(ev.nativeEvent.offsetY / particleSize);

            const {
                width,
                height,
            } = size;

            const {
                renderer,
                world,
            } = visualization;

            if (deleteMode) {
                let pixel = pixels.get(getPixelKey(row, column));
                let o = pixel?.object;

                push([pixel as Pixel], 'remove');

                if (o) {
                    world.remove(o);
                }

                pixels.delete(getPixelKey(row, column));

                world.render();
                return;
            }

            const object = world.createParticle(
                (-(width / 2) + (row * particleSize)) - particleSize / 2,
                ((height / 2) - (column * particleSize)) - particleSize / 2,
                particleSize,
                particleSize,
                {
                    renderOptions: {
                        color,
                    },
                },
            );

            addedPixels.current.set(getPixelKey(row, column), {
                row, column, color, size: particleSize, object,
            });

            renderer.render();
        }
    };

    const handleExport = () => {
        setTextareaValue(JSON.stringify({
            size,
            particleSize,
            manhattanSize,
            particles: [...pixels.values()].map(({ object, ...rest }) => (rest)),
        }));
    };

    const handleImport = () => {
        handleLoad(JSON.parse(textareaValue || ''));
    };

    const handleSave = () => {
        const particles = [...pixels.values()].map(({ object, ...rest }) => (rest));

        localStorage.setItem('pixels', JSON.stringify({
            size,
            particleSize,
            manhattanSize,
            particles,
        }));
    };

    const handleLoad = (externalData?: PixelsExportFormat) => {
        const data: PixelsExportFormat = externalData || JSON.parse(localStorage.getItem('pixels') || '');

        if (!size || !visualization)
            return;

        const {
            width,
            height,
        } = size;

        const {
            world,
        } = visualization;

        setPixels(new Map(data.particles.map(p => {
                const object = world.createParticle(
                    (-(width / 2) + (p.row * particleSize)) - particleSize / 2,
                    ((height / 2) - (p.column * particleSize)) - particleSize / 2,
                    particleSize,
                    particleSize,
                    {
                        renderOptions: {
                            color: p.color,
                        },
                    },
                );

                return ([
                    getPixelKey(p.row, p.column),
                    {
                        ...p,
                        object,
                    },
                ]);
            }),
        ));

        world.render();
    };


    const handleClear = () => {
        setPixels(new Map());
        visualization?.world.clear();
    };

    const handleSetColor = () => {
        setColor(parseInt(colorString || '', 16));
    };

    const handleSetDeleteMode = () => {
        setDeleteMode(val => !val);
    };

    return (
        <div className='container'>
            <div className='buttons'>
                <button onClick={handleImport}>import</button>
                <button onClick={handleExport}>export</button>
                <button onClick={handleClear}>clear</button>
                <button onClick={handleSave}>save</button>
                <button onClick={() => handleLoad()}>load</button>
                <button onClick={handleSetColor}>set color</button>
                <button onClick={() => pop()}>step back</button>
                <button onClick={handleSetDeleteMode} className={deleteMode ? 'active' : ''}>delete mode</button>
            </div>
            <div className='input-styles'>
                <label htmlFor={'color'}>Color #</label>
                <input id={'color'} type={'text'} value={colorString} onChange={(ev) => {
                    setColorString(ev.target.value);
                }} />
            </div>
            <div className='input-styles'>
                <label htmlFor={'output'}>Output</label>
                <textarea id={'output'} value={textareaValue} onChange={(ev) => {
                    setTextareaValue(ev.target.value);
                }} />
            </div>
            <div
                ref={setElement}
                className='canvas'
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMoveCapture={handleMouseMoveCapture}
                onMouseLeave={handleMouseUp}
            />
        </div>
    );
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);