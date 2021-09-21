window.addEventListener('load', function () {

    console.log("on loadd");

    line_clicked('1');
});



function line_clicked(line_id) {

    (async () => {

        let mapper = {

            "asdu:0, io:0": "0;0",
            "asdu:0, io:1": "0;1",
            "asdu:1, io:0": "1;0",
            "asdu:1, io:1": "1;1",
            "asdu:2, io:0": "2;0",
            "asdu:2, io:1": "2;1",
            "asdu:3, io:0": "3;0",
            "asdu:3, io:1": "3;1",
            "asdu:4, io:0": "4;0",
            "asdu:4, io:1": "4;1",
            "asdu:5, io:0": "5;0",
            "asdu:5, io:1": "5;1",
            "asdu:6, io:0": "6;0",
            "asdu:6, io:1": "6;1",

            "asdu:10, io:0": "10;0",
            "asdu:10, io:1": "10;1",
            "asdu:10, io:2": "10;2",
            "asdu:10, io:3": "10;3",
            "asdu:10, io:4": "10;4",
            "asdu:11, io:0": "11;0",
            "asdu:11, io:1": "11;1",
            "asdu:11, io:2": "11;2",
            "asdu:11, io:3": "11;3",
            "asdu:11, io:4": "11;4",
            "asdu:12, io:0": "12;0",
            "asdu:12, io:1": "12;1",
            "asdu:12, io:2": "12;2",
            "asdu:12, io:3": "12;3",
            "asdu:12, io:4": "12;4",
            "asdu:13, io:0": "13;0",
            "asdu:13, io:1": "13;1",
            "asdu:13, io:2": "13;2",
            "asdu:13, io:3": "13;3",
            "asdu:13, io:4": "13;4",

            "asdu:20, io:0": "20;0",
            "asdu:20, io:1": "20;1",
            "asdu:20, io:2": "20;2",
            "asdu:20, io:3": "20;3",
            "asdu:20, io:4": "20;4",

            "asdu:30, io:0": "30;0",
            "asdu:31, io:0": "31;0",
            "asdu:32, io:0": "32;0",
            "asdu:33, io:0": "33;0",
            "asdu:34, io:0": "34;0",
            "asdu:35, io:0": "35;0",
            "asdu:36, io:0": "36;0",
            "asdu:37, io:0": "37;0",

        };

        click_action_general( mapper, line_id);

    })();
}


async function click_action_general( mapper, num_id) {

    let main = document.querySelector("body > div > div > main > div > div > div.grid.gap-6.mb-8.md\\:grid-cols-2.xl\\:grid-cols-4");
    main.innerHTML = "";

    document.querySelector(".valsandg").style.visibility = "visible";

    let categoryTemplate = document.querySelector('#card-template');

    let v = [];

    for (const [key, value] of Object.entries(mapper)) {

        let category = categoryTemplate.content.cloneNode(true);
        let title = category.querySelector("div > div:nth-child(2) > p.mb-2.text-sm.font-medium.text-gray-600.dark\\:text-gray-400")
        title.textContent = key;
        let val = category.querySelector("div > div:nth-child(2) > p.text-lg.font-semibold.text-gray-700.dark\\:text-gray-200")
        val.textContent = await get_val(value);
        val.id = value;
        main.appendChild(category);

        v.push(key);
    }


    reloader( mapper);
}

async function reloader(mapper) {
    /**
     * refresh values every second
     */

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let old_vals = {}

    for (const [key, value] of Object.entries(mapper)) {
        old_vals[key] = value;
    }

    while (true) {

        for (const [key, value] of Object.entries(mapper)) {

            let new_val = await get_val(value);

            if (old_vals[key] != new_val) {
                old_vals[key] = new_val;

                document.getElementById(value).innerHTML = new_val;

            }

        }

        await fetch('http://localhost:3000/refresh/');

        // console.log("refreshing");

        await delay(1000);
    }

    console.log("reloader done");
}