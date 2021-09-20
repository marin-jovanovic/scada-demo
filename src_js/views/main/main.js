import 'main/index.scss';

export {vt}

console.log("Hello, World!");

function changeState(i) {

    let t = r.get('remote', 'adapter', '30;' + i);
    console.log('13 0', t)
    console.log(1 - t, typeof(1 - t));

    hat.conn.send('feedback_loop_adapter', {asdu: 30, value: 1 - t, io: 0});

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
            'change 30;0'
        ],

        ['br'],
        ['hr'],

        ['div', "0;0 -> ", `${r.get('remote', 'adapter', '0;0')}`],
        ['div', "0;1 -> ", `${r.get('remote', 'adapter', '0;1')}`],
        ['div', "1;0 -> ", `${r.get('remote', 'adapter', '1;0')}`],
        ['div', "1;1 -> ", `${r.get('remote', 'adapter', '1;1')}`],
        ['div', "2;0 -> ", `${r.get('remote', 'adapter', '2;0')}`],
        ['div', "2;1 -> ", `${r.get('remote', 'adapter', '2;1')}`],
        ['div', "3;0 -> ", `${r.get('remote', 'adapter', '3;0')}`],
        ['div', "3;1 -> ", `${r.get('remote', 'adapter', '3;1')}`],
        ['div', "4;0 -> ", `${r.get('remote', 'adapter', '4;0')}`],
        ['div', "4;1 -> ", `${r.get('remote', 'adapter', '4;1')}`],
        ['div', "5;0 -> ", `${r.get('remote', 'adapter', '5;0')}`],
        ['div', "5;1 -> ", `${r.get('remote', 'adapter', '5;1')}`],
        ['div', "6;0 -> ", `${r.get('remote', 'adapter', '6;0')}`],
        ['div', "6;1 -> ", `${r.get('remote', 'adapter', '6;1')}`],

        ['div', "10;0 -> ", `${r.get('remote', 'adapter', '10;0')}`],
        ['div', "10;1 -> ", `${r.get('remote', 'adapter', '10;1')}`],
        ['div', "10;2 -> ", `${r.get('remote', 'adapter', '10;2')}`],
        ['div', "10;3 -> ", `${r.get('remote', 'adapter', '10;3')}`],
        ['div', "11;0 -> ", `${r.get('remote', 'adapter', '11;0')}`],
        ['div', "11;1 -> ", `${r.get('remote', 'adapter', '11;1')}`],
        ['div', "11;2 -> ", `${r.get('remote', 'adapter', '11;2')}`],
        ['div', "11;3 -> ", `${r.get('remote', 'adapter', '11;3')}`],
        ['div', "12;0 -> ", `${r.get('remote', 'adapter', '12;0')}`],
        ['div', "12;1 -> ", `${r.get('remote', 'adapter', '12;1')}`],
        ['div', "12;2 -> ", `${r.get('remote', 'adapter', '12;2')}`],
        ['div', "12;3 -> ", `${r.get('remote', 'adapter', '12;3')}`],
        ['div', "13;0 -> ", `${r.get('remote', 'adapter', '13;0')}`],
        ['div', "13;1 -> ", `${r.get('remote', 'adapter', '13;1')}`],
        ['div', "13;2 -> ", `${r.get('remote', 'adapter', '13;2')}`],
        ['div', "13;3 -> ", `${r.get('remote', 'adapter', '13;3')}`],

        ['div', "20;0 -> ", `${r.get('remote', 'adapter', '20;0')}`],
        ['div', "20;1 -> ", `${r.get('remote', 'adapter', '20;1')}`],
        ['div', "20;2 -> ", `${r.get('remote', 'adapter', '20;2')}`],
        ['div', "20;3 -> ", `${r.get('remote', 'adapter', '20;3')}`],
        ['div', "20;4 -> ", `${r.get('remote', 'adapter', '20;4')}`],

        ['div', "30;0 -> ", `${r.get('remote', 'adapter', '30;0')}`],
        ['div', "31;0 -> ", `${r.get('remote', 'adapter', '31;0')}`],
        ['div', "32;0 -> ", `${r.get('remote', 'adapter', '32;0')}`],
        ['div', "33;0 -> ", `${r.get('remote', 'adapter', '33;0')}`],
        ['div', "34;0 -> ", `${r.get('remote', 'adapter', '34;0')}`],
        ['div', "35;0 -> ", `${r.get('remote', 'adapter', '35;0')}`],
        ['div', "36;0 -> ", `${r.get('remote', 'adapter', '36;0')}`],
        ['div', "37;0 -> ", `${r.get('remote', 'adapter', '37;0')}`],

    ];

}

