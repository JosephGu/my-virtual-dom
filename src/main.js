import createElement from "./vdom/createElement";
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

const createVApp = (count) => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count
    },
    children: [
        String(count),
        createElement('input'),
        createElement('img', {
            attrs: {
                src: "https://i.gifer.com/XXM2.gif"
            }
        })
    ]
})

let count = 0;
let vApp = createVApp(count)
const $app = render(vApp);

let $rootEl = mount($app, document.getElementById('app'));

setInterval(() => {
    count++;

    const vNewApp = createVApp(count);
    
    console.log(vNewApp,vApp,$rootEl);
    const patch = diff(vApp, vNewApp);
    $rootEl = patch($rootEl);
    vApp = vNewApp;

}, 1000)