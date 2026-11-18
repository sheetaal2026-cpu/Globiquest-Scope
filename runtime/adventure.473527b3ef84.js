/* Local-first progression shared by travel, vocabulary, recall and art. */
class GlobiquestAdventure{
 constructor(storage=localStorage){this.storage=storage;this.records={};this.onChange=()=>{};try{const v=JSON.parse(storage.getItem('globiquest-adventure-v1')||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))this.records=v}catch{}}
 record(region){if(!this.records[region]||typeof this.records[region]!=='object')this.records[region]={};const r=this.records[region];for(const key of ['visits','words','recalls'])if(!Array.isArray(r[key]))r[key]=[];r.art=!!r.art;r.stamped=!!r.stamped;return r}
 progress(region){const r=this.record(region);return {visit:r.visits.length>0,words:r.words.length>=2,recall:r.recalls.length>0,art:r.art}}
 award(region,type,value){const r=this.record(region);let changed=false;if(['visits','words','recalls'].includes(type)&&!r[type].includes(value)){r[type].push(value);changed=true}if(type==='art'&&!r.art){r.art=true;changed=true}const earned=!r.stamped&&Object.values(this.progress(region)).every(Boolean);if(earned){r.stamped=true;changed=true}if(changed){this.persist();this.onChange({region,earned})}return {changed,earned}}
 get stamps(){return Object.values(this.records).filter(r=>r&&r.stamped).length}
 get xp(){return Object.values(this.records).reduce((sum,r)=>sum+(Array.isArray(r.visits)?r.visits.length*15:0)+(Array.isArray(r.words)?r.words.length*10:0)+(Array.isArray(r.recalls)?r.recalls.length*20:0)+(r.art?25:0)+(r.stamped?50:0),0)}
 persist(){try{this.storage.setItem('globiquest-adventure-v1',JSON.stringify(this.records));this.lastSaveSucceeded=true}catch{this.lastSaveSucceeded=false}}
 saveArt(region,data,city,phrases=[],language=null){if(!/^data:image\/(webp|png);base64,/.test(data))throw new Error('Invalid artwork');try{this.storage.setItem('globiquest-art-'+region,JSON.stringify({data,city,language,phrases:Array.isArray(phrases)?phrases.filter(v=>typeof v==='string').slice(0,8):[],date:new Date().toISOString()}))}catch{throw new Error('Browser storage is full. Clear space before saving another postcard.')}return this.award(region,'art',true)}
 art(region){try{const v=JSON.parse(this.storage.getItem('globiquest-art-'+region)||'null');return v&&typeof v.data==='string'&&/^data:image\/(webp|png);base64,/.test(v.data)?v:null}catch{return null}}
}
window.GlobiquestAdventure=GlobiquestAdventure;
