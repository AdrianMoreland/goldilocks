#!/usr/bin/env node
/**
 * Roadmap sync tool. Plain Node, no dependencies. See README.md in this folder.
 *   node tools/roadmap-sync/sync-tool.js sync         docs/ROADMAP.md sections.json out.md base.md [--partial]
 *   node tools/roadmap-sync/sync-tool.js changed-keys docs/ROADMAP.md base.md
 *   node tools/roadmap-sync/sync-tool.js export       docs/ROADMAP.md sections.json [out.md]
 *   node tools/roadmap-sync/sync-tool.js merge        docs/ROADMAP.md sections.json
 */
/* ---------- ROADMAP.md parser and merge (also runs in Node for tests) ---------- */
function parseRoadmapMd(text){
  const EMO={'🔴':'P0','🟠':'P1','🟡':'P2','⚪':'P3'};
  const EMO_G=/[🔴🟠🟡⚪]/gu, EMO_1=/[🔴🟠🟡⚪]/u;
  const src=String(text).replace(/\r\n/g,'\n').split('\n');
  const sections=[];let cur=null,phase=null,inCode=false,counter=0,stack=[],curLine=0;
  const tagRe=/`?\[(BC|LEGAL)\]`?/g, tagStrip=/\s*`?\[(?:BC|LEGAL)\]`?/g;

  function cleanTask(raw){
    let s=raw.trim(),pri=null;
    const m=s.match(/^((?:[🔴🟠🟡⚪]\s*)+)/u);
    if(m){pri=EMO[m[1].match(EMO_1)[0]];s=s.slice(m[0].length)}
    const tags=[];for(const x of s.matchAll(tagRe))if(!tags.includes(x[1]))tags.push(x[1]);
    s=s.replace(tagStrip,'');
    const parts=s.split('*(');let head=parts[0];const notes=[];
    for(const r of parts.slice(1)){
      const i=r.indexOf(')*');
      const part=i<0?r:r.slice(0,i),after=i<0?'':r.slice(i+2);
      notes.push(part.trim());
      if(after.trim())head+=' '+after.trim();
    }
    let depends='';
    const dm=head.match(/\s*←\s*depends:\s*(.*)$/);
    if(dm){depends=dm[1].trim();head=head.slice(0,dm.index)}
    let effort='';
    const ems=[...head.matchAll(/\s-\s(XL|S\/M|S|M|L)(?=\s|$|\.|,|\))/g)];
    if(ems.length){const e=ems[ems.length-1];effort=e[1];head=head.slice(0,e.index)+head.slice(e.index+e[0].length)}
    const title=head.replace(/\s+/g,' ').trim().replace(/:+$/,'').trim();
    return {title,note:notes.filter(Boolean).join('\n'),effort,pri,tags,depends};
  }
  function newTask(raw,check,done,ln){
    counter++;const c=cleanTask(raw);
    const t={id:'t'+counter,title:c.title,check,done,line:ln};
    if(c.note)t.note=c.note;if(c.effort)t.effort=c.effort;if(c.pri)t.pri=c.pri;
    if(c.tags.length)t.tags=c.tags;if(c.depends)t.depends=c.depends;
    t.children=[];return t;
  }
  function startSection(key,num,titleRaw,ph,special){
    counter=0;stack=[];let s=titleRaw,pri=null;
    const m=s.match(EMO_1);if(m)pri=EMO[m[0]];
    const tags=[];for(const x of s.matchAll(tagRe))if(!tags.includes(x[1]))tags.push(x[1]);
    s=s.replace(tagStrip,'');
    let sub='';const sm=s.match(/\*\((.*?)\)\*/);
    if(sm){sub=sm[1];s=s.slice(0,sm.index)+s.slice(sm.index+sm[0].length)}
    let depends='';const dm=s.match(/\s*←\s*depends:\s*(.*)$/);
    if(dm){depends=dm[1].trim();s=s.slice(0,dm.index)}
    s=s.replace(EMO_G,'').replace(/→/g,'').trim();
    cur={key,num,phase:ph,title:s,pri:pri||'',tags:tags.sort(),depends,sub,intro:'',order:sections.length,tasks:[],special:!!special,start:curLine};
    sections.push(cur);
  }
  function addNode(node,indent){
    while(stack.length&&stack[stack.length-1][0]>=indent)stack.pop();
    if(stack.length)stack[stack.length-1][1].children.push(node);else cur.tasks.push(node);
    stack.push([indent,node]);
  }
  for(let ln=0;ln<src.length;ln++){
    const line=src[ln];curLine=ln;
    if(line.trim().startsWith('```')){inCode=!inCode;continue}
    if(inCode)continue;
    if(line.startsWith('# ')){
      const h=line.slice(2).trim();const pm=h.match(/^PHASE (\d) - (.*)/);
      if(pm){phase=Number(pm[1]);cur=null;continue}
      const low=h.toLowerCase();
      if(low.startsWith('architecture target')){phase='other';startSection('x-arch','A','Architecture target (how the monorepo grows)','other',true)}
      else if(low.startsWith('scaling triggers'))startSection('x-triggers','S','Scaling triggers (act only when they happen)','other',true);
      else if(low.startsWith('suggested sequencing'))startSection('x-seq','Q','Suggested sequencing (what to do next)','other',true);
      else if(low.startsWith('icebox'))startSection('x-ice','I','Icebox (ideas captured, unscheduled)','other',true);
      else cur=null;
      continue;
    }
    if(line.startsWith('## ')){
      const h=line.slice(3).trim();const m=h.match(/^(\d+\.\d+)\s+(.*)/);
      if(m&&(phase===0||phase===1||phase===2))startSection('s-'+m[1].replace('.','-'),m[1],m[2],phase,false);else cur=null;
      continue;
    }
    if(line.startsWith('---'))continue;
    if(cur===null)continue;
    if(!line.trim())continue;
    const bm=line.match(/^(\s*)- (\[( |x)\] )?(.*)$/);
    if(bm){addNode(newTask(bm[4],bm[2]!==undefined,bm[3]==='x',ln),bm[1].length);continue}
    const text=line.trim().replace(/\s+/g,' ');
    if(cur.special||cur.tasks.length){
      counter++;const t={id:'t'+counter,title:text,check:false,done:false,group:true,line:ln,children:[]};
      stack.length=0;cur.tasks.push(t);stack.push([-1,t]);
    }else cur.intro+=(cur.intro?'\n':'')+line.trim();
  }
  const count=ts=>{let n=0,d=0;for(const t of ts){if(t.check){n++;if(t.done)d++}const[a,b]=count(t.children);n+=a;d+=b}return[n,d]};
  const prune=ts=>{for(const t of ts){if(!t.children.length)delete t.children;else prune(t.children)}};
  for(const s of sections){const[n,d]=count(s.tasks);s.n=n;s.d=d;prune(s.tasks);delete s.special}
  return sections;
}

const _canon=o=>Array.isArray(o)?o.map(_canon):o&&typeof o==='object'?Object.fromEntries(Object.keys(o).sort().filter(k=>!(k==='children'&&Array.isArray(o[k])&&!o[k].length)).map(k=>[k,_canon(o[k])])):o;
const _same=(a,b)=>JSON.stringify(_canon(a))===JSON.stringify(_canon(b));
const _norm=s=>String(s||'').toLowerCase().replace(/[`*_]/g,'').replace(/\s+/g,' ').trim();
const _words=s=>new Set(_norm(s).split(/[^a-z0-9]+/).filter(w=>w.length>2));
function _sim(a,b){const A=_words(a),B=_words(b);if(!A.size||!B.size)return 0;let i=0;for(const w of A)if(B.has(w))i++;return i/(A.size+B.size-i)}
const _rid=()=>'f'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const _isUser=t=>String(t.id).startsWith('u');

function _freshTask(f,cap){
  const n={id:_rid(),title:f.title,check:f.check,done:f.done};
  for(const k of ['note','effort','pri','tags','depends'])if(f[k]&&(!Array.isArray(f[k])||f[k].length))n[k]=f[k];
  if(f.group)n.group=true;
  if(f.children&&f.children.length)n.children=f.children.map(c=>_freshTask(c));
  return n;
}
function _countTasks(f){return 1+(f.children||[]).reduce((s,c)=>s+_countTasks(c),0)}

function _mergeTasks(local,file,log,sec){
  const lres=local.map(t=>({t,k:_norm(t.orig||t.title),used:false}));
  const pair=new Array(file.length).fill(null);
  file.forEach((f,i)=>{const k=_norm(f.title);const m=lres.find(x=>!x.used&&x.k===k);if(m){m.used=true;pair[i]=m}});
  file.forEach((f,i)=>{
    if(pair[i])return;let best=null,bs=0.7;
    for(const x of lres){if(x.used||_isUser(x.t))continue;const s=_sim(x.t.orig||x.t.title,f.title);if(s>=bs){bs=s;best=x}}
    if(best){best.used=true;pair[i]=best}
  });
  const out=[];
  file.forEach((f,i)=>{
    const m=pair[i];
    if(!m){out.push(_freshTask(f));log.push({k:'new',sec,text:f.title+(f.children&&f.children.length?` (with ${_countTasks(f)-1} subtask${_countTasks(f)-1===1?'':'s'})`:'')});return}
    const ln=m.t,mod=new Set(ln.mod||[]);const n={...ln};
    const take=(k,v)=>{if(v===undefined||v===''||(Array.isArray(v)&&!v.length))delete n[k];else n[k]=v};
    const before=_canon(ln);
    if(!mod.has('title'))n.title=f.title;else n.orig=f.title;
    take('note',f.note);if(!mod.has('effort'))take('effort',f.effort);if(!mod.has('pri'))take('pri',f.pri);
    take('tags',f.tags);take('depends',f.depends);
    n.check=f.check;if(f.group)n.group=true;else delete n.group;
    const was=_norm(ln.orig||ln.title)!==_norm(f.title)&&!mod.has('title');
    if(ln.removedFromFile){delete n.removedFromFile;log.push({k:'restored',sec,text:f.title})}
    if(f.check){
      if(f.done&&!ln.done){n.done=true;n.doing=false;log.push({k:'done',sec,text:f.title})}
      else if(!f.done&&ln.done){log.push({k:'kept',sec,text:f.title})}
    }
    const kids=_mergeTasks(ln.children||[],f.children||[],log,sec);
    if(kids.length)n.children=kids;else delete n.children;
    if(was)log.push({k:'renamed',sec,text:`${ln.title}  →  ${f.title}`});
    else if(!_same(_stripKids(before),_stripKids(n))&&!log.some(l=>l.text===f.title&&(l.k==='done'||l.k==='restored')))log.push({k:'updated',sec,text:f.title});
    out.push(n);
  });
  // local tasks the file does not have: keep them, flag the ones that came from the file
  lres.forEach((x,j)=>{
    if(x.used)return;
    const n={...x.t};
    if(!_isUser(n)&&!n.removedFromFile){n.removedFromFile=true;log.push({k:'removed',sec,text:n.title})}
    let at=0;
    for(let p=j-1;p>=0;p--){const prev=lres[p];if(prev.used){const idx=out.findIndex(o=>o.id===prev.t.id);if(idx>=0){at=idx+1;break}}}
    out.splice(at,0,n);
  });
  return out;
}
const _stripKids=t=>{const c={...t};delete c.children;return c};

/** local: section docs [{key,...}], file: parseRoadmapMd output. Returns {changes: Map(key -> {isNew, doc|fields}), log}. */
function mergeRoadmap(local,file){
  const log=[],changes=new Map();
  const lmap=new Map(local.map(s=>[s.key,s]));
  const fkeys=new Set(file.map(s=>s.key));
  for(const f of file){
    const l=lmap.get(f.key);
    if(!l){
      const doc={num:f.num,phase:f.phase,title:f.title,pri:f.pri,tags:f.tags,depends:f.depends,sub:f.sub,intro:f.intro,order:f.order,tasks:f.tasks.map(t=>_freshTask(t))};
      changes.set(f.key,{isNew:true,doc});log.push({k:'section-new',sec:f.num,text:`${f.title} (${f.n} tasks)`});continue;
    }
    const fields={};
    if(!l.edited){
      for(const k of ['title','pri','tags','depends','sub','intro'])if(!_same(l[k]??(k==='tags'?[]:''),f[k]))fields[k]=f[k];
      if(fields.title)log.push({k:'section-updated',sec:f.num,text:`${l.title}  →  ${f.title}`});
    }
    const tasks=_mergeTasks(l.tasks||[],f.tasks,log,f.num);
    if(!_same(tasks,l.tasks||[]))fields.tasks=tasks;
    if(l.removedFromFile){fields.removedFromFile=false;log.push({k:'restored',sec:f.num,text:f.title})}
    if(Object.keys(fields).length)changes.set(f.key,{isNew:false,fields});
  }
  for(const l of local){
    if(fkeys.has(l.key)||/^u-/.test(l.key)||l.removedFromFile)continue;
    changes.set(l.key,{isNew:false,fields:{removedFromFile:true}});
    log.push({k:'section-removed',sec:l.num,text:l.title});
  }
  return {changes,log};
}

/* ---------- page -> file: ticks and user-added tasks (ROADMAP.md edits) ---------- */
const _lastLine=n=>Math.max(n.line,...(n.children||[]).map(_lastLine));
const _indentOf=(lines,n)=>(lines[n.line].match(/^\s*/)||[''])[0];
function _renderNew(p,indent){
  const eff=p.effort?` - ${p.effort}`:'';
  const note=p.mine?` *(${String(p.mine).replace(/\s*\n\s*/g,' ').trim()})*`:'';
  const out=[`${indent}- [${p.done?'x':' '}] ${p.title}${eff}${note}`];
  for(const c of p.children||[])out.push(..._renderNew(c,indent+'  '));
  return out;
}
/** Applies page ticks and user-added tasks to the file text. Never deletes or rewrites existing wording. */
function exportRoadmap(text,local){
  const crlf=text.includes('\r\n');
  const lines=String(text).replace(/\r\n/g,'\n').split('\n');
  const file=parseRoadmapMd(lines.join('\n'));
  const fmap=new Map(file.map(s=>[s.key,s]));
  const toggles=[],inserts=[],changes=[];
  function walk(pt,ft,sec,parent,parentIndent,anchorDefault){
    const used=new Set();let anchor=null;
    for(const p of pt){
      const k=_norm(p.orig||p.title);
      const f=ft.find(x=>!used.has(x)&&_norm(x.title)===k);
      if(f){
        used.add(f);anchor=f;
        if(f.check&&p.done&&!f.done){toggles.push(f.line);changes.push({k:'tick',sec:sec.num,text:f.title})}
        else if(f.check&&!p.done&&f.done)changes.push({k:'skipped-untick',sec:sec.num,text:f.title});
        walk(p.children||[],f.children||[],sec,f,_indentOf(lines,f),null);
      }else if(_isUser(p)){
        const after=anchor?_lastLine(anchor):(ft.length?_lastLine(ft[ft.length-1]):(parent?_lastLine(parent):anchorDefault));
        const indent=anchor?_indentOf(lines,anchor):(ft.length?_indentOf(lines,ft[0]):parentIndent+(parent?'  ':''));
        inserts.push({after,lines:_renderNew(p,indent)});
        changes.push({k:'add',sec:sec.num,text:p.title+((p.children||[]).length?` (+${p.children.length} subtasks)`:'')});
      }else changes.push({k:'skipped-unmatched',sec:sec.num,text:p.title});
    }
  }
  for(const l of local){
    const f=fmap.get(l.key);
    if(!f){changes.push({k:'skipped-section',sec:l.num,text:l.title});continue}
    walk(l.tasks||[],f.tasks,f,null,'',f.start);
  }
  for(const ln of toggles)lines[ln]=lines[ln].replace('[ ]','[x]');
  inserts.forEach((x,i)=>x.i=i);inserts.sort((a,b)=>b.after-a.after||b.i-a.i);
  for(const i of inserts)lines.splice(i.after+1,0,...i.lines);
  return {text:lines.join(crlf?'\r\n':'\n'),changes};
}

/* ---------- three-way sync: base (file at last sync), file (now), page (now) ---------- */
function _applyFileOps(text,ops){
  const crlf=text.includes('\r\n');
  const lines=String(text).replace(/\r\n/g,'\n').split('\n');
  const notes=[];
  for(const t of ops.toggles){
    const l=lines[t.line];
    lines[t.line]=t.done?l.replace('[ ]','[x]'):l.replace(/\[x\]/i,'[ ]');
  }
  for(const r of ops.renames){
    const l=lines[r.line],i=l.indexOf(r.from);
    if(i<0){notes.push({k:'skipped-rename',sec:r.sec,text:`${r.from}  →  ${r.to} (line formatting differs, edit by hand)`});continue}
    lines[r.line]=l.slice(0,i)+r.to+l.slice(i+r.from.length);
  }
  const dead=ops.deletes.map(d=>[d.line,d.last]);
  const inDead=n=>dead.some(([a,b])=>n>=a&&n<=b);
  const edits=[];
  for(const [a,b] of dead)edits.push({pos:a,del:b-a+1,ins:[],order:0});
  ops.inserts.forEach((x,i)=>{
    if(inDead(x.after)){notes.push({k:'skipped-add',sec:x.sec,text:x.lines[0].trim()+' (its parent is being deleted)'});return}
    edits.push({pos:x.after+1,del:0,ins:x.lines,order:i+1});
  });
  edits.sort((a,b)=>b.pos-a.pos||((b.del>0)-(a.del>0))||b.order-a.order);
  for(const e of edits)lines.splice(e.pos,e.del,...e.ins);
  return {text:lines.join(crlf?'\r\n':'\n'),notes};
}

function sync3(baseSecs,fileSecs,pageSecs,opts){
  const partial=!!(opts&&opts.partial);
  const bmap=new Map(baseSecs.map(s=>[s.key,s]));
  const pmap=new Map(pageSecs.map(s=>[s.key,s]));
  const fkeys=new Set(fileSecs.map(s=>s.key));
  const log=[],pageChanges=new Map();
  const ops={toggles:[],renames:[],deletes:[],inserts:[]};
  const L=(k,sec,text)=>log.push({k,sec,text});

  function syncList(B,F,P,sec,parentF,secStart){
    const nb=t=>_norm(t.title);
    // base <-> file
    const bf=new Map(),usedF=new Set();
    B.forEach(b=>{const f=F.find(x=>!usedF.has(x)&&nb(x)===nb(b));if(f){usedF.add(f);bf.set(b,f)}});
    B.forEach(b=>{
      if(bf.has(b))return;let best=null,bs=0.7;
      for(const f of F){if(usedF.has(f))continue;const s=_sim(b.title,f.title);if(s>=bs){bs=s;best=f}}
      if(best){usedF.add(best);bf.set(b,best)}
    });
    const fb=new Map([...bf].map(([b,f])=>[f,b]));
    // page <-> base (a page rename keeps the title it started with in `orig`)
    const pb=new Map(),usedB=new Set();
    P.forEach(p=>{const k=_norm(p.orig||p.title);const b=B.find(x=>!usedB.has(x)&&nb(x)===k);if(b){usedB.add(b);pb.set(p,b)}});
    // page <-> file
    const pf=new Map(),usedPF=new Set();
    P.forEach(p=>{
      const b=pb.get(p);let f=b?bf.get(b):null;
      if(f&&usedPF.has(f))f=null;
      if(!f){const k=_norm(p.title);f=F.find(x=>!usedPF.has(x)&&!fb.has(x)&&_norm(x.title)===k)||null}
      if(f){usedPF.add(f);pf.set(p,f)}
    });

    const out=[],placed=new Map(); // file task -> index in out
    let anchorF=null; // last file task a page task was matched to, for inserts
    for(const p of P){
      const b=pb.get(p),f=pf.get(p);
      if(f){
        const n={...p};
        const ft=f.title,pt=p.title,bt=b?b.title:ft;
        if(_norm(pt)!==_norm(ft)){
          const pageChanged=b?_norm(pt)!==_norm(bt):true;
          if(pageChanged){ops.renames.push({line:f.line,from:ft,to:pt,sec});L('rename-to-file',sec,`${ft}  →  ${pt}`);n.orig=n.orig||ft;n.mod=[...new Set([...(n.mod||[]),'title'])]}
          else{n.title=ft;delete n.orig;if(n.mod){n.mod=n.mod.filter(x=>x!=='title');if(!n.mod.length)delete n.mod}L('rename-from-file',sec,`${pt}  →  ${ft}`)}
        }else{delete n.orig;if(n.mod){n.mod=n.mod.filter(x=>x!=='title');if(!n.mod.length)delete n.mod}}
        n.check=f.check;if(f.group)n.group=true;
        if(f.check){
          const pd=!!p.done,fd=!!f.done,bd=b?!!b.done:fd;
          if(pd!==fd){
            if(pd!==bd){ops.toggles.push({line:f.line,done:pd});L(pd?'tick-to-file':'untick-to-file',sec,f.title)}
            else{n.done=fd;if(fd)n.doing=false;L(fd?'tick-from-file':'untick-from-file',sec,f.title)}
          }
        }
        const take=(k,v)=>{if(v===undefined||v===''||(Array.isArray(v)&&!v.length))delete n[k];else n[k]=v};
        const mod=new Set(p.mod||[]);
        take('note',f.note);take('tags',f.tags);take('depends',f.depends);
        if(!mod.has('effort'))take('effort',f.effort);if(!mod.has('pri'))take('pri',f.pri);
        if(n.removedFromFile){delete n.removedFromFile;L('restored',sec,f.title)}
        const kids=syncList(b?b.children||[]:[],f.children||[],p.children||[],sec,f,secStart);
        if(kids.length)n.children=kids;else delete n.children;
        placed.set(f,out.length);anchorF=f;out.push(n);continue;
      }
      if(b){
        // the file no longer has it
        const n={...p};
        const unchanged=_norm(p.title)===_norm(b.title)&&!!p.done===!!b.done;
        if(!_isUser(n)&&!n.removedFromFile&&unchanged){n.removedFromFile=true;L('removed-in-file',sec,p.title)}
        out.push(n);continue;
      }
      // only in the page: add it to the file after the previous matched sibling
      const after=anchorF?_lastLine(anchorF):(F.length?_lastLine(F[F.length-1]):(parentF?_lastLine(parentF):secStart));
      const indent=anchorF?_indentOf(CUR_LINES,anchorF):(F.length?_indentOf(CUR_LINES,F[0]):(parentF?_indentOf(CUR_LINES,parentF)+'  ':''));
      ops.inserts.push({after,sec,lines:_renderNew(p,indent)});
      L('add-to-file',sec,p.title+((p.children||[]).length?` (+${p.children.length} subtasks)`:''));
      out.push({...p});
    }
    // only in the file
    F.forEach((f,i)=>{
      if(placed.has(f))return;
      const b=fb.get(f);
      if(b){
        // the page deleted it. Honour that only if the file has not touched it since the base.
        const same=_norm(f.title)===_norm(b.title)&&!!f.done===!!b.done&&_same(_stripKids(f),_stripKids(b));
        if(same){ops.deletes.push({line:f.line,last:_lastLine(f),sec});L('delete-to-file',sec,f.title);return}
        L('restored-kept',sec,f.title+' (changed in the file, so kept)');
      }else L('new-from-file',sec,f.title+(f.children&&f.children.length?` (with ${_countTasks(f)-1} subtask${_countTasks(f)-1===1?'':'s'})`:''));
      const fresh=_freshTask(f);
      let at=0;
      for(let j=i-1;j>=0;j--){if(placed.has(F[j])){at=placed.get(F[j])+1;break}}
      out.splice(at,0,fresh);
      // keep the recorded positions of later placed items valid
      for(const [k,v] of placed)if(v>=at)placed.set(k,v+1);
    });
    return out;
  }

  let CUR_LINES=[];
  return {
    run(fileText){
      CUR_LINES=String(fileText).replace(/\r\n/g,'\n').split('\n');
      for(const f of fileSecs){
        const p=pmap.get(f.key);
        if(!p){
          if(partial)continue;
          const doc={num:f.num,phase:f.phase,title:f.title,pri:f.pri,tags:f.tags,depends:f.depends,sub:f.sub,intro:f.intro,order:f.order,tasks:f.tasks.map(t=>_freshTask(t))};
          pageChanges.set(f.key,{isNew:true,doc});L('section-new',f.num,`${f.title} (${f.n} tasks)`);continue;
        }
        const b=bmap.get(f.key)||{tasks:[]};
        const tasks=syncList(b.tasks||[],f.tasks||[],p.tasks||[],f.num,null,f.start);
        const fields={};
        if(!_same(tasks,p.tasks||[]))fields.tasks=tasks;
        if(p.removedFromFile){fields.removedFromFile=false}
        if(Object.keys(fields).length)pageChanges.set(f.key,{isNew:false,fields});
      }
      for(const p of pageSecs){
        if(partial||fkeys.has(p.key)||/^u-/.test(p.key)||p.removedFromFile)continue;
        pageChanges.set(p.key,{isNew:false,fields:{removedFromFile:true}});L('section-removed',p.num,p.title);
      }
      const applied=_applyFileOps(fileText,ops);
      applied.notes.forEach(n=>log.push(n));
      return {pageChanges,fileText:applied.text,fileChanged:applied.text!==fileText,log};
    }
  };
}
function runSync3(baseText,fileText,pageSecs,opts){
  return sync3(parseRoadmapMd(baseText),parseRoadmapMd(fileText),pageSecs,opts).run(fileText);
}
/** Keys of the sections whose tasks differ between two versions of the file (so only those page documents need loading). */
function changedKeys(baseText,fileText){
  const strip=ts=>(ts||[]).map(t=>({title:t.title,check:t.check,done:t.done,note:t.note,effort:t.effort,pri:t.pri,tags:t.tags,depends:t.depends,children:strip(t.children)}));
  const b=new Map(parseRoadmapMd(baseText).map(s=>[s.key,s]));
  const out=[];
  for(const f of parseRoadmapMd(fileText)){
    const o=b.get(f.key);
    if(!o||!_same(strip(o.tasks),strip(f.tasks))||o.title!==f.title)out.push(f.key);
  }
  for(const k of b.keys())if(!parseRoadmapMd(fileText).some(s=>s.key===k))out.push(k);
  return out;
}

/* ---------- command line: node sync-tool.js export|merge ROADMAP.md sections.json ---------- */
if(typeof module!=='undefined'){
  module.exports={parseRoadmapMd,mergeRoadmap,exportRoadmap,runSync3,changedKeys};
  if(require.main===module){
    const fs=require('fs');const [,,cmd,mdPath,jsonPath,outPath]=process.argv;
    if(!cmd||!mdPath||!jsonPath){console.error('usage: node sync-tool.js sync|export|merge|changed-keys ROADMAP.md sections.json|base.md [out.md] [base.md] [--partial]');process.exit(2)}
    const md=fs.readFileSync(mdPath,'utf8');let secs=null;
    if(cmd!=='changed-keys'){const raw=JSON.parse(fs.readFileSync(jsonPath,'utf8'));secs=Array.isArray(raw)?raw:raw&&raw.sections;
      if(!Array.isArray(secs)){console.error('sections.json must be an array of section documents');process.exit(2)}}
    if(cmd==='export'){const r=exportRoadmap(md,secs);if(outPath)fs.writeFileSync(outPath,r.text);console.log(JSON.stringify({changed:r.text!==md,changes:r.changes},null,1))}
    else if(cmd==='sync'){
      // node sync-tool.js sync FILE.md sections.json out.md BASE.md
      const baseText=fs.readFileSync(process.argv[6]||mdPath,'utf8');
      const r=runSync3(baseText,md,secs,{partial:process.argv.includes('--partial')});if(outPath)fs.writeFileSync(outPath,r.fileText);
      console.log(JSON.stringify({fileChanged:r.fileChanged,log:r.log,pageChanges:[...r.pageChanges].map(([k,v])=>[k,v])}));
    }
    else if(cmd==='changed-keys'){
      // node sync-tool.js changed-keys FILE.md BASE.md   (no sections.json needed)
      console.log(JSON.stringify(changedKeys(fs.readFileSync(jsonPath,'utf8'),md)));
    }
    else if(cmd==='merge'){const r=mergeRoadmap(secs,parseRoadmapMd(md));console.log(JSON.stringify({changes:[...r.changes].map(([k,v])=>[k,v]),log:r.log}))}
    else{console.error('unknown command');process.exit(2)}
  }
}
