import {
    BufferGeometry,
    Camera,
    CircleGeometry, DoubleSide, Line, LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    PlaneGeometry,
    Scene, Vector3,
    WebGLRenderer,
} from 'three';
import { getNumberOrFallback, RenderOptions } from '~/utils';
import { Object3D } from 'three/src/core/Object3D';

export interface VisualizationRendererProps {
    width: number;
    height: number;
    container: HTMLElement;
    backgroundColor: number;
    debug?: boolean;
    forceSize?: boolean;
}

export class VisualizationRenderer {
    renderer: WebGLRenderer;
    camera: Camera;
    scene: Scene;

    constructor(public readonly options: VisualizationRendererProps) {
        const {
            width, height, container, forceSize,
        } = options;

        this.renderer = new WebGLRenderer({
            antialias: true,
        });

        if (forceSize)
            this.renderer.setSize(width, height);

        this.renderer.setClearColor(options.backgroundColor, 1);
        container.appendChild(this.renderer.domElement);

        this.camera = new PerspectiveCamera(100, width / height);
        this.camera.position.z = 422;
        this.scene = new Scene();

        if (this.options.debug) {
            this.renderDebugShapes();
        }
    }

    private renderDebugShapes() {
        const {
            width, height,
        } = this.options;

        this.rectangle(0, 0, width, 2, {
            color: 0x22ffdd,
        });
        this.rectangle(0, 0, 2, height, {
            color: 0x22ffdd,
        });
    }

    circle(x: number, y: number, radius: number, options: RenderOptions): Mesh {
        const geometry = new CircleGeometry(radius, 32);
        const material = new MeshBasicMaterial({
            color: options.color,
            opacity: getNumberOrFallback(options.opacity, 1),
            transparent: getNumberOrFallback(options.opacity, 1) < 1,
        });
        const circle = new Mesh(geometry, material);

        circle.position.x = x;
        circle.position.y = y;
        circle.position.z = 1;

        this.scene.add(circle);

        return circle;
    }

    rectangle(x: number, y: number, width: number, height: number, options: RenderOptions): Mesh {
        const geometry = new PlaneGeometry(width, height);
        const material = new MeshBasicMaterial({
            color: options.color,
            side: DoubleSide,
            opacity: getNumberOrFallback(options.opacity, 1),
            transparent: getNumberOrFallback(options.opacity, 1) < 1,
        });
        const plane = new Mesh(geometry, material);

        plane.position.x = x;
        plane.position.y = y;
        plane.position.z = 1;

        this.scene.add(plane);

        return plane;
    }

    line(x1: number, y1: number, x2: number, y2: number, linewidth: number, options: RenderOptions): Line {
        const geometry = new BufferGeometry();
        const material = new LineBasicMaterial({ color: 0x00f, linewidth });

        geometry.setFromPoints([
            new Vector3(x1, y1, 0),
            new Vector3(x2, y2, 0),
        ]);
        geometry.computeVertexNormals();
        geometry.computeBoundingSphere();

        const line = new Line(geometry, material);

        this.scene.add(line);

        return line;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    remove(...objects: Object3D[]) {
        this.scene.remove(...objects);
    }

    destroy() {
        this.scene.remove(...this.scene.children);
    }

    resizeToDisplaySize() {
        const canvas = this.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio | 0;
        const height = canvas.clientHeight * pixelRatio | 0;
        const resizeNeeded = canvas.width !== width || canvas.height !== height;

        if (resizeNeeded) {
            this.renderer.setSize(width, height, false);
            // @ts-ignore
            this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
            // @ts-ignore
            visualizationRenderer.camera.updateProjectionMatrix();
        }

        return resizeNeeded;
    }
}
