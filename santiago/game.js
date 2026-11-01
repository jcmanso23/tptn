import { SECRETS } from './secrets.js?v=santiago-v1';
const KEY = 'topotino_santiago_secrets_v1';
const $ = (id) => document.getElementById(id);
const ids = SECRETS.map(s => s.id);
const defaults = () => ({version:1, started:false, found:[], hints:[], deferred:[], selected:1, walkEnded:false});
let storageFailed = false;
let game = defaults();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (saved?.version === 1) {
      game = {...defaults(), started:saved.started === true, walkEnded:saved.walkEnded === true};
      for (const key of ['found','hints','deferred']) game[key] = [...new Set((Array.isArray(saved[key]) ? saved[key] : []).filter(id => ids.includes(id)))];
      game.deferred = game.deferred.filter(id => !game.found.includes(id));
      game.selected = ids.includes(saved.selected) ? saved.selected : 1;
    }
  }
} catch { storageFailed = true; }
let map, tiles, positionMarker, simple = false;
const markers = [];
// Las plazas agrupan los puntos muy próximos para que se puedan pulsar en móvil.
// Cada secreto conserva sus coordenadas reales para «Ir al lugar».
const groups = [[1],[2],[3],[4,5],[6,7,8,9],[10,11,12]].map(ids => ids.map(id => SECRETS[id-1]));
const groupLabel = group => group.length > 2 ? `${group[0].id}–${group.at(-1).id}` : group.map(s=>s.id).join('·');

function node(tag, text, className) {const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function button(label, action, className='') {const b=node('button',label,className);b.type='button';b.addEventListener('click',action);return b;}
function status(id) {return game.found.includes(id)?'found':game.deferred.includes(id)?'deferred':'pending';}
function statusLabel(id) {return {found:'✓ Encontrado',deferred:'◷ Para después',pending:'Por descubrir'}[status(id)];}
function save() {
  try {localStorage.setItem(KEY,JSON.stringify(game));} catch {storageFailed=true;}
  if(storageFailed){$('notice').hidden=false;$('notice').textContent='Podéis seguir jugando, pero este navegador no está guardando el paseo. Mantened esta página abierta para conservar lo que lleváis.';}
}
function select(id, focus=true) {
  game.selected=id;save();render();
  if(map&&!simple)map.panTo([SECRETS[id-1].lat,SECRETS[id-1].lng]);
  if(focus){$('detail').scrollIntoView({behavior:'auto',block:'start'});$('detail').querySelector('h2').focus({preventScroll:true});}
}
function next() {
  const pending=SECRETS.filter(s=>status(s.id)==='pending');
  const candidate=pending.find(s=>s.id>game.selected)||pending[0]||SECRETS.find(s=>status(s.id)==='deferred');
  if(candidate)select(candidate.id);else celebrate();
}
function found() {
  if(game.found.includes(game.selected))return;
  game.found.push(game.selected);game.deferred=game.deferred.filter(id=>id!==game.selected);save();render();
  $('detail').querySelector('h2').focus({preventScroll:true});
  if(game.found.length===12)celebrate();
}
function defer() {
  if(!game.deferred.includes(game.selected))game.deferred.push(game.selected);
  save();render();next();
}
function renderDetail() {
  const s=SECRETS[game.selected-1], done=status(s.id)==='found';
  const root=$('detail');root.replaceChildren();root.className=`detail ${done?'found':''}`;
  const label=node('div',undefined,'secret-label');label.append(node('span',String(s.id),'number'),node('span',statusLabel(s.id),'state-label'));root.append(label);
  const title=node('h2',s.title);title.tabIndex=-1;root.append(title,node('p',s.zone,'zone'));
  if(s.inside)root.append(node('p','Este secreto está dentro de la iglesia. Entrad solo si está abierta y se permite la visita; respetad las celebraciones.','condition'));
  if(s.night)root.append(node('p','Para después de oscurecer, si la iluminación forma la sombra. De día podéis guardarlo para otra ocasión.','condition night'));
  if(!done){
    root.append(node('p',s.clue,'clue'));
    if(game.hints.includes(s.id))root.append(node('p',s.hint,'hint'));
    const actions=node('div',undefined,'actions');
    if(!game.hints.includes(s.id)) actions.append(button('Otra pista',()=>{game.hints.push(s.id);save();render();}));
    const go=node('a','Ir al lugar');go.href=`https://www.google.com/maps?q=${s.lat},${s.lng}`;go.target='_blank';go.rel='noopener noreferrer';actions.append(go);
    actions.append(button('¡Lo encontramos!',found,'primary'));
    actions.append(button(s.inside?'Está cerrado; seguir':s.night?'Volver después':'Dejar para después',defer,'defer'));
    root.append(actions);
  }else{
    root.append(node('p',s.solution,'clue'),node('h3','La historia que guarda'),node('p',s.story));
    if(s.bonus)root.append(node('p',s.bonus,'hint'));
    const q=node('div',undefined,'question');q.append(node('h3','Para hablar entre los dos'),node('p',s.question));root.append(q);
    const note=node('div',undefined,'topo-note');const img=node('img');img.src='/images/topotino.png?v=marco-v1';img.alt='Topotino';note.append(img,node('p',s.joke));root.append(note);
    root.append(node('p','Si os apetece, haced una foto con vuestra cámara. No hace falta añadirla al juego.','small'));
    root.append(button('Ver siguiente secreto',next,'primary'));
    root.append(button('Lo marqué sin querer',()=>{game.found=game.found.filter(id=>id!==s.id);game.walkEnded=false;save();render();},'text-button'));
    const details=node('details',undefined,'sources');details.append(node('summary','De dónde viene esta historia'));
    s.sources.forEach((url,i)=>{const a=node('a',`Consultar fuente ${i+1} · ${new URL(url).hostname.replace('www.','')}`);a.href=url;a.target='_blank';a.rel='noopener noreferrer';details.append(a);});root.append(details);
  }
}
function renderList() {
  $('secret-list').replaceChildren();
  SECRETS.forEach(s=>{const b=button('',()=>select(s.id),`secret-tile ${status(s.id)}`);b.setAttribute('aria-current',String(s.id===game.selected));b.append(node('span',String(s.id),'number'));const label=node('span',s.title);label.append(node('small',statusLabel(s.id)));b.append(label);$('secret-list').append(b);});
}
function groupStatus(group) {return group.every(s=>status(s.id)==='found')?'found':group.some(s=>status(s.id)==='deferred')?'deferred':'pending';}
function renderMarkers(){
  markers.forEach(({marker,group})=>{
    const label=groupLabel(group);
    marker.setIcon(L.divIcon({className:`map-pin ${groupStatus(group)}`,html:`<span>${group.every(s=>status(s.id)==='found')?'✓ ':''}${label}</span>`,iconSize:[group.length>2?76:group.length>1?64:46,44],iconAnchor:[group.length>2?38:group.length>1?32:23,22]}));
    const content=node('div');group.forEach(s=>content.append(button(`${s.id}. ${s.title} · ${statusLabel(s.id)}`,()=>{map.closePopup();select(s.id);})));marker.bindPopup(content);
  });
}
function renderSimple(){
  const host=$('simple-map');host.replaceChildren();
  const ns='http://www.w3.org/2000/svg';
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 640 470');svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('role','group');svg.setAttribute('aria-label','Plano aproximado de las zonas de Santiago');
  const el=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text)e.textContent=text;return e;};
  svg.append(el('rect',{width:640,height:470,fill:'#d9edf0'}));
  for(let x=0;x<640;x+=40)svg.append(el('path',{d:`M${x} 0V470`,stroke:'#c5dfe3','stroke-width':1}));
  for(let y=0;y<470;y+=40)svg.append(el('path',{d:`M0 ${y}H640`,stroke:'#c5dfe3','stroke-width':1}));
  const labels=[[70,40,'N ↑'],[60,180,'Obradoiro'],[330,135,'Catedral'],[400,35,'Quintana'],[200,265,'Rúa do Vilar'],[395,345,'Rúa Nova'],[80,444,'Entrerrúas'],[400,220,'Praterías']];
  labels.forEach(([x,y,t])=>svg.append(el('text',{x,y,class:'simple-caption'},t)));
  groups.forEach(group=>{
    const s=group[0], x=58+(s.lng+8.5471)/.0043*520,y=60+(42.8811-s.lat)/.0035*360;
    const g=el('g',{class:`simple-point ${groupStatus(group)}`,role:'button',tabindex:0,'aria-label':group.map(a=>`${a.id}. ${a.title}, ${statusLabel(a.id)}`).join(';')});
    g.append(el('circle',{cx:x,cy:y,r:group.length>1?28:22}),el('text',{x,y:y+6,'text-anchor':'middle'},groupLabel(group)));
    const open=()=>{if(group.length===1)select(s.id);else{showView('list');$('secret-list').querySelectorAll('button')[s.id-1].focus();}};
    g.addEventListener('click',open);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});svg.append(g);
  });
  host.append(svg);
}
function render(){
  $('count').textContent=`${game.found.length} / 12`;$('progress').value=game.found.length;
  renderDetail();renderList();renderMarkers();renderSimple();
}
function showView(view){
  $('map-view').hidden=view!=='map';$('list-view').hidden=view!=='list';
  $('map-tab').setAttribute('aria-pressed',String(view==='map'));$('list-tab').setAttribute('aria-pressed',String(view==='list'));
  if(view==='map'&&map)requestAnimationFrame(()=>map.invalidateSize());
}
function useSimple(value){
  simple=value;$('map').hidden=simple;$('simple-map').hidden=!simple;
  $('map-mode').textContent=simple?'Ver mapa de calles':'Usar plano sencillo';
  $('map-status').textContent=simple?'Plano aproximado de las zonas, sin indicaciones de calles. Podéis seguir con las pistas.':'Los puntos indican la zona. El detalle lo encontráis vosotros.';
  if(map&&!simple)requestAnimationFrame(()=>map.invalidateSize());
}
function initMap(){
  if(!window.L){useSimple(true);return;}
  map=L.map('map',{scrollWheelZoom:false,maxZoom:19,minZoom:14}).fitBounds([[42.8775,-8.5473],[42.8815,-8.5428]]);
  tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
  tiles.on('tileerror',()=>{if(!simple)useSimple(true);});
  groups.forEach(group=>{const marker=L.marker([group[0].lat,group[0].lng],{title:group.map(s=>`${s.id}. ${s.title}`).join(' / ')}).addTo(map);markers.push({marker,group});});
  renderMarkers();
  if(!navigator.onLine)useSimple(true);
}
function begin(){
  game.started=true;save();$('welcome').hidden=true;$('adventure').hidden=false;
  if(!map)initMap();else requestAnimationFrame(()=>map.invalidateSize());render();$('start').textContent='Continuar nuestro paseo';
}
function celebrate(){
  game.walkEnded=true;save();const count=game.found.length;
  $('celebration-title').textContent=count===12?'¡Los doce secretos son vuestros!':'¡Un paseo para recordar!';
  $('celebration-copy').textContent=count===12?'Habéis descubierto doce rincones y doce historias de Santiago. ¡Equipo de exploradores al completo!':`Habéis descubierto ${count} de los 12 secretos. Cada detalle encontrado cuenta; el paseo podéis continuarlo otro día.`;
  $('stamp-book').replaceChildren();SECRETS.forEach(s=>{const stamp=node('span',String(s.id),`stamp ${status(s.id)==='found'?'found':''}`);stamp.setAttribute('aria-label',`${s.id}: ${statusLabel(s.id)}`);$('stamp-book').append(stamp);});
  $('celebration-pending').textContent=count<12?'Los secretos que faltan siguen guardados en el mapa. La iglesia y el peregrino nocturno también pueden esperar.':'¡Guardad vuestras fotos y vuestros recuerdos!';
  $('resume').textContent=count===12?'Revisar nuestros secretos':'Seguir explorando';
  if(!$('celebration').open)$('celebration').showModal();
}
$('start').addEventListener('click',begin);
$('map-tab').addEventListener('click',()=>showView('map'));
$('list-tab').addEventListener('click',()=>showView('list'));
$('map-mode').addEventListener('click',()=>{if(!map){$('map-status').textContent='El mapa de calles no está disponible. El plano y las pistas siguen aquí.';return;}useSimple(!simple);});
$('finish').addEventListener('click',celebrate);
$('resume').addEventListener('click',()=>{$('celebration').close();game.walkEnded=false;save();});
$('celebration').addEventListener('cancel',()=>{game.walkEnded=false;save();});
$('reset').addEventListener('click',()=>{
  if(!window.confirm('¿Reiniciar solo el paseo de Santiago? Se borrarán sus hallazgos y pistas. La partida del comunicador se conserva.'))return;
  game=defaults();save();$('celebration').close();$('adventure').hidden=true;$('welcome').hidden=false;$('start').textContent='Abrir nuestro mapa';render();window.scrollTo(0,0);
});
$('locate').addEventListener('click',()=>{
  if(!navigator.geolocation){$('map-status').textContent='No hay ubicación disponible. Podéis orientaros con las zonas y las pistas.';return;}
  $('locate').disabled=true;$('map-status').textContent='Buscando vuestra posición…';
  navigator.geolocation.getCurrentPosition(pos=>{
    $('locate').disabled=false;
    if(map){if(positionMarker)map.removeLayer(positionMarker);positionMarker=L.circleMarker([pos.coords.latitude,pos.coords.longitude],{radius:8,color:'#6950a1',fillOpacity:.8}).addTo(map);if(!simple)map.panTo(positionMarker.getLatLng());}
    $('map-status').textContent='Posición aproximada. El GPS orienta; los secretos los encontráis vosotros.';
  },()=>{$('locate').disabled=false;$('map-status').textContent='Podéis seguir sin ubicación. El mapa y las pistas no necesitan permiso.';},{enableHighAccuracy:false,timeout:10000,maximumAge:60000});
});
window.addEventListener('offline',()=>useSimple(true));
render();
if(game.started){begin();if(game.walkEnded)celebrate();}
if(storageFailed)save();
if('serviceWorker' in navigator)navigator.serviceWorker.register('/service-worker.js?v=santiago-v1').catch(()=>{});
