// Optional browser checks: Node 22+ and local Chrome; no npm packages required.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
const origin=(process.env.MINDCARE_PREVIEW_ORIGIN||'http://127.0.0.1:8080/').replace(/\/?$/,'/');
const port=process.env.MINDCARE_CDP_PORT||'9227';
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'mindcare-browser-'));
const chrome=spawn(process.env.CHROME_PATH||'/usr/bin/google-chrome',['--headless=new','--no-sandbox','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-address=127.0.0.1','--remote-debugging-port='+port,'--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
let ws;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const failures=[],results=[];
const assert=(ok,label)=>{if(!ok)failures.push(label)};
try {
 let targets;
 for(let i=0;i<100;i++){
  try{targets=await(await fetch('http://127.0.0.1:'+port+'/json')).json();break}catch{await delay(100)}
 }
 if(!targets)throw Error('Cannot connect to Chrome. Set CHROME_PATH if necessary.');
 ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true})});
 let next=0;const pending=new Map(),exceptions=[];
 ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(!p)return;m.error?p.reject(m.error):p.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails)});
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++next;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 const evaluate=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value};
 await call('Page.enable');await call('Runtime.enable');await call('Network.enable');
 // External Google availability is separate from deterministic website checks.
 await call('Network.setBlockedURLs',{urls:['*://www.google.com/*']});
 await call('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
 const viewport=width=>call('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});
 const navigate=async route=>{
  const url=new URL(route.replace(/^\//,''),origin).href;
  await call('Page.navigate',{url});
  let ready=false;
  for(let i=0;i<150;i++){await delay(35);if(await evaluate(`location.href===${JSON.stringify(url)}&&document.readyState==='complete'`)){ready=true;break}}
  if(!ready)throw Error('Page load timed out: '+url);
  await evaluate('document.fonts.ready.then(()=>true)');
 };
 const screenshot=async filename=>{const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(filename,Buffer.from(r.data,'base64'))};
 const pages=['','fr/','en/','ar/',...['fr','en','ar'].flatMap(l=>['patients/','psychologues/','a-propos/'].map(p=>l+'/'+p))];
 for(const route of pages){
  for(const width of [320,390,768,1440]){
   await viewport(width);await navigate(route);
   await evaluate(`Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>null)}))`);
   const state=await evaluate(`({overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.getAttribute('src')),lang:document.documentElement.lang,dir:document.documentElement.dir,h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,body:document.querySelector('main').innerText.length})`);
   const label=(route||'/')+' '+width;
   assert(!state.overflow,label+' overflow');assert(!state.broken.length,label+' broken images '+state.broken);assert(state.h1===1&&state.main===1,label+' document structure');assert(state.body>100,label+' missing content');assert(state.lang===(route.startsWith('ar/')?'ar':route.startsWith('en/')?'en':'fr'),label+' language');assert(state.dir===(state.lang==='ar'?'rtl':'ltr'),label+' direction');results.push({route,width,...state});
  }
 }
 await viewport(390);await navigate('ar/');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
 assert(await evaluate(`document.activeElement.matches('.skip-link')&&document.activeElement.getBoundingClientRect().top>=0`),'skip link focus');
 await evaluate(`document.querySelector('.mobile-nav summary').click()`);
 assert(await evaluate(`document.querySelector('.mobile-nav').open`),'native menu opens');
 await call('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await call('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});
 assert(await evaluate(`!document.querySelector('.mobile-nav').open&&document.activeElement.matches('.mobile-nav summary')`),'Escape closes menu and returns focus');
 await evaluate(`document.querySelector('.login summary').click()`);await delay(100);
 assert(await evaluate(`document.querySelector('.login').open&&document.querySelectorAll('.login [aria-disabled="true"]').length===2`),'login choices stay disabled');
 assert(await evaluate(`document.querySelector('form button').disabled`),'unconfigured contact disabled');
 // Even programmatic form submission cannot cause accidental navigation or delivery.
 assert(await evaluate(`!document.querySelector('form').dispatchEvent(new Event('submit',{cancelable:true,bubbles:true}))`),'contact submission prevented');
 assert(await evaluate(`getComputedStyle(document.querySelector('.phone')).animationName==='none'`),'reduced motion');
 await navigate('ar/patients/');await evaluate(`document.querySelector('.language summary').click();document.querySelector('.language a[lang="en"]').click()`);await delay(250);
 assert(await evaluate(`document.documentElement.lang==='en'&&location.pathname.endsWith('/en/patients/')`),'language switching preserves page');
 await call('Emulation.setScriptExecutionDisabled',{value:true});
 await navigate('fr/');
 assert(await evaluate(`document.querySelector('main').innerText.length>1000&&document.querySelector('form button').disabled`),'content and safe contact without JS');
 await call('Emulation.setScriptExecutionDisabled',{value:false});
 await viewport(1440);await navigate('');await screenshot('/tmp/mindcare-desktop.png');
 await viewport(390);await navigate('ar/');await screenshot('/tmp/mindcare-ar-mobile.png');
 assert(!exceptions.length,'browser exceptions '+JSON.stringify(exceptions));
 const report={origin,layouts:results.length,failures,results};fs.writeFileSync('/tmp/mindcare-browser-results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({origin,layouts:results.length,failures},null,2));
 if(failures.length)process.exitCode=1;
}finally{
 const exited=chrome.exitCode!==null?Promise.resolve():new Promise(resolve=>chrome.once('exit',resolve));
 if(ws?.readyState===WebSocket.OPEN)ws.send(JSON.stringify({id:999999,method:'Browser.close'}));
 else chrome.kill();
 await Promise.race([exited,delay(5000)]);
 if(chrome.exitCode===null)chrome.kill();
 ws?.close();
 try{await fs.promises.rm(profile,{recursive:true,force:true,maxRetries:10,retryDelay:100})}
 catch(error){console.warn('Temporary Chrome profile retained:',profile,error.code)}
}
