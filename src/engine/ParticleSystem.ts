import { Particle } from '~/engine/Particle';
import {
    map, normalizeVector,
    translateCanvasVectorToWebglVector,
    translateWebglVectorToCanvasVector,
} from '~/engine/utils';
import { Mouse } from '~/engine/Mouse';

interface UpdateArgs {
    width: number;
    height: number;
}

export class ParticleSystem {
    particles: Particle[] = [];

    constructor(private mouse: Mouse) {
    }

    add(particles: Particle[]) {
        this.particles = [
            ...this.particles,
            ...particles,
        ];
    }

    update({ width, height }: UpdateArgs) {
        const maxSpeed = 10;
        const c = 0.5;

        for (const p of this.particles) {
            // const mousePosition = this.mouse.position.clone().sub(translateWebglVectorToCanvasVector(p.position, width, height));
            //
            // mousePosition.normalize()
            const diffVec = p.destination.clone().sub(translateWebglVectorToCanvasVector(p.position, width, height));

            if (p.motionMode === 'linearApproach') {
                if (p.isInDestination()) {
                    continue;
                }

                const d = diffVec.length();
                diffVec.normalize();

                if (d < 20) {
                    p.position = translateCanvasVectorToWebglVector(p.destination, width, height);
                    p.rotation = 0;
                    continue;
                }

                diffVec.multiplyScalar(map(d, 10, 100, 0, maxSpeed));
                diffVec.sub(p.acceleration);

                const friction = normalizeVector(p.velocity.clone().multiplyScalar(-1)).multiplyScalar(c);
                p.applyForce(friction);
            } else {
                diffVec.normalize();
            }

            p.applyForce(diffVec);

            p.rotation = Math.atan2(p.velocity.y, p.velocity.x);

            if (p.velocity.length() > maxSpeed) {
                p.velocity.setLength(maxSpeed);
            }

            p.acceleration.y *= -1;
            p.velocity.add(p.acceleration);

            p.position.add(p.velocity);
            p.acceleration.multiplyScalar(0);
        }
    }

    remove(...particles: Particle[]) {
        this.particles.filter(p => !particles.includes(p));
    }

    clear() {
        this.particles = [];
    }
}

