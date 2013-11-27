// Modfile
// More info at https://github.com/modulejs/modjs/

module.exports = {
    tasks: {
        download: {
            options: {
                dest: "js/vendor/"
            },
            fastclick: {
                src: "https://raw.github.com/ftlabs/fastclick/master/lib/fastclick.js"
            },
            spin: {
                src: "https://raw.github.com/fgnass/spin.js/gh-pages/dist/spin.js"
            },
            zepto: {
                src: "http://zeptojs.com/zepto.js"
            },
            jquery1: {
                src: "http://code.jquery.com/jquery-1.10.2.js"
            },
            jquery2: {
                src: "http://code.jquery.com/jquery-2.0.3.js"
            },
            requirejs: {
                src: "http://requirejs.org/docs/release/2.1.9/comments/require.js"
            },
            tmpl: {
                dest: 'js/',
                src: "https://raw.github.com/modulejs/requirejs-tmpl/master/tmpl.js"
            }
        },
        build: {
            src: "./index.html",
            stripDefine: true
        }
    },

    targets: {
        default: ['build'],
        vendor: ['download']
    }
};
