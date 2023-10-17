import { createFopix, SectionData } from '~/index';

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

function main() {
    const container = document.getElementById('myElement');

    const fopix = createFopix({
        container,
        sections: SECTIONS,
    });

    container.addEventListener('click', () => {
        // navigate through animation, go to next word or section
        fopix.next();
    });
}