if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let f={};const o=e=>n(e,t),c={module:{uri:t},exports:f,require:o};i[t]=Promise.all(s.map((e=>c[e]||o(e)))).then((e=>(r(...e),f)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-D4dQuWif.js",revision:null},{url:"assets/index-D6JtP9Oj.css",revision:null},{url:"index.html",revision:"d447c62dea53c596c4b81b8f3742eae6"},{url:"registerSW.js",revision:"8e514f328b21d2f1a3182742099a4a0b"},{url:"favicon.ico",revision:"181b99a855d571b857934b8de6709c58"},{url:"web-app-manifest-192x192.png",revision:"6fbc73be9f2fcf8ce7b599b2ec063ee5"},{url:"web-app-manifest-512x512.png",revision:"30ed4fca8aa623d4b32ad8f9282fcfcd"},{url:"manifest.webmanifest",revision:"6c3bea3b6f339f926fa7b9f28d4d994c"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
