import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projects = JSON.parse(readFileSync(path.join(root,'projects.json'),'utf8'));
const html = readFileSync(path.join(root,'dist/index.html'),'utf8');
assert.equal(new Set(projects.map(p=>p.id)).size,projects.length,'Project IDs must be unique');
assert.equal((html.match(/class="project-card"/g)||[]).length,projects.length);
assert(!html.includes('<!-- PROJECTS -->'),'All projects must be prerendered');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'HTML IDs must be unique');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (!/^[a-z]+:/i.test(match[1])) assert(existsSync(path.join(root,'dist',match[1])),`Missing local asset: ${match[1]}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(match[1]),`Broken section link: ${match[1]}`);
for (const project of projects) {
  assert.equal(new URL(project.url).protocol,'https:');
  assert(['apps','clients','cotc','experiments'].includes(project.category));
  assert(html.includes(`id="project-${project.id}"`));
  if (project.image) for (const size of [640,960]) assert(existsSync(path.join(root,`dist/assets/projects/${project.image}-desktop-${size}.webp`)));
}
// Exercise browser interaction handlers without sending contact messages or requiring a browser install.
const element = (dataset={}) => ({dataset,hidden:false,value:'',listeners:{},attrs:{},addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(key,value){this.attrs[key]=value;},focus(){this.focused=true;}});
const cards=projects.map(p=>element({category:p.category,search:[p.name,p.description,...p.tags].join(' ').toLowerCase()}));
const buttons=['all','apps','clients','cotc','experiments'].map(filter=>element({filter}));
const controls=Object.fromEntries(['.collection-tools','#project-search','#results-count','.empty-state','#reset-filters','#year'].map(key=>[key,element()]));
const summary=element(),menuLinks=[element(),element()],menu=element();
menu.open=false;menu.querySelector=()=>summary;menu.querySelectorAll=()=>menuLinks;menu.contains=target=>target===menu;
controls['.mobile-menu']=menu;
const docListeners={};
const document={querySelector:s=>controls[s],querySelectorAll:s=>s==='.project-card'?cards:buttons,addEventListener:(type,fn)=>docListeners[type]=fn};
vm.runInNewContext(readFileSync(path.join(root,'portfolio.js'),'utf8'),{document,Date});
for (let i=0;i<buttons.length;i++) {
  buttons[i].listeners.click();
  assert.equal(cards.filter(c=>!c.hidden).length,i===0?projects.length:projects.filter(p=>p.category===buttons[i].dataset.filter).length);
  assert.equal(buttons.filter(b=>b.attrs['aria-pressed']==='true').length,1);
}
buttons[0].listeners.click();
controls['#project-search'].value='  GUIDE LOG  ';controls['#project-search'].listeners.input();
assert.equal(cards.filter(c=>!c.hidden).length,1,'Search must ignore case and surrounding spaces');
buttons[2].listeners.click();assert.equal(cards.filter(c=>!c.hidden).length,0,'Search and category must intersect');
assert.equal(controls['.empty-state'].hidden,false);
controls['#reset-filters'].listeners.click();assert.equal(cards.filter(c=>!c.hidden).length,projects.length);assert(controls['#project-search'].focused);
menu.open=true;docListeners.keydown({key:'Escape'});assert.equal(menu.open,false);assert(summary.focused);
menu.open=true;menuLinks[0].listeners.click();assert.equal(menu.open,false);
menu.open=true;docListeners.click({target:{}});assert.equal(menu.open,false);
console.log(`Passed: ${projects.length} prerendered projects, assets, anchors, categories, search, reset, and menu interactions.`);
