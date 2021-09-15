import 'main/index.scss';

const yaml = require('js-yaml');

export {vt}

function changeState() {

    let t = r.get('remote', 'adapter', '30;0')
    console.log('13 0', t)

    hat.conn.send('feedback_loop_adapter', {asdu: 30, value: 5, io: 0});

}

function vt() {

    return ['span',

        ['button',
            {'attrs':
                {'width': '500', 'height': '500',
                'fill': '#ffffff', 'stroke': '#ffffff',
                'background-color': 'blue'
                },
                on : { click: () => changeState(0)}
            },
            'kopfapok'
        ],

     

        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '13;0')}`],
        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '11;1')}`],

        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '4;1')}`],
        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '37;0')}`],

        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '20;2')}`],
        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '20;2')}`],

        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '30;0')}`],


        ['br'],
        ['hr'],
        ['div', `${r.get('remote', 'adapter', '31;0')}`],
     
    ];

}

