// change ~/index to @dawiidio/fopix
import { createFopix, SectionData, ResizeFn } from '~/index';

// just a basic section with a bunch of words
const SECTIONS: SectionData[] = [
    {
        type: 'words',
        text: [
            'Hi',
            `I'm David`,
            `and I'm a`,
            `software engineer`
        ]
    }
];

const resizeFn: ResizeFn = (width, height, visualizationRenderer) => {
    // you can manipulate z position to fit visualization into window size,
    // it is not the best possible method, but the easiest one
    if (width < 400) {
        visualizationRenderer.camera.position.z = 1200;
    } else if (width >= 400 && width < 600) {
        visualizationRenderer.camera.position.z = 1000;
    } else if (width >= 600 && width < 800) {
        visualizationRenderer.camera.position.z = 900;
    } else if (width >= 800 && width < 1000) {
        visualizationRenderer.camera.position.z = 700;
    } else if (width >= 1000 && width < 1200) {
        visualizationRenderer.camera.position.z = 600;
    } else if (width >= 1200 && width < 1400) {
        visualizationRenderer.camera.position.z = 500;
    } else if (width >= 1400) {
        visualizationRenderer.camera.position.z = 422;
    }

    visualizationRenderer.resizeToDisplaySize();
}

function main() {
    const container = document.getElementById('myElement');

    const fopix = createFopix({
        container,
        sections: SECTIONS,
        resizeFn
    });

    container.addEventListener('click', () => {
        // navigate through animation, go to next word or section
        fopix.next();
    });

    window.addEventListener('resize', () => {
        fopix.resize(window.innerWidth, window.innerHeight);
    })
}