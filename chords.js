/* NepTuner chord library. Frets run from string 6 to string 1.
   -1 = do not play, 0 = open. Original diagrams, no external images or code.
   The four video voicings were checked against Paul Davids' companion lesson:
   https://pauldavidsguitar.com/blog/play-solo-guitar-like-mike-dawes-complete-dadgad-guide/
   Musical data and renderer are shared with the offline regression tests. */
(function(root){
  'use strict';
  const lesson = 'https://pauldavidsguitar.com/blog/play-solo-guitar-like-mike-dawes-complete-dadgad-guide/';
  const letters = ['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
  const latin = ['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
  const lettersFlat = ['C','D♭','D','E♭','E','F','G♭','G','A♭','A','B♭','B'];
  const latinFlat = ['Do','Re♭','Re','Mi♭','Mi','Fa','Sol♭','Sol','La♭','La','Si♭','Si'];
  const make = (id, pc, suffix, intervals, frets, fingers, extra = {}) =>
    ({id, pc, suffix, intervals, frets, fingers, ...extra});
  const libraries = [
    {id:'standard', name:'E Standard', midi:[40,45,50,55,59,64], shapes:[
      make('c', 0, '', [0,4,7], [-1,3,2,0,1,0], [0,3,2,0,1,0]),
      make('d', 2, '', [0,4,7], [-1,-1,0,2,3,2], [0,0,0,1,3,2]),
      make('e', 4, '', [0,4,7], [0,2,2,1,0,0], [0,2,3,1,0,0]),
      make('g', 7, '', [0,4,7], [3,2,0,0,0,3], [2,1,0,0,0,3]),
      make('a', 9, '', [0,4,7], [-1,0,2,2,2,0], [0,0,1,2,3,0]),
      make('am', 9, 'm', [0,3,7], [-1,0,2,2,1,0], [0,0,2,3,1,0]),
      make('dm', 2, 'm', [0,3,7], [-1,-1,0,2,3,1], [0,0,0,2,3,1]),
      make('em', 4, 'm', [0,3,7], [0,2,2,0,0,0], [0,2,3,0,0,0]),
    ]},
    {id:'dadgad', name:'DADGAD', midi:[38,45,50,55,57,62], shapes:[
      make('d5', 2, '5', [0,7], [0,0,0,2,0,0], [0,0,0,1,0,0],
        {video:true, tip:'power'}),
      make('d-high', 2, '', [0,4,7], [12,12,12,11,0,0], [2,3,4,1,0,0],
        {video:true, position:12, tip:'mobile'}),
      make('dm-high', 2, 'm', [0,3,7], [12,12,12,10,0,0], [2,3,4,1,0,0],
        {video:true, position:12, tip:'minorMobile'}),
      make('em11', 4, 'm11', [0,2,3,5,7,10], [2,2,4,0,0,0], [1,1,3,0,0,0],
        {video:true, barre:{fret:2, from:0, to:1, finger:1}, tip:'em11'}),
      make('dsus4', 2, 'sus4', [0,5,7], [0,0,0,0,0,0], [0,0,0,0,0,0],
        {tip:'open'}),
      make('d-low', 2, '', [0,4,7], [0,0,4,2,0,0], [0,0,3,1,0,0],
        {position:1}),
      make('dm-low', 2, 'm', [0,3,7], [0,0,3,2,0,0], [0,0,2,1,0,0],
        {position:1}),
      make('gadd9', 7, 'add9', [0,2,4,7], [5,2,0,0,0,0], [4,1,0,0,0,0],
        {tip:'gadd9'}),
      make('a7sus4', 9, '7sus4', [0,5,7,10], [-1,0,2,0,0,0], [0,0,1,0,0,0]),
      make('asus4', 9, 'sus4', [0,5,7], [-1,0,2,2,0,0], [0,0,1,2,0,0]),
      make('cadd9', 0, 'add9', [0,2,4,7], [-1,3,2,0,3,0], [0,2,1,0,3,0],
        {tip:'cadd9'}),
      make('bm7', 11, 'm7', [0,3,7,10], [-1,2,4,4,0,0], [0,1,3,4,0,0]),
    ]},
    {id:'openc', name:'Open C · CGCGCE', midi:[36,43,48,55,60,64], shapes:[
      make('c', 0, '', [0,4,7], [0,0,0,0,0,0], [0,0,0,0,0,0], {tip:'openC'}),
      make('d', 2, '', [0,4,7], [2,2,2,2,2,2], [1,1,1,1,1,1],
        {barre:{fret:2,from:0,to:5,finger:1}, position:2}),
      make('f', 5, '', [0,4,7], [5,5,5,5,5,5], [1,1,1,1,1,1],
        {barre:{fret:5,from:0,to:5,finger:1}, position:5}),
      make('g', 7, '', [0,4,7], [7,7,7,7,7,7], [1,1,1,1,1,1],
        {barre:{fret:7,from:0,to:5,finger:1}, position:7}),
      make('am', 9, 'm', [0,3,7], [-1,2,0,2,0,0], [0,1,0,2,0,0]),
      make('dm', 2, 'm', [0,3,7], [-1,-1,2,2,2,1], [0,0,2,3,4,1]),
      make('em', 4, 'm', [0,3,7], [-1,-1,4,4,4,3], [0,0,2,3,4,1]),
      make('cm', 0, 'm', [0,3,7], [0,0,0,0,3,3], [0,0,0,0,1,2], {flat:true}),
      make('c7', 0, '7', [0,4,7,10], [0,0,0,3,0,0], [0,0,0,1,0,0], {flat:true}),
      make('cmaj7', 0, 'maj7', [0,4,7,11], [0,0,0,4,0,0], [0,0,0,1,0,0]),
      make('csus4', 0, 'sus4', [0,5,7], [0,0,0,0,0,1], [0,0,0,0,0,1]),
      make('cadd9', 0, 'add9', [0,2,4,7], [0,0,0,0,2,0], [0,0,0,0,1,0]),
    ]},
  ];
  function freeze(value){
    Object.values(value).forEach(child => { if (child && typeof child === 'object') freeze(child); });
    return Object.freeze(value);
  }
  freeze(libraries);
  const copy = {
    en:{title:'Chord library', basic:'Basic chords', video:'The four lesson shapes', more:'More positions',
      positions:'{n} positions', return:'Back to tuning', noMic:'Offline reference · microphone off',
      guide:'No capo. String 6 (lowest) is on the left. Numbers in dots are fingers.',
      open:'open', muted:'do not play', fret:'fret', finger:'finger', string:'String',
      openStrings:'Open strings · low → high', notes:'Notes', frets:'Frets · 6 → 1',
      all:'Play all six strings.', from:'Play from string {n} down to string 1.',
      barre:'Partial barre', fullBarre:'Full barre', noBarre:'No barre', fingers:'1 index · 2 middle · 3 ring · 4 little',
      legend:'× do not play · ○ open · ● finger / fret', lesson:'Paul Davids × Mike Dawes · lesson',
      major:'major', minor:'minor', pos:'fret {n}',
      tips:{power:'No third: this D5 shape is neither major nor minor.',
        mobile:'Strings 6–4 at fret 12. Keep the top two strings open; moving this shape changes the chord colour and name.',
        minorMobile:'From the high D shape, move only string 3 from fret 11 to fret 10.',
        em11:'Index across strings 6–5 at fret 2; ring finger on string 4 at fret 4. The top three strings stay open.',
        open:'All strings open: a suspended chord, not D major.',
        openC:'All six strings open give C major. A full barre moves this major shape up the neck.',
        gadd9:'Reach from fret 2 to fret 5 without forcing your hand. The open A is the added ninth.',
        cadd9:'Fret string 2 at fret 3 too: leaving it open would add an A and change the chord.'}},
    es:{title:'Biblioteca de acordes', basic:'Acordes básicos', video:'Las cuatro formas de la lección', more:'Más posiciones',
      positions:'{n} posiciones', return:'Volver a afinar', noMic:'Consulta sin conexión · micrófono apagado',
      guide:'Sin capo. La 6.ª cuerda (grave) está a la izquierda. Los números de los puntos indican los dedos.',
      open:'al aire', muted:'no tocar', fret:'traste', finger:'dedo', string:'Cuerda',
      openStrings:'Al aire · grave → aguda', notes:'Notas', frets:'Trastes · 6 → 1',
      all:'Toca las seis cuerdas.', from:'Toca desde la cuerda {n} hasta la 1.ª.',
      barre:'Cejilla parcial', fullBarre:'Cejilla completa', noBarre:'Sin cejilla', fingers:'1 índice · 2 medio · 3 anular · 4 meñique',
      legend:'× no tocar · ○ al aire · ● dedo / traste', lesson:'Paul Davids × Mike Dawes · lección',
      major:'mayor', minor:'menor', pos:'traste {n}',
      tips:{power:'Sin tercera: esta posición de Re5 no es mayor ni menor.',
        mobile:'Cuerdas 6–4 en el traste 12. Deja las dos agudas al aire; al mover la forma cambian el color y el nombre del acorde.',
        minorMobile:'Desde el Re agudo, mueve solo la 3.ª cuerda del traste 11 al 10.',
        em11:'Índice sobre las cuerdas 6–5 en el traste 2; anular en la 4.ª, traste 4. Las tres agudas quedan al aire.',
        open:'Todas las cuerdas al aire: es un acorde suspendido, no Re mayor.',
        openC:'Las seis cuerdas al aire forman Do mayor. Con una cejilla completa puedes desplazar esta forma mayor por el mástil.',
        gadd9:'Abarca los trastes 2 a 5 sin forzar la mano. El La al aire aporta la novena.',
        cadd9:'Pisa también la 2.ª cuerda en el traste 3: al dejarla al aire añadirías un La y cambiaría el acorde.'}},
  };
  const pc = n => ((n % 12) + 12) % 12;
  function forTuning(instrument, midi){
    if (instrument !== 'guitar' || !Array.isArray(midi)) return null;
    return libraries.find(lib => lib.midi.length === midi.length && lib.midi.every((n,i) => n === midi[i])) || null;
  }
  function symbol(shape, lang = 'en') { return (lang === 'es' ? latin : letters)[shape.pc] + shape.suffix; }
  function title(shape, lang){
    const names = lang === 'es' ? latin : letters;
    const tr = copy[lang] || copy.en;
    return ['', 'm'].includes(shape.suffix)
      ? names[shape.pc] + ' ' + tr[shape.suffix === 'm' ? 'minor' : 'major'] : symbol(shape, lang);
  }
  function pitches(lib, shape){
    return shape.frets.map((f,i) => f < 0 ? null : lib.midi[i] + f);
  }
  function positionLabel(shape, lang){
    return shape.position ? (copy[lang] || copy.en).pos.replace('{n}', shape.position) : '';
  }
  function drawDiagram(container, lib, shape, lang){
    const doc = container.ownerDocument, tr = copy[lang] || copy.en;
    const width = Math.round(container.getBoundingClientRect().width) || 280;
    const node = (tag, attrs, text) => {
      const el = doc.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs || {}).forEach(([key,value]) => el.setAttribute(key, String(value)));
      if (text !== undefined) el.textContent = text;
      return el;
    };
    const fretted = shape.frets.filter(f => f > 0);
    const start = fretted.length && Math.max(...fretted) > 4 ? Math.min(...fretted) : 1;
    const left = 34, right = width - 18, top = 54, step = 37;
    const xs = Array.from({length:6}, (_,i) => left + i * (right-left) / 5);
    const y = f => top + (f-start+.5)*step;
    const svg = node('svg', {viewBox:`0 0 ${width} 248`, width, height:248, role:'img',
      'aria-labelledby':'chord-diagram-title chord-diagram-description'});
    svg.appendChild(node('title', {id:'chord-diagram-title'}, title(shape, lang) + ' · ' + lib.name));
    const description = shape.frets.map((f,i) => `${tr.string} ${6-i}: ${f < 0 ? tr.muted : f === 0 ? tr.open : tr.fret+' '+f+', '+tr.finger+' '+shape.fingers[i]}`).join('. ');
    svg.appendChild(node('desc', {id:'chord-diagram-description'}, description));
    for (let i=0; i<=4; i++) {
      svg.appendChild(node('line', {x1:left,x2:right,y1:top+i*step,y2:top+i*step,class:i===0 && start===1 ? 'chord-nut' : 'chord-fret'}));
      if (i<4) svg.appendChild(node('text', {x:14,y:top+(i+.5)*step+4,'text-anchor':'middle',class:'chord-svg-label'},start+i));
    }
    xs.forEach((x,i) => {
      svg.appendChild(node('line', {x1:x,x2:x,y1:top,y2:top+4*step,class:'chord-string','stroke-width':2.1-i*.22}));
      svg.appendChild(node('text', {x,y:14,'text-anchor':'middle',class:'chord-svg-label'},6-i));
      if (shape.frets[i] < 0) svg.appendChild(node('text', {x,y:41,'text-anchor':'middle',class:'chord-svg-mute'},'×'));
      if (shape.frets[i] === 0) svg.appendChild(node('circle', {cx:x,cy:35,r:5,class:'chord-open'}));
      svg.appendChild(node('text', {x,y:223,'text-anchor':'middle',class:'chord-svg-label'},letters[pc(lib.midi[i])]));
    });
    if (shape.barre) {
      const b=shape.barre;
      svg.appendChild(node('rect',{x:xs[b.from]-11,y:y(b.fret)-11,width:xs[b.to]-xs[b.from]+22,height:22,rx:11,class:'chord-dot'}));
      svg.appendChild(node('text',{x:(xs[b.from]+xs[b.to])/2,y:y(b.fret)+4.5,'text-anchor':'middle',class:'chord-digit'},b.finger));
    }
    shape.frets.forEach((f,i) => {
      const b=shape.barre;
      if (f <= 0 || (b && i>=b.from && i<=b.to && f===b.fret)) return;
      svg.appendChild(node('circle',{cx:xs[i],cy:y(f),r:11,class:'chord-dot'}));
      svg.appendChild(node('text',{x:xs[i],y:y(f)+4.5,'text-anchor':'middle',class:'chord-digit'},shape.fingers[i]));
    });
    svg.appendChild(node('text',{x:width/2,y:244,'text-anchor':'middle',class:'chord-svg-label'},tr.openStrings));
    container.replaceChildren(svg);
  }
  const observers = new WeakMap();
  function clear(host){
    const observer = observers.get(host);
    if (observer) { observer.disconnect(); observers.delete(host); }
    host.replaceChildren();
  }
  function render(host, lib, {lang='en', selectedId, onSelect, onClose} = {}){
    clear(host);
    const tr = copy[lang] || copy.en, doc = host.ownerDocument;
    const shape = lib.shapes.find(item => item.id === selectedId) || lib.shapes[0];
    const names = shape.flat ? (lang === 'es' ? latinFlat : lettersFlat) : (lang === 'es' ? latin : letters);
    const el = (tag, className, text) => {
      const result=doc.createElement(tag);
      if (className) result.className=className;
      if (text !== undefined) result.textContent=text;
      return result;
    };
    const heading = el('div','chord-library-heading');
    heading.append(el('h2','',tr.title), el('span','',tr.positions.replace('{n}',lib.shapes.length)));
    host.append(heading,el('p','chord-guide',tr.guide));
    const groups = lib.id === 'dadgad' ? [[tr.video,true],[tr.more,false]] : [[tr.basic,false]];
    groups.forEach(([label,video]) => {
      const section=el('section','chord-group');
      section.appendChild(el('h3','',label));
      const list=el('div','chord-list'); list.setAttribute('role','group'); list.setAttribute('aria-label',label);
      lib.shapes.filter(item => !!item.video === video).forEach(item => {
        const button=el('button','chord-choice'); button.type='button'; button.dataset.chord=item.id;
        button.setAttribute('aria-pressed',String(item.id===shape.id));
        button.setAttribute('aria-controls','chord-detail');
        const position=positionLabel(item,lang);
        button.setAttribute('aria-label',title(item,lang)+(position ? ', '+position : ''));
        button.append(el('span','',symbol(item,lang)));
        if (position) button.appendChild(el('small','',position));
        else if (lang==='es') button.appendChild(el('small','',symbol(item,'en')));
        button.addEventListener('click',() => {
          if (onSelect) onSelect(item.id);
          const selected=host.querySelector('[data-chord="'+item.id+'"]');
          if (selected) selected.focus();
        });
        list.appendChild(button);
      });
      section.appendChild(list); host.appendChild(section);
    });
    const detail=el('article','chord-detail'); detail.id='chord-detail'; detail.setAttribute('aria-labelledby','chord-title');
    const head=el('div','chord-detail-heading');
    const name=el('h3','',title(shape,lang)); name.id='chord-title';
    head.append(name,el('span','chord-symbol',symbol(shape,'en')));
    const barreLabel = !shape.barre ? tr.noBarre : shape.barre.from===0 && shape.barre.to===5 ? tr.fullBarre : tr.barre;
    detail.append(head,el('p','chord-position',barreLabel+(shape.position ? ' · '+positionLabel(shape,lang) : '')));
    const diagram=el('div','chord-diagram'); detail.appendChild(diagram);
    const lowest=6-shape.frets.findIndex(f=>f>=0);
    detail.appendChild(el('p','chord-strum',lowest===6 ? tr.all : tr.from.replace('{n}',lowest)));
    detail.appendChild(el('p','chord-frets',tr.frets+': '+shape.frets.map(f=>f<0?'×':f).join(' · ')));
    detail.appendChild(el('p','chord-notes',tr.notes+': '+shape.intervals.map(n=>names[pc(n+shape.pc)]).join(' · ')));
    if (shape.tip) detail.appendChild(el('p','chord-tip',tr.tips[shape.tip]));
    const legend=el('div','chord-legend'); legend.append(el('p','',tr.legend),el('p','',tr.fingers)); detail.appendChild(legend);
    if (shape.video) {
      const link=el('a','chord-source',tr.lesson); link.href=lesson; link.target='_blank'; link.rel='noopener noreferrer'; detail.appendChild(link);
    }
    host.appendChild(detail);
    const back=el('button','chord-back',tr.return); back.type='button'; back.addEventListener('click',()=>onClose && onClose());
    host.append(back,el('p','chord-offline',tr.noMic));
    drawDiagram(diagram,lib,shape,lang);
    if (typeof ResizeObserver !== 'undefined') {
      const observer=new ResizeObserver(()=>drawDiagram(diagram,lib,shape,lang)); observer.observe(diagram); observers.set(host,observer);
    }
    return shape;
  }
  root.NepTunerChords = Object.freeze({libraries,forTuning,symbol,title,pitches,drawDiagram,render,clear});
})(typeof window !== 'undefined' ? window : globalThis);
