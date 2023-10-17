import { Vector2 } from 'three';
import { Vector2Options } from '~/utils';
import { getFallbackValue } from '~/engine/utils';

export type MotionMode = 'linearApproach' | 'forces';

export class Particle {
    public motionMode: MotionMode = 'linearApproach';

    constructor(
        public position: Vector2,
        public velocity: Vector2,
        public acceleration: Vector2,
        public mass: number,
        public rotation: number,
        public destination: Vector2,
    ) {
    }

    applyForce(force: Vector2) {
        this.acceleration.add(
            force.clone().divideScalar(this.motionMode === 'forces' ? (this.mass || 1) : 1),
        );
    }

    isInDestination() {
        return this.destination && this.position.equals(this.destination);
    }

    setDestination(vec: Vector2) {
        this.destination = vec;
    }
}

export interface CreateParticleOptions extends Vector2Options {
    mass?: number;
    velocity?: Vector2Options;
    acceleration?: Vector2Options;
    rotation?: number;
    destination?: Vector2Options;
}

export function createParticle({
                                   x,
                                   y,
                                   mass,
                                   velocity,
                                   rotation,
                                   acceleration,
                                   destination,
                               }: CreateParticleOptions) {
    return new Particle(
        new Vector2(x, y),
        new Vector2(velocity?.x, velocity?.y),
        new Vector2(acceleration?.x, acceleration?.y),
        getFallbackValue(mass, 10),
        getFallbackValue(rotation, 0),
        new Vector2(destination?.x, destination?.y),
    );
}
