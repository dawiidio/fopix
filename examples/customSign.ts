// change ~/index to @dawiidio/fopix
import { createFopix, SectionData, SignExportFormat } from '~/index';

// exported from editor, editor is available after running "npm run dev"
const MY_SIGN: SignExportFormat = {"size":{"width":1000,"height":1000},"particleSize":10,"manhattanSize":{"columns":100,"rows":100},"particles":[{"row":42,"column":45,"color":0,"size":10},{"row":42,"column":46,"color":0,"size":10},{"row":42,"column":47,"color":0,"size":10},{"row":42,"column":48,"color":0,"size":10},{"row":42,"column":49,"color":0,"size":10},{"row":42,"column":50,"color":0,"size":10},{"row":42,"column":51,"color":0,"size":10},{"row":42,"column":52,"color":0,"size":10},{"row":42,"column":53,"color":0,"size":10},{"row":43,"column":53,"color":0,"size":10},{"row":44,"column":53,"color":0,"size":10},{"row":45,"column":53,"color":0,"size":10},{"row":46,"column":53,"color":0,"size":10},{"row":47,"column":53,"color":0,"size":10},{"row":48,"column":53,"color":0,"size":10},{"row":49,"column":53,"color":0,"size":10},{"row":50,"column":53,"color":0,"size":10},{"row":51,"column":53,"color":0,"size":10},{"row":52,"column":53,"color":0,"size":10},{"row":53,"column":53,"color":0,"size":10},{"row":54,"column":53,"color":0,"size":10},{"row":55,"column":53,"color":0,"size":10},{"row":56,"column":53,"color":0,"size":10},{"row":57,"column":53,"color":0,"size":10},{"row":57,"column":52,"color":0,"size":10},{"row":57,"column":51,"color":0,"size":10},{"row":57,"column":50,"color":0,"size":10},{"row":57,"column":49,"color":0,"size":10},{"row":57,"column":48,"color":0,"size":10},{"row":57,"column":47,"color":0,"size":10},{"row":57,"column":46,"color":0,"size":10},{"row":57,"column":45,"color":0,"size":10},{"row":43,"column":45,"color":0,"size":10},{"row":44,"column":45,"color":0,"size":10},{"row":45,"column":45,"color":0,"size":10},{"row":46,"column":45,"color":0,"size":10},{"row":47,"column":45,"color":0,"size":10},{"row":48,"column":45,"color":0,"size":10},{"row":49,"column":45,"color":0,"size":10},{"row":50,"column":45,"color":0,"size":10},{"row":51,"column":45,"color":0,"size":10},{"row":52,"column":45,"color":0,"size":10},{"row":53,"column":45,"color":0,"size":10},{"row":54,"column":45,"color":0,"size":10},{"row":55,"column":45,"color":0,"size":10},{"row":56,"column":45,"color":0,"size":10},{"row":46,"column":44,"color":0,"size":10},{"row":46,"column":43,"color":0,"size":10},{"row":46,"column":42,"color":0,"size":10},{"row":46,"column":41,"color":0,"size":10},{"row":53,"column":44,"color":0,"size":10},{"row":53,"column":43,"color":0,"size":10},{"row":53,"column":42,"color":0,"size":10},{"row":53,"column":41,"color":0,"size":10},{"row":45,"column":47,"color":0,"size":10},{"row":46,"column":47,"color":0,"size":10},{"row":47,"column":47,"color":0,"size":10},{"row":48,"column":47,"color":0,"size":10},{"row":51,"column":47,"color":0,"size":10},{"row":52,"column":47,"color":0,"size":10},{"row":53,"column":47,"color":0,"size":10},{"row":54,"column":47,"color":0,"size":10},{"row":55,"column":47,"color":0,"size":10},{"row":44,"column":47,"color":0,"size":10},{"row":45,"column":50,"color":0,"size":10},{"row":46,"column":50,"color":0,"size":10},{"row":47,"column":50,"color":0,"size":10},{"row":48,"column":50,"color":0,"size":10},{"row":49,"column":50,"color":0,"size":10},{"row":50,"column":50,"color":0,"size":10},{"row":51,"column":50,"color":0,"size":10},{"row":52,"column":50,"color":0,"size":10},{"row":53,"column":50,"color":0,"size":10},{"row":54,"column":50,"color":0,"size":10},{"row":47,"column":51,"color":0,"size":10},{"row":48,"column":51,"color":0,"size":10},{"row":49,"column":51,"color":0,"size":10},{"row":50,"column":51,"color":0,"size":10},{"row":51,"column":51,"color":0,"size":10},{"row":52,"column":51,"color":0,"size":10},{"row":53,"column":51,"color":0,"size":10},{"row":46,"column":51,"color":0,"size":10},{"row":47,"column":54,"color":0,"size":10},{"row":48,"column":54,"color":0,"size":10},{"row":48,"column":55,"color":0,"size":10},{"row":47,"column":55,"color":0,"size":10},{"row":47,"column":56,"color":0,"size":10},{"row":48,"column":56,"color":0,"size":10},{"row":49,"column":56,"color":0,"size":10},{"row":49,"column":55,"color":0,"size":10},{"row":50,"column":56,"color":0,"size":10},{"row":51,"column":56,"color":0,"size":10},{"row":51,"column":55,"color":0,"size":10},{"row":51,"column":54,"color":0,"size":10},{"row":50,"column":54,"color":0,"size":10},{"row":49,"column":54,"color":0,"size":10},{"row":50,"column":55,"color":0,"size":10}]};

// just a basic section with a bunch of words
const SECTIONS: SectionData[] = [
    {
        type: 'sign',
        text: [MY_SIGN]
    },
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