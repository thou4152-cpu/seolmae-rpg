
const JOBS={
 warrior:{name:"전사",icon:"⚔️",hp:140,mp:30,atk:14,mag:3,def:14,mdef:8,spd:8,crit:.05,grow:[12,2,2,.3,2,1]},
 rogue:{name:"도적",icon:"🗡️",hp:85,mp:35,atk:19,mag:3,def:6,mdef:7,spd:18,crit:.15,grow:[7,3,2.5,.3,.8,.8]},
 archer:{name:"궁수",icon:"🏹",hp:100,mp:40,atk:20,mag:3,def:7,mdef:9,spd:14,crit:.10,grow:[8,3,2.6,.3,1,1]},
 mage:{name:"마법사",icon:"🔮",hp:80,mp:70,atk:5,mag:24,def:5,mdef:15,spd:9,crit:.05,grow:[6,6,.5,3,.7,1.8]}
};

const STARTER_SKILLS={
 warrior:[
  {name:"강타",cost:6,desc:"적 1명에게 155% 물리 피해",type:"single",power:1.55},
  {name:"방패치기",cost:8,desc:"적 1명에게 120% 피해. 안정적인 공격",type:"single",power:1.20}
 ],
 rogue:[
  {name:"급소 찌르기",cost:6,desc:"적 1명에게 145% 피해. 치명타 확률 +25%",type:"crit",power:1.45},
  {name:"연속 베기",cost:9,desc:"적 1명에게 180% 물리 피해",type:"single",power:1.80}
 ],
 archer:[
  {name:"정조준",cost:6,desc:"적 1명에게 160% 원거리 피해",type:"single",power:1.60},
  {name:"관통 화살",cost:10,desc:"모든 적에게 85% 피해",type:"aoePhysical",power:.85}
 ],
 mage:[
  {name:"화염구",cost:8,desc:"적 1명에게 175% 마법 피해",type:"magicSingle",power:1.75},
  {name:"화염 폭발",cost:12,desc:"모든 적에게 115% 마법 피해",type:"magicAoe",power:1.15}
 ]
};


function weaponImage(job,grade){
 const g=["F","E","D","C","B"].includes(grade)?grade:"B";
 return `assets/weapons/${job}_${g}.png`;
}
function itemImage(it){
 if(!it)return "";
 if(it.bossSet){
   if(it.slot==="weapon")return `assets/boss_set/weapon_${G.job}.jpg`;
   return `assets/boss_set/${it.slot}.jpg`;
 }
 if(it.slot==="weapon")return weaponImage(G.job,it.grade);
 const rare=["C","B","A","S","SS","SSS"].includes(it.grade);
 const map={
  head:"helmet",
  armor:rare?"rare_armor":"armor",
  gloves:"gloves",
  boots:"boots",
  necklace:rare?"rare_necklace":"necklace",
  ring:rare?"rare_ring":"ring"
 };
 return map[it.slot]?`assets/items/${map[it.slot]}.jpg`:"";
}
function consumableImage(type){
 return type==="mp"?"assets/items/mp_potion.jpg":"assets/items/hp_potion.jpg";
}


function makeBossItem(){
 const weaponNames={warrior:"족장의 대검",rogue:"족장의 송곳니 단검",archer:"족장의 전투활",mage:"족장 주술사의 지팡이"};
 const pool=[
  {slot:"weapon",name:weaponNames[G.job],stat:G.job==="mage"?"mag":"atk",value:30,specialText:"보스에게 주는 피해 +8%"},
  {slot:"head",name:"족장의 뿔투구",stat:"mdef",value:18,specialText:"HP 50% 이하일 때 받는 피해 8% 감소"},
  {slot:"armor",name:"족장의 붉은 갑옷",stat:"def",value:32,specialText:"피격 시 10% 확률로 다음 공격 피해 +20%"},
  {slot:"gloves",name:"족장의 전투 장갑",stat:"maxMp",value:40,specialText:"적 처치 시 최대 MP의 5% 회복"},
  {slot:"boots",name:"족장의 전투 장화",stat:"spd",value:12,specialText:"전투 시작 첫 턴 속도 +25%"},
  {slot:"necklace",name:"족장의 송곳니 목걸이",stat:"maxHp",value:80,specialText:"적 처치 시 최대 HP의 5% 회복"},
  {slot:"ring",name:"족장의 인장",stat:"crit",value:.08,specialText:"치명타 피해량 +15%"}
 ];
 let it={...pool[r(0,pool.length-1)]};
 return {...it,grade:"C",quality:r(96,110),plus:0,bossSet:true,setName:"고블린 족장"};
}


let inventorySortMode="slot";
function inventoryRows(){
 const order={weapon:0,head:1,armor:2,gloves:3,boots:4,necklace:5,ring:6};
 return G.inventory.map((it,index)=>({it,index})).sort((a,b)=>{
   if(inventorySortMode==="name")return a.it.name.localeCompare(b.it.name,"ko") || (order[a.it.slot]??99)-(order[b.it.slot]??99);
   if(inventorySortMode==="grade"){
     const gr={SSS:0,SS:1,S:2,A:3,B:4,C:5,D:6,E:7,F:8};
     return (gr[a.it.grade]??99)-(gr[b.it.grade]??99) || (order[a.it.slot]??99)-(order[b.it.slot]??99);
   }
   return (order[a.it.slot]??99)-(order[b.it.slot]??99) || a.it.name.localeCompare(b.it.name,"ko");
 });
}
function setInventorySort(mode){
 inventorySortMode=mode;
 if(typeof characterMenu==="function")characterMenu("items");
 else if(typeof myInfo==="function")myInfo("items");
}
function inventorySortBar(){
 return `<div class="inventorySort"><b>정렬</b>
 <button class="stageBtn ${inventorySortMode==="slot"?"sortOn":""}" onclick="setInventorySort('slot')">부위별</button>
 <button class="stageBtn ${inventorySortMode==="name"?"sortOn":""}" onclick="setInventorySort('name')">이름순</button>
 <button class="stageBtn ${inventorySortMode==="grade"?"sortOn":""}" onclick="setInventorySort('grade')">등급순</button></div>`;
}

function bossItemSetInfo(it){
 if(!it||!it.bossSet)return "";
 return `<div class="bossItemSetInfo">👑 고블린 족장 세트 장비<br><small>현재 ${bossSetCount()}/7 장착 · 세트 효과는 위 패널에서 확인</small></div>`;
}

function itemStatText(it){
 if(!it)return "";
 const label={atk:"ATK",mag:"MAG",def:"DEF",mdef:"MDEF",spd:"SPD",crit:"CRIT",maxHp:"HP",maxMp:"MP"}[it.stat]||String(it.stat).toUpperCase();
 const value=it.stat==="crit"?`${Math.round(it.value*100)}%`:it.value;
 return `${label} +${value}${(it.plus||0)>0?` · 강화 +${it.plus}`:""}`;
}

function bossSetCount(){return Object.values(G.equipment||{}).filter(it=>it&&it.bossSet).length}

function bossSetPanel(){
 const n=bossSetCount();
 const row=(need,text)=>`<div class="setEffectRow ${n>=need?"active":"locked"}">
   <span class="setCheck">${n>=need?"✓":"🔒"}</span>
   <span class="setNeed">${need}세트</span>
   <span class="setDesc">${text}</span>
 </div>`;
 return `<div class="bossSetPanelV2">
   <div class="setHeader"><span>👑 고블린 족장 세트 효과</span><b>${n}/7 장착</b></div>
   <div class="setHint">5세트까지만 효과가 있습니다. 남은 2부위는 자유롭게 조합할 수 있습니다.</div>
   ${row(2,"최대 HP / MP +3%")}
   ${row(3,"공격력·마법공격력·방어력·마법방어력 +4%")}
   ${row(4,"적 처치 시 HP / MP 3% 회복")}
   ${row(5,"「족장의 위압」 첫 2턴 주는 피해 +8% / 받는 피해 -5%")}
 </div>`;
}
function bossSetBonuses(){
 const n=bossSetCount();
 return {
  count:n,
  hpMp:n>=2?.03:0,
  allStats:n>=3?.04:0,
  killRecovery:n>=4?.03:0,
  domination:n>=5
 };
}
function effectiveMaxHp(){
 const b=bossSetBonuses();
 return Math.round((G.maxHp+equipmentBonus("maxHp"))*(1+b.hpMp));
}
function effectiveMaxMp(){
 const b=bossSetBonuses();
 return Math.round((G.maxMp+equipmentBonus("maxMp"))*(1+b.hpMp));
}
function clampResources(){
 G.hp=Math.max(0,Math.min(effectiveMaxHp(),Number(G.hp)||0));
 G.mp=Math.max(0,Math.min(effectiveMaxMp(),Number(G.mp)||0));
}
function healHp(amount){
 const before=Number(G.hp)||0;
 G.hp=Math.min(effectiveMaxHp(),before+Math.max(0,Number(amount)||0));
 return G.hp-before;
}
function restoreMp(amount){
 const before=Number(G.mp)||0;
 G.mp=Math.min(effectiveMaxMp(),before+Math.max(0,Number(amount)||0));
 return G.mp-before;
}


function equipmentBonus(stat){
 let total=0;
 for(const it of Object.values(G.equipment||{})){
   if(it&&it.stat===stat)total+=Number(it.value||0);
 }
 return total;
}
function baseCharacterStat(stat){
 // Existing saves may already contain equipment values in G. Preserve playability,
 // while equipment itself remains the authoritative source for future enhancement.
 return Number(G[stat]||0);
}

function effectiveCombatStat(stat){
 const b=bossSetBonuses();
 let v=baseCharacterStat(stat)+equipmentBonus(stat);
 if(b.count>=3 && ["atk","mag","def","mdef"].includes(stat))v*=1.04;
 return v;
}
function setBonusDamageMult(){
 return bossSetBonuses().domination && battle && (battle.turn||1)<=2 ? 1.08 : 1;
}
function setBonusTakenMult(){
 return bossSetBonuses().domination && battle && (battle.turn||1)<=2 ? .95 : 1;
}
function applyBossSetKillRecovery(){
 const b=bossSetBonuses();
 if(!b.killRecovery)return;
 const hpGain=Math.max(1,Math.round(effectiveMaxHp()*b.killRecovery));
 const mpGain=Math.max(1,Math.round(effectiveMaxMp()*b.killRecovery));
 const healed=healHp(hpGain);
 const restored=restoreMp(mpGain);
 battle.log.push(`👑 4세트 효과: HP +${healed}, MP +${restored}`);
}

const MONSTERS=[
 {name:"고블린",icon:"👺",hp:45,atk:11,def:5,mdef:4,spd:8,xp:18,gold:[5,10]},
 {name:"고블린 궁수",icon:"🏹",hp:35,atk:14,def:3,mdef:4,spd:12,xp:20,gold:[6,12]},
 {name:"방패병",icon:"🛡️",hp:65,atk:9,def:10,mdef:6,spd:5,xp:23,gold:[7,12]},
 {name:"주술사",icon:"🧙",hp:32,atk:8,def:3,mdef:10,spd:7,xp:25,gold:[7,13],healer:true}
];
const ELITE={name:"고블린 대장",icon:"👹",hp:150,atk:18,def:12,mdef:9,spd:9,xp:62,gold:[25,40],elite:true};
const BOSS={name:"고블린 족장",icon:"👑",hp:420,atk:24,def:14,mdef:12,spd:9,xp:150,gold:[150,150],boss:true};
let G=null, battle=null;

function fresh(job){
 const j=JOBS[job];
 return {job,level:1,xp:0,nextXp:50,gold:100,stage:1,unlocked:1,hp:j.hp,mp:j.mp,maxHp:j.hp,maxMp:j.mp,
 atk:j.atk,mag:j.mag,def:j.def,mdef:j.mdef,spd:j.spd,crit:j.crit,potions:3,ethers:2,
 equipment:{weapon:null,head:null,armor:null,gloves:null,boots:null,necklace:null,ring:null},inventory:[],marks:0};
}
function save(){localStorage.setItem("dungeonRPG",JSON.stringify(G));document.querySelector("#saveState").textContent="저장됨 ✓"}
function load(){try{G=JSON.parse(localStorage.getItem("dungeonRPG"))}catch(e){}}
function reset(){localStorage.removeItem("dungeonRPG");G=null;renderStart()}
function toast(t){let x=document.querySelector("#toast");x.textContent=t;x.style.display="block";setTimeout(()=>x.style.display="none",1600)}
function r(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function pct(n){return Math.round(n*100)+"%"}
function screen(h){document.querySelector("#screen").innerHTML=h}
function renderStart(){
 screen(`<div class="panel"><div class="title">새로운 모험</div><div class="sub">직업을 선택하세요. 1층: 고블린 초원</div></div>
 <div class="grid jobs">${Object.entries(JOBS).map(([k,j])=>`<button class="job" onclick="chooseJob('${k}')"><b>${j.icon} ${j.name}</b>
 <span class="sub">${k==="warrior"?"높은 체력과 방어력":k==="rogue"?"속도·공격·치명타 특화":k==="archer"?"강력한 원거리 공격": "강력한 마법과 광역 공격"}</span>
 <div class="stats"><span class="stat">HP ${j.hp}</span><span class="stat">ATK ${j.atk}</span><span class="stat">DEF ${j.def}</span><span class="stat">SPD ${j.spd}</span></div></button>`).join("")}</div>
 ${localStorage.getItem("dungeonRPG")?`<button class="action" style="width:100%;margin-top:12px" onclick="continueGame()">저장된 게임 계속하기</button>`:""}`)
}
function chooseJob(k){G=fresh(k);save();renderTown()}
function continueGame(){load();renderTown()}

function safeGold(){
 let g=Number(G.gold);
 if(!Number.isFinite(g)||g<0)g=0;
 G.gold=Math.floor(g);
 return G.gold;
}
function goldText(){return safeGold().toLocaleString("ko-KR")+"G"}
function addGold(amount){
 const a=Number(amount);
 G.gold=safeGold()+(Number.isFinite(a)?Math.floor(a):0);
 return G.gold;
}
function spendGold(amount){
 const a=Number(amount);
 if(!Number.isFinite(a)||a<0)return false;
 const cost=Math.floor(a);
 if(safeGold()<cost)return false;
 G.gold=safeGold()-cost;
 return true;
}

function status(){
 return `<div class="panel"><div class="row"><div><b>${JOBS[G.job].icon} ${JOBS[G.job].name} Lv.${G.level}</b><br><span class="sub">EXP ${G.xp}/${G.nextXp} · ${goldText()} · 문장 ${G.marks}/10</span></div>
 <div><b>HP ${Math.ceil(G.hp)}/${Math.ceil(G.maxHp)}</b><div class="bar"><div class="fill" style="width:${100*G.hp/G.maxHp}%"></div></div></div>
 <div><b>MP ${Math.ceil(G.mp)}/${Math.ceil(G.maxMp)}</b><div class="bar mp"><div class="fill" style="width:${100*G.mp/G.maxMp}%"></div></div></div></div></div>`
}
function renderTown(){
 screen(status()+`<div class="panel"><div class="title">🏘️ 마을</div><div class="sub">휴식하지 않는 한 던전 진행도와 현재 HP/MP는 유지됩니다.</div>
 <div class="grid" style="margin-top:12px"><button class="npc" onclick="shop()">👨‍💼 상점 아저씨<br><small>포션과 장비</small></button>
 <button class="npc" onclick="smith()">🔨 대장장이<br><small>장비 강화</small></button>
 <button class="npc" onclick="teacher()">🧙 스킬 선생님<br><small>스킬·특성 (준비중)</small></button>
 <button class="npc" onclick="rest()">🛏️ 여관에서 휴식<br><small>완전 회복 · 진행도 2 감소</small></button></div></div>
 <div class="panel"><div class="row"><button class="action" onclick="renderCharacterMenu('town')">🎒 캐릭터 메뉴</button><button class="action" onclick="renderDungeon()">🌿 고블린 초원으로 이동</button></div></div>
 <button class="action" onclick="reset()">새 게임</button>`)
}
function rest(){G.hp=G.maxHp;G.mp=G.maxMp;G.stage=Math.max(1,G.stage-2);save();toast("완전 회복! 진행도가 2 감소했습니다.");renderTown()}
function renderDungeon(){
 screen(status()+`<div class="panel"><div class="title">🌿 1층 · 고블린 초원</div><div class="sub">현재 Stage ${G.stage}/10 · 보스 입장 문장 ${G.marks}/10</div>
 <div class="row" style="margin-top:12px"><button class="action" onclick="startStage()">⚔️ Stage ${G.stage} 전투</button>
 ${G.stage>=10&&G.marks>=10?`<button class="action" onclick="startBoss()">👑 보스 도전</button>`:""}
 <button class="action" onclick="returnAttempt()">🏠 마을 귀환 시도</button><button class="action" onclick="renderCharacterMenu('dungeon')">🎒 캐릭터 메뉴</button></div></div>
 <div class="panel"><div class="title">탐험 기록</div><div class="sub">Stage 10 클리어 + 고블린의 문장 10개를 모으면 보스에 도전할 수 있습니다.</div></div>`)
}

function equipName(slot){
 let x=G.equipment[slot];
 return x?`[${x.grade}] ${x.name} +${x.plus} · ${x.stat.toUpperCase()} +${x.value}`:"비어 있음";
}
function renderCharacterMenu(back="town",tab="info"){
 G.menuBack=back;
 const tabs=`<div class="nav">
 <button class="action" onclick="renderCharacterMenu('${back}','info')">👤 내 정보</button>
 <button class="action" onclick="renderCharacterMenu('${back}','equip')">⚔️ 장비</button>
 <button class="action" onclick="renderCharacterMenu('${back}','inventory')">🎒 아이템</button>
 <button class="action" onclick="renderCharacterMenu('${back}','skills')">✨ 스킬</button></div>`;
 let body="";
 if(tab==="info"){
  body=`<div class="panel"><div class="title">${JOBS[G.job].icon} ${JOBS[G.job].name} Lv.${G.level}</div>
  <div class="stats">
   <span class="stat">❤️ HP ${Math.ceil(G.hp)}/${Math.ceil(G.maxHp)}</span><span class="stat">🔷 MP ${Math.ceil(G.mp)}/${Math.ceil(G.maxMp)}</span>
   <span class="stat">⚔️ ATK ${Math.round(G.atk)}</span><span class="stat">🔮 MAG ${Math.round(G.mag)}</span>
   <span class="stat">🛡️ DEF ${Math.round(G.def)}</span><span class="stat">✨ MDEF ${Math.round(G.mdef)}</span>
   <span class="stat">💨 SPD ${G.spd}</span><span class="stat">💥 CRIT ${Math.round(G.crit*100)}%</span>
  </div><p class="sub">EXP ${G.xp}/${G.nextXp} · Gold ${goldText()} · 고블린의 문장 ${G.marks}/10</p></div>`;
 } else if(tab==="equip"){
  body=`<div class="panel"><div class="title">⚔️ 현재 장비</div>${bossSetPanel()}
  ${G.equipment.weapon?`<div class="itemVisual"><img class="weaponIcon" src="${itemImage(G.equipment.weapon)}"><div><b>현재 무기</b><br>${equipName("weapon")}</div></div>`:""}
  <div class="equip">${["weapon","head","armor","gloves","boots","necklace","ring"].map(slot=>G.equipment[slot]?`<div class="itemVisual"><img class="weaponIcon" src="${itemImage(G.equipment[slot])}"><div>${equipName(slot)}<br><button class="stageBtn" onclick="unequipSlot('${slot}','${back}')">장착 해제</button></div></div>`:`<div class="itemVisual"><div class="weaponIcon"></div><div>${slot}: 비어 있음</div></div>`).join("")}</div></div>`;
 } else if(tab==="inventory"){
  let items=inventoryRows().map(({it,index:i})=>`<div class="panel equip"><div class="itemVisual">${itemImage(it)?`<img class="weaponIcon" src="${itemImage(it)}">`:""}<div><b>[${it.grade}] ${it.name} +${it.plus}</b><br>${it.stat.toUpperCase()} +${it.value} · 품질 ${it.quality}%</div></div> 
  <button class="stageBtn" onclick="equipFromMenu(${i},'${back}')">장착</button></div>`).join("")||`<div class="panel sub">보유 장비가 없습니다.</div>`;
  body=`<div class="panel"><div class="title">🎒 아이템 창</div>
  <div class="row"><div class="itemVisual"><img class="weaponIcon" src="${consumableImage("hp")}"><div>HP 포션 × ${G.potions}</div></div>
  <div class="itemVisual"><img class="weaponIcon" src="${consumableImage("mp")}"><div>MP 포션 × ${G.ethers||0}</div></div></div></div>${items}`;
 } else {
  let skills=STARTER_SKILLS[G.job].map(sk=>`<div class="panel"><b>✨ ${sk.name}</b><br>${sk.desc}<br><span class="sub">MP ${sk.cost}</span></div>`).join("");
  body=`<div class="panel"><div class="title">✨ 스킬 창</div><p class="sub">현재 습득한 스킬입니다.</p></div>${skills}
  <div class="panel"><b>🌟 궁극기</b><br><span class="sub">${G.level>=30?"궁극기 슬롯 해금됨 (콘텐츠 추가 예정)":"Lv.30에 첫 궁극기 해금"}</span></div>`;
 }
 screen(tabs+body+`<button class="action" style="width:100%" onclick="${back==="dungeon"?"renderDungeon()":"renderTown()"}">← 돌아가기</button>`);
}
function unequipSlot(slot,back){
 let it=G.equipment[slot];if(!it)return;
 G[it.stat]-=it.value;G.equipment[slot]=null;save();toast(`${it.name} 장착 해제`);renderCharacterMenu(back,"equip");
}

function equipFromMenu(i,back){
 let it=G.inventory[i],old=G.equipment[it.slot];
 if(old===it)return toast("이미 장착 중입니다.");
 if(old)G[old.stat]-=old.value;
 G.equipment[it.slot]=it;G[it.stat]+=it.value;save();toast(`${it.name} 장착`);renderCharacterMenu(back,"inventory");
}

function returnAttempt(){if(Math.random()<.8){toast("귀환 성공!");setTimeout(renderTown,300)}else{toast("귀환 실패! 습격당했습니다.");setTimeout(()=>startStage(true),500)}}
function clone(m,scale=1){let x={...m};x.maxHp=Math.round(x.hp*scale);x.hp=x.maxHp;x.atk=Math.round(x.atk*scale);x.def=Math.round(x.def*(.9+.1*scale));return x}
function startStage(ambush=false){
 let count=r(1,3), enemies=[], eliteChance=G.stage>=3?.14:.05;
 if(Math.random()<eliteChance){enemies.push(clone(ELITE,1+(G.stage-1)*.025));count--; if(Math.random()<.45) count=Math.min(count,1)}
 while(count-->0) enemies.push(clone(MONSTERS[r(0,MONSTERS.length-1)],1+(G.stage-1)*.025));
 beginBattle(enemies,false,ambush);
}
function startBoss(){beginBattle([clone(BOSS)],true,false)}
function beginBattle(enemies,isBoss,ambush){
 battle={enemies,isBoss,defending:false,log:[ambush?"귀환 중 몬스터에게 습격당했다!":"적이 나타났다!"],bossSummoned:false};
 renderBattle();
}
function dmg(power,def,mult=1){let reduction=100/(100+def*5);return Math.max(1,Math.round(power*mult*reduction*(.95+Math.random()*.1)))}
function alive(){return battle.enemies.filter(e=>e.hp>0)}
function battleBackground(){
 return "assets/battle/goblin_meadow_clean.jpg";
}
function playerBattleImage(){
 return `assets/battle/player_${G.job}.jpg`;
}
function enemyBattleImage(e){
 if(e.name.includes("고블린 우두머리")){
   const eliteImg=["assets/battle/goblin_elite.jpg","assets/battle/goblin_guard.jpg"].find(x=>true);
   return "assets/battle/goblin_leader_v2.jpg";
 }
 if(e.name.includes("족장")||e.name.includes("보스"))return "assets/battle/goblin_chief.jpg";
 if(e.healer)return "assets/battle/goblin_shaman.jpg";
 if(e.name.includes("궁수"))return "assets/battle/goblin_archer.jpg";
 return "assets/battle/goblin.jpg";
}

function skillIcon(i){return `assets/skills/${G.job}_${i}.jpg`}
function renderBattle(){
 clampResources();
 let enemies=battle.enemies.map((e,i)=>`<div id="enemy-${i}" class="battleEnemy ${e.hp<=0?"dead":""} ${battle.selectedTarget===i?"target":""} ${battle.pendingSkill!=null&&e.hp>0?"targetable":""} ${(e.name.includes("족장")||e.name.includes("보스"))?"bossEnemy":""}" onclick="${e.hp>0?`handleEnemyClick(${i})`:""}">
 <img src="${enemyBattleImage(e)}"><div class="enemyName">${e.name}</div>
 <div class="bar"><div class="fill" style="width:${Math.max(0,100*e.hp/e.maxHp)}%"></div></div><small>${Math.max(0,e.hp)}/${e.maxHp}</small></div>`).join("");
 let playerVisual=playerBattleImage()?`<img src="${playerBattleImage()}">`:`<div style="font-size:100px">${JOBS[G.job].icon}</div>`;
 screen(status()+`<div class="panel"><div class="title">${battle.isBoss?"👑 BOSS BATTLE":"🌿 고블린 초원 · Stage "+G.stage}</div>
 <div id="battleStage" class="battleStage" style="background-image:linear-gradient(rgba(8,12,18,.08),rgba(8,12,18,.28)),url('${battleBackground()}')"><div id="playerFighter" class="playerFighter">${playerVisual}
 ${G.equipment.weapon?`<div><img class="weaponIcon" style="width:80px;height:50px" src="${itemImage(G.equipment.weapon)}"></div>`:""}</div>
 <div class="enemyLine">${enemies}</div></div>
 ${battle.pendingSkill!=null?`<div class="panel targetPrompt">🎯 <b>${STARTER_SKILLS[G.job][battle.pendingSkill].name}</b>을 사용할 적을 직접 선택하세요. <button class="stageBtn" onclick="cancelTargeting()">취소</button></div>`:""}
 <div class="skillDock">
 <button class="skillBtn" onclick="autoAttack()"><img src="assets/skills/warrior_attack.jpg"><b>공격</b><small>기본 공격</small></button>
 ${STARTER_SKILLS[G.job].map((sk,i)=>`<button class="skillBtn ${G.mp<sk.cost?"disabled":""}" onclick="quickSkill(${i})"><img src="${skillIcon(i)}"><b>${sk.name}</b><small>MP ${sk.cost}</small></button>`).join("")}
 <button class="skillBtn" onclick="defend()"><img src="assets/skills/defend.jpg"><b>방어</b><small>피해 50% 감소</small></button>
 <button class="skillBtn" onclick="usePotion()"><img src="assets/skills/hp.jpg"><b>HP 포션</b><small>${G.potions}개</small></button>
 <button class="skillBtn" onclick="useEther()"><img src="assets/skills/mp.jpg"><b>MP 포션</b><small>${G.ethers||0}개</small></button>
 <button class="skillBtn" onclick="flee()"><img src="assets/skills/flee.jpg"><b>도망</b><small>전투 이탈</small></button>
 </div><div class="battleHud"><div class="panel"><b>전투 명령</b><p class="sub">스킬이 화면 아래에 항상 표시됩니다. 단일 대상 스킬은 선택한 적 또는 첫 번째 적에게 사용됩니다.</p></div>
 <div class="log combatLog">${battle.log.slice(-12).join("<br>")}</div></div></div>`)
}
function classAttackKind(){
 if(G.job==="archer")return "ranged";
 if(G.job==="mage")return "magic";
 if(G.job==="rogue")return "rogue";
 return "melee";
}

function playFireballAnimation(targetIndex){
 const enemies=[...document.querySelectorAll(".battleEnemy")];
 const target=enemies[targetIndex];
 if(!target)return;
 const tr=target.getBoundingClientRect();
 const hero=document.querySelector(".battlePlayer,.playerFighter,.playerCharacter,.heroSprite,.playerSprite,[class*='player']");
 let sx=Math.max(45,window.innerWidth*.18), sy=window.innerHeight*.52;
 if(hero){
   const hr=hero.getBoundingClientRect();
   if(hr.width>0&&hr.height>0){sx=hr.left+hr.width*.68;sy=hr.top+hr.height*.42}
 }
 const tx=tr.left+tr.width*.5,ty=tr.top+tr.height*.45;
 const fx=document.createElement("div");
 fx.className="fireballOverlay";
 fx.style.left=(sx-24)+"px";fx.style.top=(sy-24)+"px";
 fx.innerHTML='<div class="fireballCore"></div><div class="fireTail"></div>';
 document.body.appendChild(fx);
 const dx=tx-sx,dy=ty-sy;
 const anim=fx.animate([
  {transform:"translate3d(0,0,0) scale(.7)",opacity:1},
  {transform:`translate3d(${dx*.5}px,${dy*.5}px,0) scale(1)`,opacity:1},
  {transform:`translate3d(${dx}px,${dy}px,0) scale(1.15)`,opacity:1}
 ],{duration:520,easing:"cubic-bezier(.15,.7,.2,1)",fill:"forwards"});
 anim.onfinish=()=>{
   fx.classList.add("fireballHit");
   fx.innerHTML='<div class="fireExplosion">✹</div>';
   setTimeout(()=>fx.remove(),260);
 };
}

function playAttackAnimation(targetIndex,kind="melee",damage=null){
 const hero=document.getElementById("playerFighter");
 const target=document.getElementById(`enemy-${targetIndex}`);
 const stage=document.getElementById("battleStage");
 if(!hero||!target||!stage)return;
 const cls=kind==="magic"?"attackMagic":kind==="ranged"?"attackRanged":kind==="rogue"?"attackRogue":"attackMelee";
 hero.classList.remove("attackMelee","attackRanged","attackMagic","attackRogue");void hero.offsetWidth;hero.classList.add(cls);
 target.classList.add("hit");setTimeout(()=>target.classList.remove("hit"),330);
 const rect=target.getBoundingClientRect(),sr=stage.getBoundingClientRect();
 let fx=document.createElement("div");fx.className=kind==="melee"?"slashFx":"projectileFx";
 fx.textContent=kind==="magic"?"✦":kind==="ranged"?"➶":kind==="rogue"?"✕":"⚔";
 fx.style.left=(rect.left-sr.left+rect.width*.25)+"px";fx.style.top=(rect.top-sr.top+rect.height*.2)+"px";stage.appendChild(fx);
 setTimeout(()=>fx.remove(),600);
}
function showDamage(targetIndex,amount){
 const target=document.getElementById(`enemy-${targetIndex}`),stage=document.getElementById("battleStage");
 if(!target||!stage)return;
 const rect=target.getBoundingClientRect(),sr=stage.getBoundingClientRect();
 let d=document.createElement("div");d.className="damageFloat";d.textContent="-"+amount;
 d.style.left=(rect.left-sr.left+rect.width*.4)+"px";d.style.top=(rect.top-sr.top)+"px";stage.appendChild(d);
 setTimeout(()=>d.remove(),700);
}


const TURN={PLAYER:"PLAYER_TURN",RESOLVING:"RESOLVING",ENEMY:"ENEMY_TURN",OVER:"BATTLE_OVER"};
function battleState(){return battle?.state||TURN.PLAYER}
function canPlayerAct(){return battle && battleState()===TURN.PLAYER}
function setBattleState(x){if(battle)battle.state=x}

let battleInputBusy=false;
function setBattleBusy(ms=500){
 battleInputBusy=true;
 setTimeout(()=>{battleInputBusy=false},ms);
}

function selectedTargetIndex(){
 let idx=battle.selectedTarget;
 if(idx!=null&&battle.enemies[idx]&&battle.enemies[idx].hp>0)return idx;
 let es=alive();return es.length?battle.enemies.indexOf(es[0]):-1;
}
function selectEnemy(i){
 if(!battle.enemies[i]||battle.enemies[i].hp<=0)return;
 battle.selectedTarget=i;renderBattle();
}
function quickSkill(i){
 if(!canPlayerAct())return;
 const sk=STARTER_SKILLS[G.job][i];
 if(!sk)return;
 if(G.mp<sk.cost){toast("MP가 부족합니다.");return}
 // AOE skills fire immediately. No target selection.
 if(sk.type==="magicAoe"||sk.type==="aoePhysical"){
   battle.pendingSkill=null;
   castSkill(i,null);
   return;
 }
 // Single-target skills enter target-selection mode.
 battle.pendingSkill=i;
 battle.log.push(`🎯 ${sk.name}: 공격할 적을 선택하세요.`);
 renderBattle();
}
function cancelTargeting(){
 battle.pendingSkill=null;
 renderBattle();
}
function handleEnemyClick(i){
 if(!canPlayerAct())return;
 const e=battle.enemies[i];
 if(!e||e.hp<=0)return;
 battle.selectedTarget=i;
 if(battle.pendingSkill!==null && battle.pendingSkill!==undefined){
   const skillIndex=battle.pendingSkill;
   battle.pendingSkill=null;
   castSkill(skillIndex,i);
   return;
 }
 renderBattle();
}
function autoAttack(){
 if(!canPlayerAct())return;
 const target=selectedTargetIndex();
 if(target>=0)playerAttack(target);
}
function playerAttack(i){
 if(!canPlayerAct())return;
 const e=battle.enemies[i];
 if(!e||e.hp<=0)return;
 setBattleState(TURN.RESOLVING);
 playAttackAnimation(i,classAttackKind());
 const critical=Math.random()<G.crit;
 const amount=Math.round(dmg(effectiveCombatStat("atk"),e.def,critical?1.5:1)*setBonusDamageMult());
 e.hp-=amount;
 showDamage(i,amount);
 battle.log.push(`⚔️ ${e.name}에게 ${amount} 피해${critical?" (치명타!)":""}`);
 afterPlayer();
}
function skill(){
 let skills=STARTER_SKILLS[G.job];
 screen(status()+`<div class="panel"><div class="title">✨ 스킬 선택</div><div class="sub">현재 MP ${Math.ceil(G.mp)}/${Math.ceil(G.maxMp)}</div>
 <div class="grid" style="margin-top:12px">${skills.map((sk,i)=>`<button class="npc" onclick="chooseSkill(${i})"><b>${sk.name}</b><br><small>${sk.desc}<br>MP ${sk.cost}</small></button>`).join("")}</div>
 <button class="action" style="margin-top:12px" onclick="renderBattle()">← 전투로 돌아가기</button></div>`);
}
function chooseSkill(i){
 let sk=STARTER_SKILLS[G.job][i];
 if(G.mp<sk.cost){toast("MP가 부족합니다.");return}
 let es=alive(); if(!es.length)return;
 if(sk.type==="magicAoe"||sk.type==="aoePhysical"){castSkill(i,0);return}
 screen(status()+`<div class="panel"><div class="title">${sk.name} · 대상 선택</div>
 <div class="enemyGrid">${battle.enemies.map((e,idx)=>`<div class="enemy ${e.hp<=0?"dead":""}"><div class="sprite">${e.icon}</div><b>${e.name}</b><div>HP ${Math.max(0,e.hp)}/${e.maxHp}</div>${e.hp>0?`<button class="stageBtn" onclick="castSkill(${i},${idx})">선택</button>`:""}</div>`).join("")}</div>
 <button class="action" style="margin-top:12px" onclick="skill()">← 뒤로</button></div>`);
}
function castSkill(i,targetIndex){
 if(!canPlayerAct())return;
 const sk=STARTER_SKILLS[G.job][i];
 if(!sk)return;
 if(G.mp<sk.cost){toast("MP가 부족합니다.");return}
 const es=alive();
 if(!es.length)return;

 // Validate single target BEFORE spending MP.
 if(sk.type!=="magicAoe"&&sk.type!=="aoePhysical"){
   const e=battle.enemies[targetIndex];
   if(!e||e.hp<=0){battle.pendingSkill=i;renderBattle();return}
 }
 setBattleState(TURN.RESOLVING);
 G.mp-=sk.cost;

 if(sk.type==="magicAoe"||sk.type==="aoePhysical"){
   // Visual effect on every living enemy.
   es.forEach((e,n)=>{
     const idx=battle.enemies.indexOf(e);
     setTimeout(()=>{if(sk.type==="magicAoe")playFireballAnimation(idx);else playAttackAnimation(idx,"ranged")},n*90);
     let base=sk.type==="magicAoe"?effectiveCombatStat("mag"):effectiveCombatStat("atk");
     let defense=sk.type==="magicAoe"?e.mdef:e.def;
     let d=Math.round(dmg(base,defense,sk.power)*setBonusDamageMult());
     e.hp-=d;
     setTimeout(()=>showDamage(idx,d),n*70);
     battle.log.push(`${sk.type==="magicAoe"?"🔥":"🏹"} ${sk.name}! ${e.name}에게 ${d} 피해`);
   });
 }else{
   const e=battle.enemies[targetIndex];
   if(sk.type==="magicSingle")playFireballAnimation(targetIndex);
   else playAttackAnimation(targetIndex,classAttackKind());
   let power=sk.power,critical=false;
   if(G.job==="warrior"&&G.hp/effectiveMaxHp()<.4)power*=1.25;
   if(sk.type==="crit")critical=Math.random()<Math.min(.95,G.crit+.25);
   else critical=Math.random()<G.crit;
   const base=sk.type==="magicSingle"?effectiveCombatStat("mag"):effectiveCombatStat("atk");
   const defense=sk.type==="magicSingle"?e.mdef:e.def;
   const d=Math.round(dmg(base,defense,power*(critical?1.5:1))*setBonusDamageMult());
   e.hp-=d;
   showDamage(targetIndex,d);
   battle.log.push(`✨ ${sk.name}! ${e.name}에게 ${d} 피해${critical?" (치명타!)":""}`);
 }
 afterPlayer();
}
function usePotion(){if(!G.potions){battle.log.push("포션이 없다!");renderBattle();return}G.potions--;let heal=Math.round(effectiveMaxHp()*.35);healHp(heal);battle.log.push(`🧪 HP ${heal} 회복`);enemyTurn()}
function useEther(){
 if(!G.ethers){battle.log.push("MP 포션이 없다!");renderBattle();return}
 G.ethers--;let heal=Math.round(effectiveMaxMp()*.35);restoreMp(heal);
 battle.log.push(`🔷 MP ${heal} 회복`);enemyTurn()
}
function defend(){battle.defending=true;battle.log.push("🛡️ 방어 태세! 다음 적 공격 피해 50% 감소.");enemyTurn()}
function afterPlayer(){
 battle.pendingSkill=null;
 const aliveNow=alive().length;
 const prevAlive=battle.lastAliveCount==null?aliveNow:battle.lastAliveCount;
 if(aliveNow<prevAlive){
   for(let k=0;k<prevAlive-aliveNow;k++)applyBossSetKillRecovery();
 }
 battle.lastAliveCount=aliveNow;
 if(aliveNow<=0){
   setBattleState(TURN.OVER);
   winBattle();
   return;
 }
 setBattleState(TURN.ENEMY);
 renderBattle();
 // Enemy logic executes independently of animation completion.
 setTimeout(()=>{
   try{
     enemyTurn();
   }catch(err){
     console.error(err);
     battle.log.push("⚠️ 적 턴 오류를 복구했습니다.");
   }finally{
     if(battle && battleState()!==TURN.OVER){
       battle.turn=(battle.turn||1)+1;
       setBattleState(TURN.PLAYER);
       renderBattle();
     }
   }
 },260);
}
function enemyTurn(){
 // 고블린 족장 지원군.
 // 60%: 일반 고블린 / 30%: 중간 스페셜 몬스터 "고블린 우두머리".
 // 전투 최대 적 수는 3마리 유지.
 const chief=battle.enemies.find(e=>e.hp>0 && e.name.includes("족장"));
 if(chief){
   const ratio=chief.hp/chief.maxHp;
   const summonUnit=(flag,type)=>{
     if(battle[flag]||alive().length>=3)return;
     battle[flag]=true;
     let minion;
     if(type==="leader"){
       // 족장보다는 약하지만 일반 고블린보다 훨씬 강한 스페셜 부하.
       minion={
         name:"고블린 우두머리",
         hp:Math.round(125*(1+.10*(G.floor-1))),
         maxHp:Math.round(125*(1+.10*(G.floor-1))),
         atk:20+Math.max(0,G.floor-1)*2,
         def:9+Math.max(0,G.floor-1),
         mdef:6+Math.max(0,G.floor-1),
         spd:9,
         xp:38,
         gold:30,
         elite:true,
         specialLeader:true
       };
       battle.log.push("🔥 족장의 명령! 고블린 우두머리가 전장에 난입했다!");
     }else{
       const base=MONSTERS.find(m=>m.name.includes("고블린")&&!m.name.includes("족장")&&!m.name.includes("우두머리"));
       if(!base)return;
       minion={...base,hp:Math.max(1,Math.round(base.hp*(1+.08*(G.floor-1))))};
       minion.maxHp=minion.hp;
       battle.log.push("📯 고블린 족장이 부하 고블린을 불러냈다!");
     }
     battle.enemies.push(minion);
   };
   if(ratio<=.60)summonUnit("summon60","normal");
   if(ratio<=.30)summonUnit("summon30","leader");
 }

 let es=alive().sort((a,b)=>b.spd-a.spd);
 for(let e of es){
   if(e.healer&&Math.random()<.35){
     let t=alive().sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0],h=10;t.hp=Math.min(t.maxHp,t.hp+h);battle.log.push(`💚 ${e.name}이 ${t.name} HP ${h} 회복`);continue;
   }
   let d=dmg(e.atk,G.def,1)*(battle.defending?.5:1);G.hp-=d;battle.log.push(`<span class="danger">💥 ${e.name}의 공격! ${d} 피해</span>`);
   if(G.hp<=0){death();return}
 }
 battle.defending=false;save();renderBattle();
}
function flee(){
 let chance=Math.min(.85,.35+G.spd*.02);
 if(Math.random()<chance){toast("도망 성공!");setTimeout(renderDungeon,300)}
 else{battle.log.push("도망 실패!");enemyTurn()}
}
function winBattle(){
 let xp=0,gold=0,elite=false;
 battle.enemies.forEach(e=>{xp+=e.xp;gold+=r(e.gold[0],e.gold[1]);elite|=!!e.elite});
 G.xp+=xp;addGold(gold);

 let markDrop=!battle.isBoss&&Math.random()<.45;
 if(markDrop)G.marks=Math.min(10,G.marks+1);

 let item=null,bossExclusive=false;
 if(battle.isBoss){
   // 층 보스: 전용 장비 1개 확정.
   item=makeBossItem();
   bossExclusive=true;
   G.inventory.push(item);
 }else{
   // 필드 파밍: 일반 30%, 엘리트 65%.
   // 고블린 우두머리는 족장전의 소환 패턴이므로 별도 장비 드랍 없음.
   const foughtSpecialLeader=(battle.enemies||[]).some(e=>e.specialLeader);
   let dropChance=elite?.65:.30;
   if(!foughtSpecialLeader && Math.random()<dropChance){
     item=makeItem();
     G.inventory.push(item);
   }
 }

 levelCheck();
 if(!battle.isBoss)G.stage=Math.min(10,G.stage+1);
 save();
 renderRewardScreen(xp,gold,item,markDrop,battle.isBoss,bossExclusive);
}
function renderRewardScreen(xp,gold,item,markDrop,isBoss,bossExclusive=false){
 let itemHtml=item?`<div class="panel" style="text-align:center">
   <div class="sprite">🎁</div>
   ${itemImage(item)?`<img class="weaponIcon" style="width:150px;height:96px" src="${itemImage(item)}">`:""}
   <div class="title">${bossExclusive?"👑 보스 전용 장비 획득!":"장비를 획득했습니다!"}</div>
   <div class="${bossExclusive?"bossDrop":"rare"}" style="font-size:20px;font-weight:800">[${item.grade}] ${bossExclusive?"👑 ":""}${item.name}</div>
   <div style="margin-top:7px">${item.stat.toUpperCase()} +${item.stat==="crit"?Math.round(item.value*100)+"%":item.value}</div>
   <div class="sub">품질 ${item.quality}%</div>
   ${item.specialText?`<div class="rare">★ ${item.specialText}</div>`:""}
   ${item.bossSet?`<div class="bossSetText">고블린 족장 세트 장비</div>`:""}
 </div>`:`<div class="panel sub" style="text-align:center">이번 전투에서는 장비가 드랍되지 않았습니다.</div>`;
 let markHtml=markDrop?`<div class="good">🔑 고블린의 문장 +1 (${G.marks}/10)</div>`:"";
 screen(status()+`<div class="panel" style="text-align:center"><div class="title">⚔️ 전투 승리!</div>
 <div class="big reward">EXP +${xp}　💰 ${gold}G</div>${markHtml}</div>
 ${itemHtml}
 <button class="action" style="width:100%" onclick="finishReward(${isBoss})">${isBoss?"🏘️ 마을로 돌아가기":"➡️ 계속 진행"}</button>`);
}
function finishReward(isBoss){
 if(isBoss){
   alert("🎉 1층 고블린 족장을 쓰러뜨렸습니다! 프로토타입 1층 클리어!");
   renderTown();return;
 }
 if(Math.random()<.05)rareMerchant();else renderDungeon();
}
function levelCheck(){
 while(G.xp>=G.nextXp&&G.level<100){
   G.xp-=G.nextXp;G.level++;let j=JOBS[G.job],g=j.grow;
   G.maxHp+=g[0];G.maxMp+=g[1];G.atk+=g[2];G.mag+=g[3];G.def+=g[4];G.mdef+=g[5];
   healHp(G.maxHp*.2);restoreMp(G.maxMp*.2);
   G.nextXp=Math.round(G.nextXp*1.32+4);toast(`LEVEL UP! Lv.${G.level}`);
 }
}
function death(){G.gold=Math.floor(G.gold*.9);G.hp=Math.max(1,Math.round(G.maxHp*.3));G.mp=Math.round(G.maxMp*.2);save();alert("💀 쓰러졌습니다. 골드 10%를 잃고 마을로 돌아갑니다.");renderTown()}
const grades=["F","E","D","C"];
function makeItem(){
 let x=Math.random(),
     grade=x<.40?"F":x<.75?"E":x<.95?"D":"C",
     quality=r(90,110);
 let pool={warrior:["낡은 철검","검"],rogue:["낡은 단검","단검"],archer:["낡은 활","활"],mage:["낡은 지팡이","지팡이"]}[G.job];
 let base={F:3,E:6,D:12,C:22}[grade],stat=G.job==="mage"?"mag":"atk";
 return {grade,name:pool[0],slot:"weapon",stat,value:Math.round(base*quality/100),quality,plus:0};
}
function makeMerchantItem(forceRare=false){
 const slots=[
  {slot:"weapon",names:{warrior:["기사의 장검","용병대장의 검"],rogue:["그림자 단검","암살자의 단검"],archer:["장궁","매의 활"],mage:["마도사의 지팡이","수정 지팡이"]}},
  {slot:"head",names:{all:["미스릴 투구","마력 깃든 후드"]}},
  {slot:"armor",names:{all:["미스릴 갑옷","마력 직조 로브"]}},
  {slot:"gloves",names:{all:["정밀 장갑","전투 장갑"]}},
  {slot:"boots",names:{all:["바람 장화","강철 장화"]}},
  {slot:"necklace",names:{all:["별빛 목걸이","수호자의 목걸이"]}},
  {slot:"ring",names:{all:["행운의 반지","전투의 반지"]}}
 ];
 let x=slots[r(0,slots.length-1)], roll=Math.random();
 // 1층 떠돌이 상인: E/D 중심, C도 꽤 희귀하게 판매. 아주 낮은 확률로 B.
 let grade=roll<.18?"E":roll<.78?"D":roll<.985?"C":"B";
 let quality=r(95,112), base={E:6,D:12,C:22,B:38}[grade];
 let stat=x.slot==="weapon"?(G.job==="mage"?"mag":"atk"):
          x.slot==="armor"?"def":x.slot==="head"?"mdef":
          x.slot==="gloves"?"maxMp":x.slot==="boots"?"spd":
          x.slot==="necklace"?(G.job==="mage"?"mag":"mdef"):"crit";
 let value=stat==="spd"?({E:2,D:3,C:5,B:7}[grade]):
           stat==="crit"?({E:.02,D:.03,C:.05,B:.07}[grade]):
           stat==="maxMp"?Math.round(base*2.2*quality/100):
           Math.round(base*quality/100);
 let names=x.names[G.job]||x.names.all;
 let name=names[r(0,names.length-1)];
 let special=Math.random()<.18;
 let specialText=null;
 // Random-flavor rare effects are informational for now; combat wiring can be expanded later.
 if(special){
   const effects=["전투 시작 시 HP 5% 회복","치명타 발생 시 MP 2 회복","HP 30% 이하에서 주 능력치 +8%","엘리트 상대 피해 +7%"];
   specialText=effects[r(0,effects.length-1)];
   name="✨ "+name;
 }
 let price=Math.round(({E:210,D:430,C:850,B:1700}[grade])*(quality/100)*(special?1.35:1));
 return {grade,name,slot,stat,value,quality,plus:0,price,specialText};
}
function merchantStock(){
 if(!G.merchantStock)G.merchantStock=Array.from({length:r(3,5)},()=>makeMerchantItem());
 return G.merchantStock;
}
function rareMerchant(){
 let stock=merchantStock();
 let cards=stock.map((it,i)=>`<div class="panel equip">${itemImage(it)?`<img class="weaponIcon" src="${itemImage(it)}">`:""}<b>[${it.grade}] ${it.name}</b><br>
 ${itemStatText(it)} · 품질 ${it.quality}%<br>
 ${it.specialText?`<span class="rare">★ 특수 효과: ${it.specialText}</span><br>`:""}
 <span class="reward">${it.price}G</span> <button class="stageBtn" onclick="buyMerchantGear(${i})">구매</button></div>`).join("");
 screen(status()+`<div class="panel"><div class="title">🎒 떠돌이 상인</div>
 <p>"허허, 운이 좋군. 평범한 상점에서는 보기 힘든 물건들이라네."</p>
 <p class="sub">이번 만남에서만 살 수 있습니다. 상품은 3~5개가 무작위로 정해집니다.</p></div>
 ${cards||`<div class="panel sub">물건을 모두 구매했습니다.</div>`}
 <button class="action" style="width:100%" onclick="leaveMerchant()">➡️ 상인과 작별하고 진행</button>`);
}
function buyMerchantGear(i){
 let stock=merchantStock(),it=stock[i];if(!it)return;
 if(G.gold<it.price)return toast("골드가 부족합니다.");
 if(!spendGold(it.price)){toast("골드가 부족합니다.");return}
 let copy={...it};delete copy.price;G.inventory.push(copy);
 stock.splice(i,1);save();toast(`[${it.grade}] ${it.name} 구매!`);rareMerchant();
}
function leaveMerchant(){G.merchantStock=null;save();renderDungeon()}

function itemSellPrice(it){
 const base={F:90,E:180,D:380,C:850,B:1700,A:3200,S:6500,SS:13000,SSS:30000}[it.grade]||60;
 const quality=(it.quality||100)/100;
 const enhance=1+(it.plus||0)*.10;
 const special=it.specialText?1.25:1;
 return Math.max(1,Math.round(base*.45*quality*enhance*special));
}
function isEquippedItem(it){
 if(!it||!G.equipment)return false;
 return Object.values(G.equipment).some(eq=>eq===it);
}

function shopStock(){
 // 일반 상점은 층마다 고정된 상품을 부위별로 판매한다.
 // 1층: F/E/D/C. C는 최고 등급이라 매우 비싸지만 구매 가능.
 const slotDefs=[
  ["weapon",{warrior:"검",rogue:"단검",archer:"활",mage:"지팡이"}],
  ["head","투구"],["armor","갑옷"],["gloves","장갑"],["boots","신발"],
  ["necklace","목걸이"],["ring","반지"]
 ];
 const gradeData={
  F:{label:"낡은",mult:1,price:100},
  E:{label:"튼튼한",mult:2,price:300},
  D:{label:"정예",mult:4,price:900},
  C:{label:"희귀한",mult:7,price:4500}
 };
 let stock=[];
 for(const [slot,names] of slotDefs){
  for(const grade of ["F","E","D","C"]){
   const gd=gradeData[grade];
   let baseName=typeof names==="string"?names:names[G.job];
   let stat=slot==="weapon"?(G.job==="mage"?"mag":"atk"):
            slot==="armor"?"def":slot==="head"?"mdef":
            slot==="gloves"?"maxMp":slot==="boots"?"spd":
            slot==="necklace"?(G.job==="mage"?"mag":"mdef"):"crit";
   let value=stat==="spd"?gd.mult:
             stat==="crit"?(.01*gd.mult):
             stat==="maxMp"?5*gd.mult:
             (slot==="weapon"?3:2)*gd.mult;
   let price=Math.round(gd.price*(slot==="weapon"?1.15:slot==="armor"?1.1:1));
   stock.push({grade,name:`${gd.label} ${baseName}`,slot,stat,value,quality:100,plus:0,price});
  }
 }
 return stock;
}
function slotLabel(slot){
 return {weapon:"무기",head:"투구",armor:"갑옷",gloves:"장갑",boots:"신발",necklace:"목걸이",ring:"반지"}[slot]||slot;
}
function shop(mode="buy",filter="weapon"){
 if(mode==="sell"){sellShop();return}
 const stock=shopStock();
 const tabs=["weapon","head","armor","gloves","boots","necklace","ring"].map(slot=>
  `<button class="stageBtn" onclick="shop('buy','${slot}')">${slotLabel(slot)}</button>`).join("");
 const cards=stock.filter(it=>it.slot===filter).map((it,i)=>{
   const realIndex=stock.indexOf(it);
   return `<div class="panel equip">${itemImage(it)?`<img class="weaponIcon" src="${itemImage(it)}">`:""}
   <b>[${it.grade}] ${it.name}</b><br>
   ${itemStatText(it)} · 품질 100%<br>
   <span class="reward">${it.price}G</span> <button type="button" class="stageBtn" onclick="buyFixedGear('${filter}','${it.grade}')">구매</button></div>`;
 }).join("");
 screen(status()+`<div class="nav"><button type="button" class="action" onclick="shop('buy','${filter}')">🛒 구매</button><button type="button" class="action" onclick="shop('sell')">💰 판매</button></div>
 <div class="panel"><div class="title">👨‍💼 1층 장비 상점</div>
 <p class="sub">상품은 층마다 고정됩니다. 부위별로 F~C급 장비를 항상 판매합니다. C급은 1층 최고 등급이라 매우 비쌉니다.</p>
 <div class="nav">${tabs}</div></div>
 <div class="title">${slotLabel(filter)}</div>${cards}
 <div class="panel"><div class="grid">
 <button class="npc" onclick="buyPotion()"><img class="weaponIcon" src="${consumableImage("hp")}"><br>HP 포션 · 30G</button>
 <button class="npc" onclick="buyEther()"><img class="weaponIcon" src="${consumableImage("mp")}"><br>MP 포션 · 40G</button></div></div>
 <button class="action" onclick="renderTown()">← 마을</button>`);
}

function buyFixedGear(slot,grade){
 const stock=shopStock();
 const it=stock.find(x=>x.slot===slot && x.grade===grade);
 if(!it){toast("상품 정보를 찾을 수 없습니다.");return}
 if(G.gold<it.price){toast(`골드가 부족합니다. ${it.price}G 필요`);return}
 if(!spendGold(it.price)){toast("골드가 부족합니다.");return}
 const copy=JSON.parse(JSON.stringify(it));
 delete copy.price;
 G.inventory.push(copy);
 save();
 toast(`[${it.grade}] ${it.name} 구매 완료!`);
 shop("buy",slot);
}
function sellShop(){
 let list=inventoryRows().map(({it,index:i})=>{
   let equipped=isEquippedItem(it),price=itemSellPrice(it);
   return `<div class="panel equip"><div class="itemVisual">${itemImage(it)?`<img class="weaponIcon" src="${itemImage(it)}">`:""}<div>
   <b>[${it.grade}] ${it.name} +${it.plus||0}</b>${equipped?` <span class="badge">장착 중</span>`:""}<br>
   ${itemStatText(it)} · 품질 ${it.quality}%<br>
   ${it.bossSet?`<span class="bossTag">👑 고블린 족장 세트</span><br>${bossItemSetInfo(it)}`:""}${it.specialText?`<span class="rare">★ ${it.specialText}</span><br>`:""}
   <span class="reward">판매가 ${price}G</span></div></div>
   <button type="button" class="stageBtn" ${equipped?"disabled":""} onclick="sellItem(${i})">${equipped?"장착 해제 후 판매":"판매"}</button></div>`;
 }).join("")||`<div class="panel sub">판매할 장비가 없습니다.</div>`;
 screen(status()+`<div class="nav"><button class="action" onclick="shop('buy')">🛒 구매</button><button type="button" class="action" onclick="shop('sell')">💰 판매</button></div>
 <div class="panel"><div class="title">💰 장비 판매</div><p class="sub">주운 장비와 구매한 장비를 판매할 수 있습니다. 장착 중인 장비는 실수 방지를 위해 바로 판매할 수 없습니다.</p></div>
 ${list}<button class="action" onclick="renderTown()">← 마을</button>`)
}

function buyPotion(){if(G.gold<30)return toast("골드 부족");if(!spendGold(30)){toast("골드가 부족합니다.");return}G.potions++;save();shop()}
function buyEther(){if(G.gold<40)return toast("골드 부족");if(!spendGold(40)){toast("골드가 부족합니다.");return}G.ethers++;save();shop()}
function buyEquipment(i){
 let it=G.shopStock[i];if(!it)return;
 if(G.gold<it.price)return toast("골드가 부족합니다.");
 if(!spendGold(it.price)){toast("골드가 부족합니다.");return}
 let bought={...it};delete bought.price;
 G.inventory.push(bought);
 G.shopStock.splice(i,1);save();toast(`[${bought.grade}] ${bought.name} 구매!`);shop();
}

function sellItem(i){
 const it=G.inventory[i];
 if(!it){toast("아이템을 찾을 수 없습니다.");return}
 if(isEquippedItem(it)){toast("장착 중인 아이템입니다. 먼저 장착 해제하세요.");return}
 const price=itemSellPrice(it);
 addGold(price);
 G.inventory.splice(i,1);
 save();
 toast(`${it.name} 판매 완료! +${price}G`);
 sellShop();
}
function smith(){
 const equipped=Object.entries(G.equipment||{}).filter(([slot,it])=>it);
 const cards=equipped.map(([slot,it])=>{
   const cost=enhanceCost(it);
   const chance=enhanceChance(it.plus||0);
   return `<div class="panel equip"><div class="itemVisual">
    ${itemImage(it)?`<img class="weaponIcon" src="${itemImage(it)}">`:""}
    <div><b>${slotLabel(slot)} · [${it.grade}] ${it.name} +${it.plus||0}</b><br>
    ${itemStatText(it)}<br>
    <span class="sub">성공률 ${chance}% · 비용 ${cost}G</span></div></div>
    <button class="stageBtn" onclick="enhanceEquipped('${slot}')">🔨 강화</button></div>`;
 }).join("")||`<div class="panel sub">장착한 장비가 없습니다.</div>`;
 screen(status()+`<div class="panel"><div class="title">🔨 강화 대장장이</div>
 <p class="sub">무기뿐 아니라 투구·갑옷·장갑·신발·목걸이·반지도 모두 강화할 수 있습니다. 실패해도 장비는 파괴되지 않고 강화 수치도 내려가지 않습니다.</p></div>
 ${cards}<button class="action" onclick="renderTown()">← 마을</button>`);
}
function enhanceChance(plus){
 return Math.max(12,Math.round(100-Math.pow(plus,1.32)*7.5));
}
function enhanceCost(it){
 const gradeMul={F:1,E:1.4,D:2,C:3,B:4.5,A:7,S:11,SS:17,SSS:28}[it.grade]||1;
 return Math.round(60*gradeMul*Math.pow((it.plus||0)+1,1.45));
}
function enhanceEquipped(slot){
 const it=G.equipment[slot];if(!it)return;
 const cost=enhanceCost(it),chance=enhanceChance(it.plus||0);
 if(G.gold<cost)return toast(`골드가 부족합니다. (${cost}G 필요)`);
 if(!spendGold(cost)){toast("골드가 부족합니다.");return}
 if(Math.random()*100<chance){
   const old=it.value;
   let gain;
   if(it.stat==="crit") gain=.01;
   else if(it.stat==="spd") gain=1;
   else gain=Math.max(1,Math.round(Math.max(1,it.value)*.12));
   it.plus=(it.plus||0)+1;
   it.value+=gain;
   save();toast(`강화 성공! ${it.name} +${it.plus}`);
 }else{
   save();toast(`강화 실패! 장비는 안전합니다.`);
 }
 smith();
}
function equip(i){
 let it=G.inventory[i],old=G.equipment[it.slot];
 if(old){G[old.stat]-=old.value}
 G.equipment[it.slot]=it;G[it.stat]+=it.value;save();toast(`${it.name} 장착`);smith()
}
function enhance(i){
 let it=G.inventory[i];if(it.plus>=10)return toast("최대 강화입니다.");
 let rates=[1,.95,.9,.8,.7,.55,.4,.25,.15,.07],cost=40*(it.plus+1);
 if(G.gold<cost)return toast(`강화 비용 ${cost}G 필요`);
 if(!spendGold(cost)){toast("골드가 부족합니다.");return}
 if(Math.random()<rates[it.plus]){let equipped=G.equipment[it.slot]===it;if(equipped)G[it.stat]-=it.value;it.plus++;it.value=Math.round(it.value*1.08);if(equipped)G[it.stat]+=it.value;toast(`강화 성공! +${it.plus}`)}
 else toast("강화 실패!");
 save();smith()
}
function teacher(){
 let skills=STARTER_SKILLS[G.job];
 screen(status()+`<div class="panel"><div class="title">🧙 스킬 선생님</div><p class="sub">현재 배운 기본 스킬입니다. 상위 등급 스킬/특성은 다음 확장에서 추가됩니다.</p>
 ${skills.map(sk=>`<div class="panel"><b>✨ ${sk.name}</b><br>${sk.desc}<br><span class="sub">MP ${sk.cost}</span></div>`).join("")}</div>
 <button class="action" onclick="renderTown()">← 마을</button>`);
}
load(); if(G)renderTown();else renderStart();
