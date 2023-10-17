import { ParticleSystem } from '~/engine/ParticleSystem';
import { Color, Mesh } from 'three';
import { Point2D, RenderOptions } from '~/utils';
import { VisualizationRenderer } from '~/VisualizationRenderer';
import { createParticle, CreateParticleOptions, Particle } from '~/engine/Particle';

type VisualizationObjectType = 'rect' | 'circle' | 'line';

export interface WorldObject {
    particle: Particle;
    render: Mesh;
    width: number;
    height: number;
    type: VisualizationObjectType;
    points: Point2D[];
    renderOptions: RenderOptions;
}

export interface WorldParticleOptions {
    particleOptions?: Partial<CreateParticleOptions>;
    renderOptions?: RenderOptions;
}

export interface VisualizationWorldOptions {
    physicsEngine: ParticleSystem;
    renderer: VisualizationRenderer;
}

export class VisualizationWorld {
    objects: WorldObject[] = [];

    constructor(public readonly options: VisualizationWorldOptions) {
    }

    createParticle(
        x: number,
        y: number,
        width: number,
        height: number,
        {
            particleOptions = {},
            renderOptions = {
                color: 0x000000,
            },
        }: WorldParticleOptions = {},
    ): WorldObject {
        const object: WorldObject = {
            type: 'rect',
            height,
            width,
            points: [{ x, y }],
            renderOptions: renderOptions || {},
            render: this.options.renderer.rectangle(x, y, width, height, renderOptions || {}),
            particle: createParticle({
                ...particleOptions || {},
                x,
                y,
            }),
        };

        this.options.physicsEngine.add([object.particle]);
        this.objects.push(object);

        return object;
    }

    render() {
        for (const object of this.objects) {
            const {
                particle: {
                    position: {
                        x, y,
                    },
                    rotation,
                },
                renderOptions,
                render,
            } = object;

            render.position.x = x;
            render.position.y = y;
            render.rotation.z = rotation;

            // @ts-ignore
            if (render.material.color.getHex() !== renderOptions.color) {
                // @ts-ignore
                (render.material.color as unknown as Color).setHex(renderOptions.color || 0);
            }
        }

        this.options.renderer.render();
    }

    update() {
        this.options.physicsEngine.update({
            width: this.options.renderer.options.width,
            height: this.options.renderer.options.height,
        });
    }

    clear() {
        this.options.renderer.remove(...this.objects.map(o => o.render));
        this.objects = [];
        this.options.physicsEngine.clear();

        this.render();
    }

    remove(...objects: WorldObject[]) {
        objects.forEach(o => {
            this.options.renderer.remove(o.render);
            this.options.physicsEngine.remove(o.particle);
        });

        this.objects = this.objects.filter(o => !objects.includes(o));
    }

    destroy() {
        this.objects = [];
        this.options.renderer.destroy();
        this.options.physicsEngine.clear();
    }
}
