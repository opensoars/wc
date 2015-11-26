"use strict";

let https = require('https'),
    http = require('http'),
    is = require('is');

let wc = {
  Constructor: class WcConstructor {
    constructor(o) {
      if (!o || !is.object(o))
        throw "Expected options object as argument 1";
      if (!o.url || !is.string(o.url))
        throw "Expected url string property in options object";

      this.url = o.url;


      this.gen = (function* () {
        yield 1;
        yield 2;
        yield 3;
      }());
    }

    getSource(cb) {
      ((this.url.indexOf('https') !== -1) ? https : http)
        .get(this.url, (res) => {
        var b = '';

        res.on('data', (c) => b += c);

        res.on('end', () => {
          cb(b);
        })
      });
    }

    /**
     * @return {object} this - Allows chains
     */
    start() {
      this.getSource((source) => {
        var matches = source.match(/href=[\"\'](.+?)[\"\'].+?>(.+?)<\/a>/g);
        matches.forEach(function (match) {
          console.log(match);
        })
      });

      return this;
    }
  },

  instances: (() => {
    let ins = [];

    ins.add = (instance) => {
      if (!instance || !is.object(instance))
        throw "Expected instance object as argument 1";

      ins.push(instance);
    };

    return ins;
  }()),

  root_urls: (() => {
    let r_u = [];

    // Pushes command line arguments to r_u 
    for (let argv_i = 2; argv_i < process.argv.length; argv_i++)
      r_u.push(process.argv[argv_i])

    r_u.add = (root_url) => {
      if (!root_url || !is.string(root_url))
        throw "Expected root_url string as argument 1";

      r_u.push(root_url);
    };

    return r_u;
  }()),

  start: () => {
    if (wc.root_urls.length === 0)
      throw 'No root_urls on wc.start';



    wc.root_urls.forEach((root_url) => {
      wc.instances.add(new wc.Constructor({
        url: root_url
      }).start());
    });
  }

};

wc.start();
/*
let wc = {

  root_urls: (function () {
    if (!process.argv[2] || typeof process.argv[2] !== 'string') {
      throw '!process.argv[2], please specify atleast one root_url';
    }
    return (function () {
      var cl_args = [];
      process.argv.forEach(function (arg, i) {
        if (i > 1) {
          cl_args.push(arg);
        }
      });
      return cl_args;
    }());
  }()),

  addRoot: function addRoot(root_url) {
    if (!is.string(root_url)) {
      throw 'Please specify a root url as the 1st argument';
    }
    wc.root_urls.push(root_url);
  },

  Constructor: class WcConstructor {
    constructor() {
      this.urls = [];
    }
  },



  instances: []
};

wc.addInstance(n);

wc.addRoot('https://en.wikipedia.org/wiki/Alphabet_Inc.');
wc.addRoot('https://en.wikipedia.org/wiki/Central_processing_unit');
wc.addRoot('https://en.wikipedia.org/wiki/Open_source');


console.log(wc);
*/
/*wc.crawl = function* crawl() {
  console.log('keke');

  yield 'asd';
};

wc.start = function () {
  var gen = this.crawl();
  gen.next();
};

wc.start();*/


/*var gen = (function* idMaker(){
  var i = 0;

  while(i < 10000) {
    yield {
      i: i++
    };
  }
}());

(function callNext() {
  var next_gen = gen.next(),
      val = next_gen.value;

  ///console.log(next_gen);

  val && !val.done ?
    ((val.i || val.i === 0)
      ? setTimeout(callNext, 0)
      : false)
    : console.log('done');
}());*/