import hljs from "highlight.js/lib/core";
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import actionscript from 'highlight.js/lib/languages/actionscript';

document.addEventListener("DOMContentLoaded", () => {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('actionscript', actionscript);

    document.querySelectorAll('.prose pre code').forEach((el) => {
        hljs.highlightElement(el as HTMLElement);
    });
});
