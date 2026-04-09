import { useState, useEffect, useRef } from "react";

var DAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var WEEK={
  1:{label:"Deep work",drop:"Sarah",bjj:"8\u20139am Gi Advanced",eveningBjj:null,maxFocus:7.5,callHrs:0,capMsg:"7.5 hours of deep focus today. Guard them fiercely."},
  2:{label:"Calls",drop:"Sarah",bjj:null,eveningBjj:null,maxFocus:3,callHrs:5,capMsg:"3 hours of focus between calls. Be deliberate about what fills them."},
  3:{label:"Deep work",drop:"Mo",bjj:null,eveningBjj:"5\u20136 S&C or 6\u20137 Gi Fund.",maxFocus:7.5,callHrs:0,capMsg:"7.5 hours of deep focus today. Your ONE THING gets the best hours."},
  4:{label:"Calls",drop:"Sarah",bjj:null,eveningBjj:"5\u20136 S&C or 6\u20137 NoGi Fund.",maxFocus:3,callHrs:5,capMsg:"3 hours of focus between calls. Primary tasks only."},
  5:{label:"Admin",drop:"Mo",bjj:null,eveningBjj:"6\u20137 Gi Fundamentals",maxFocus:3,callHrs:2,capMsg:"3 hours of focus today. Clear the Secondary list and review the week."},
  6:{label:"Content",drop:null,bjj:"11am Fundamentals",eveningBjj:null,maxFocus:2,callHrs:0,capMsg:"2 hours of content creation. Batch it, schedule it, done."},
  0:{label:"Rest",drop:null,bjj:null,eveningBjj:null,maxFocus:1,callHrs:0,capMsg:"Rest day. One hour to plan the week ahead, then be present."},
};
/* Per-day blocks matching Mo's Ideal Week PDF */
var BLOCKS={
  1:[{t:"9:00",l:"Daily setup",s:"Brief \u00b7 P/S/T \u00b7 ONE THING"},{t:"9:30",l:"Deep work block 1",s:"Phone away \u00b7 ONE THING",w:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:00",l:"Exec BJJ or deep work",s:"1:00\u20132:00 at gym",b:1},{t:"2:00",l:"Deep work block 2",w:1},{t:"4:00",l:"Asr \u00b7 Break",p:1},{t:"4:30",l:"Deep work block 3",s:"or Secondary tasks",w:1}],
  2:[{t:"9:00",l:"Daily setup",s:"Brief \u00b7 P/S/T \u00b7 ONE THING"},{t:"9:30",l:"Postcard outreach",s:"Cliff framework \u00b7 Target \u00b7 Research \u00b7 Send"},{t:"10:30",l:"Calls / meetings",w:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:00",l:"Exec BJJ or calls",s:"1:00\u20132:00 at gym",b:1},{t:"2:00",l:"Calls / Primary tasks",w:1},{t:"4:00",l:"Asr \u00b7 Break",p:1},{t:"4:30",l:"Primary tasks",w:1}],
  3:[{t:"9:00",l:"Daily setup",s:"Brief \u00b7 P/S/T \u00b7 ONE THING"},{t:"9:30",l:"Deep work block 1",s:"Phone away \u00b7 ONE THING",w:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:00",l:"Exec BJJ or deep work",s:"1:00\u20132:00 at gym",b:1},{t:"2:00",l:"Deep work block 2",w:1},{t:"4:00",l:"Asr \u00b7 Break",p:1},{t:"4:30",l:"Secondary",s:"Wrap for evening BJJ",w:1},{t:"5:00",l:"Evening BJJ / S&C",s:"Kids train too \u00b7 5\u20136 S&C or 6\u20137 Gi Fund.",b:1}],
  4:[{t:"9:00",l:"Daily setup",s:"Brief \u00b7 P/S/T \u00b7 ONE THING"},{t:"9:30",l:"Postcard outreach",s:"Cliff framework \u00b7 Target \u00b7 Research \u00b7 Send"},{t:"10:30",l:"Calls / meetings",w:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:00",l:"Exec BJJ or calls",s:"1:00\u20132:00 at gym",b:1},{t:"2:00",l:"Calls / Primary tasks",w:1},{t:"4:00",l:"Asr \u00b7 Break",p:1},{t:"4:30",l:"Primary tasks",s:"Wrap for evening BJJ",w:1},{t:"5:00",l:"Evening BJJ / S&C",s:"Kids train too \u00b7 5\u20136 S&C or 6\u20137 NoGi Fund.",b:1}],
  5:[{t:"9:00",l:"Daily setup",s:"Weekly review prep"},{t:"9:30",l:"Postcard outreach",s:"Lighter session"},{t:"10:30",l:"Admin + Secondary",s:"Delegation \u00b7 Systems",w:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:00",l:"Executive BJJ",s:"1:00\u20132:00",b:1},{t:"2:00",l:"Weekly review",s:"Laura debrief \u00b7 Linear \u00b7 Postcard count"},{t:"4:00",l:"Asr \u00b7 Break",p:1},{t:"4:30",l:"Tertiary / wrap",w:1},{t:"5:00",l:"Evening BJJ / S&C",s:"Kids train too \u00b7 6\u20137 Gi Fundamentals",b:1}],
  6:[{t:"9:00",l:"Content batch",s:"Write posts \u00b7 images \u00b7 schedule Mon\u2013Fri",w:1},{t:"10:00",l:"Love letter",s:"1x/month"},{t:"11:00",l:"BJJ Fundamentals",s:"Ilya trains 11\u201312 \u00b7 Sarah S&C same window",b:1},{t:"12:00",l:"Open mat or family",p:1},{t:"12:30",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:30",l:"Family time"}],
  0:[{t:"9:00",l:"Plan the week",s:"3 priorities \u00b7 Agenda \u00b7 BJJ sched \u00b7 Laura brief"},{t:"10:00",l:"Rest + family",s:"Unstructured \u00b7 Reading \u00b7 Play \u00b7 Quiet time"},{t:"1:00",l:"Dhuhr \u00b7 Lunch",p:1},{t:"1:30",l:"Rest + family"}],
};
var ACT1=[{t:"6:30",l:"Wake up",k:"wake"},{t:"6:35",l:"Fajr prayer",k:"fajr"},{t:"6:45",l:"3-min breathing exercise",k:"breath"},{t:"6:50",l:"Awrad (mantras)",k:"awrad"},{t:"7:05",l:"Visualization",k:"viz"},{t:"7:15",l:"Mobility + knee routine",k:"mobility"},{t:"7:30",l:"Get ready \u00b7 help kids",k:"ready"}];
var ACT3=[{t:"6:00",l:"Tools down",k:"toolsdown"},{t:"6:15",l:"Maghrib prayer",k:"maghrib"},{t:"6:30",l:"Focused kid time",k:"kidtime"},{t:"7:15",l:"Family dinner",k:"dinner"},{t:"8:00",l:"Isha prayer",k:"isha"},{t:"8:15",l:"Daily debrief note",k:"debrief_item"},{t:"8:30",l:"Reading / quiet time",k:"reading"},{t:"8:45",l:"Habit tracker check",k:"tracker"},{t:"9:00",l:"Screen curfew",k:"curfew"},{t:"10:30",l:"Lights out",k:"lights"}];
var HABITS=[{cat:"Spiritual",color:"#A89BD4",items:["Fajr","Dhuhr","Asr","Maghrib","Isha","Awrad"]},{cat:"Focus",color:"#7BAFD4",items:["3-min breathing","Visualization","Daily debrief","Reviewed brief"]},{cat:"Work",color:"#D4A0B0",items:["ONE THING done","Day block respected","Postcard outreach","Phone away"]},{cat:"Physical",color:"#D4948E",items:["BJJ / workout","Knee routine","2L water","Sugar tracked","Vitamin D"]},{cat:"Family",color:"#8DBFA0",items:["30 min kid time","Reading","Quiet time"]},{cat:"Sleep",color:"#95ABCF",items:["Bed by 10:15","Screens off 9pm","Wake ~6:30am"]}];
var GUARDS=["Doom scrolling","Social media at work","Phone at desk","Screen in bedroom"];
var MSGS=["The path is straight ahead. Stay on it.","You\u2019re building something real this year.","The house, the savings, the family \u2014 it starts with today.","Continue, don\u2019t restart. You\u2019re still moving.","Three minutes of breathing. That\u2019s the whole secret.","Your kids are watching you build discipline. That\u2019s legacy.","The sine wave is getting smaller. You can feel it.","One thing at a time. You already know which one.","Be the parent mind. Gently bring yourself back.","The enchanted mountain is closer than yesterday.","This year changes everything. You\u2019re making it happen.","Consistency isn\u2019t a miracle. It\u2019s a muscle you\u2019re training.","Good enough today beats perfect someday."];
var TMSG={1:"No screens, no work. Just you, your breath, and your practice.",2:"Game on. Your ONE THING is waiting. Phone away, path ahead.",3:"Tools down. You earned this. Be present with the people who matter most.",4:"What did you learn? Write it down before it fades."};

function dateKey(d){return d.toISOString().slice(0,10);}
function today(){return new Date();}
function getAct(){var h=today().getHours(),m=today().getMinutes(),t=h+m/60;if(t<9)return 1;if(t<18)return 2;return 3;}
function randomMsg(){return MSGS[Math.floor(Math.random()*MSGS.length)];}
var ONE_PROMPTS=["What would move the ball forward?","What deserves your best hours?","What raises the bar today?","What would make today feel complete?","What matters most right now?","What earns the most goodwill?","What would future you be glad you did?","What\u2019s the highest-trust move today?","What\u2019s the one thing that compounds?","What would make your client feel cared for?","If you could only finish one thing?","What would you be proud of by tonight?"];
function randomOnePrompt(){return ONE_PROMPTS[Math.floor(Math.random()*ONE_PROMPTS.length)];}
function loadVal(k){try{var r=localStorage.getItem(k);if(r)return JSON.parse(r);return null;}catch(e){return null;}}
function saveVal(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

/* Convert time string + act to 24h decimal */
function to24(t,act){var p=t.split(":"),h=+p[0],m=+p[1]||0;if(act===2&&h<9)h+=12;if(act===3&&h<12)h+=12;return h+m/60;}

/* Build a condensed timeline for the NowStrip */
function getTimeline(dayNum){
  var blocks=BLOCKS[dayNum]||[];
  var tl=[];
  tl.push({t24:6.5,label:"Foundation",sub:"Morning routine",timeStr:"6:30am",act:1});
  blocks.forEach(function(bl){
    var h=+bl.t.split(":")[0],suffix=(h>=12?"pm":(h<9?"pm":"am"));
    tl.push({t24:to24(bl.t,2),label:bl.l,sub:bl.s||"",timeStr:bl.t+suffix,act:2,prayer:bl.p,work:bl.w,bjj:bl.b});
  });
  tl.push({t24:18,label:"Wind-down",sub:"Family + evening",timeStr:"6:00pm",act:3});
  tl.push({t24:20.25,label:"Debrief",sub:"Reflect on the day",timeStr:"8:15pm",act:3});
  tl.push({t24:22.5,label:"Lights out",sub:"Rest well",timeStr:"10:30pm",act:3});
  return tl;
}

function getCurrentIdx(timeline,isSleep){
  if(isSleep)return 0;
  var now=new Date(),t=now.getHours()+now.getMinutes()/60,idx=0;
  for(var i=timeline.length-1;i>=0;i--){if(t>=timeline[i].t24){idx=i;break;}}
  return idx;
}

function isSleepTime(){
  var h=new Date().getHours();
  return h>=23||h<6;
}

function getSleepTimeline(dayTimeline){
  var sleep={t24:0,label:"Sleep",sub:"Rest and recover. Tomorrow is yours.",timeStr:"Now",act:4,sleep:true};
  return [sleep].concat(dayTimeline);
}

/* Migrate PST from old string format to new array format */
function migratePst(raw){
  if(!raw)return{p:[],s:[],t:[]};
  var result={};
  ["p","s","t"].forEach(function(k){
    if(Array.isArray(raw[k])){result[k]=raw[k];}
    else if(typeof raw[k]==="string"&&raw[k].trim()){
      result[k]=raw[k].split("\n").filter(Boolean).map(function(text){return{text:text,done:false};});
    }else{result[k]=[];}
  });
  return result;
}

/* Build a full-day calendar timeline for the Week expanded view */
var BC={foundation:"#E8E0CE",work:"#E4ECDF",prayer:"#EBE7DE",bjj:"#F5E6C8",family:"#F5DDD5",curfew:"#FDE8E8",muted:"#F0EDE6",end:"transparent"};
function getFullDay(dow){
  var info=WEEK[dow],blocks=BLOCKS[dow]||[],items=[];
  items.push({t24:6.5,time:"7:00am",label:"FOUNDATION",sub:"Fajr \u00b7 Breathing \u00b7 Awrad \u00b7 Viz\nMobility + knee routine",bg:BC.foundation});
  items.push({t24:7.5,time:"7:30am",label:"Get ready",sub:"Help kids prep",bg:BC.muted});
  if(dow===1){items.push({t24:8,time:"8:00am",label:"BJJ GI ADVANCED",sub:"8:00\u20139:00 at gym\nSarah drops off kids",bg:BC.bjj});}
  else if(info.drop==="Mo"){items.push({t24:8,time:"8:00am",label:"KIDS DROP-OFF",sub:"Mo drives\nShower \u00b7 Breakfast \u00b7 Supplements",bg:BC.muted});}
  else if(info.drop==="Sarah"){items.push({t24:8,time:"8:00am",label:"Shower \u00b7 Breakfast",sub:"Sarah drops off kids\nSupplements \u00b7 Start water",bg:BC.muted});}
  else{items.push({t24:8,time:"8:00am",label:"Family breakfast",bg:BC.family});}
  blocks.forEach(function(bl){
    var h=+bl.t.split(":")[0],suffix=(h>=12?"pm":(h<9?"pm":"am"));
    var bg=BC.work;if(bl.p)bg=BC.prayer;if(bl.b)bg=BC.bjj;
    items.push({t24:to24(bl.t,2),time:bl.t+suffix,label:bl.l.toUpperCase(),sub:bl.s||"",bg:bg});
  });
  items.push({t24:18,time:"6:00pm",label:"Maghrib",bg:BC.prayer});
  items.push({t24:18.5,time:"6:30pm",label:"Kids time \u00b7 Dinner",sub:"30 min focused \u00b7 No phone",bg:BC.family});
  items.push({t24:19.5,time:"7:30pm",label:"Isha",bg:BC.prayer});
  items.push({t24:20,time:"8:00pm",label:"Debrief \u00b7 Read",sub:"Learning note \u00b7 Tracker",bg:BC.family});
  items.push({t24:21,time:"9:00pm",label:"SCREEN CURFEW",sub:"Books \u00b7 Games \u00b7 Wind down",bg:BC.curfew});
  items.push({t24:22.5,time:"10:30pm",label:"10:30 LIGHTS OUT",bg:BC.end});
  return items;
}

var PX_PER_HOUR=56;

function DayTimeline({dow}){
  var info=WEEK[dow];
  var items=getFullDay(dow);
  return(
    <div style={{padding:G.md+"px 0 "+G.sm+"px"}}>
      <div style={{background:info.label==="Deep work"?"#5B7F5B":info.label==="Calls"?"#4A7F8F":info.label==="Admin"?"#7F5B8F":info.label==="Content"?"#5B7F5B":"#8F8F7F",color:"#fff",textAlign:"center",padding:G.md+"px "+G.base+"px",borderRadius:"10px 10px 0 0",fontSize:13,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>{DAYS[dow]} {"\u00b7"} {info.label}</div>
      <div style={{background:C.card,border:"1px solid "+C.border,borderTop:"none",borderRadius:"0 0 10px 10px",padding:G.xs+"px 0"}}>
        {items.map(function(item,i){
          var nextT=i<items.length-1?items[i+1].t24:item.t24+0.5;
          var dur=nextT-item.t24;
          var h=Math.max(dur*PX_PER_HOUR,36);
          var isEnd=item.bg===BC.end;
          return(
            <div key={i} style={{display:"flex",gap:G.md,padding:"0 "+G.md+"px",alignItems:"stretch"}}>
              <div style={{width:52,fontSize:11,color:C.muted,paddingTop:G.sm,textAlign:"right",flexShrink:0,fontFamily:"monospace"}}>{item.time}</div>
              {isEnd?(
                <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:G.sm+"px 0"}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.red,letterSpacing:1}}>{item.label}</span>
                </div>
              ):(
                <div style={{flex:1,background:item.bg,borderRadius:6,padding:G.sm+"px "+G.base+"px",marginBottom:2,minHeight:h-4,display:"flex",flexDirection:"column",justifyContent:"center"}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.ink,lineHeight:1.3}}>{item.label}</div>
                  {item.sub&&<div style={{fontSize:11,color:C.sub,marginTop:2,lineHeight:1.4,whiteSpace:"pre-line"}}>{item.sub}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

var F="'DM Sans',system-ui,sans-serif";
var S="'Libre Baskerville',Georgia,serif";
var C={
  cream:"#FAF8F3",bg:"#FDFCF8",card:"#FFFFFF",
  softY:"#FDF6E8",yellow:"#F5E6C8",
  ink:"#2C2A26",sub:"#635E58",muted:"#918A7E",light:"#C4BEB4",
  border:"#E8E4DA",divider:"#EFEBE4",
  accent:"#C8960E",accentDark:"#7D6012",
  green:"#3D6B4D",red:"#B85450",redBg:"#fdf0ef"
};
/* ââ Design grid: 4px base unit ââ */
/* Spacing: 4 8 12 16 20 24 32 40 48 */
/* Type ramp (px): 11 12 13 14 15 16 18 20 24 */
var G={xs:4,sm:8,md:12,base:16,lg:20,xl:24,xxl:32,xxxl:40,huge:48};
/* Unified row height for all collapsible list items */
var ROW_H=52;
var ROW=G.base+"px "+G.lg+"px";

/* ââ Icons ââ */
function IconHouse({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5L10 3l7 5.5"/><path d="M5 7.5V16h10V7.5"/><path d="M8 16v-5h4v5"/></svg>;}
function IconTarget({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5"/><circle cx="10" cy="10" r="4"/><circle cx="10" cy="10" r="1" fill={color||C.ink} stroke="none"/></svg>;}
function IconSunset({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h14"/><path d="M5 14a5 5 0 0 1 10 0"/><path d="M10 5v2"/><path d="M14.5 7.5l-1.2 1.2"/><path d="M5.5 7.5l1.2 1.2"/></svg>;}
function IconNote({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||C.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h10v14H5z"/><path d="M8 7h4M8 10h4M8 13h2"/></svg>;}
function IconCalendar({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14"/><path d="M7 2v4"/><path d="M13 2v4"/></svg>;}
function IconToday({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5"/><circle cx="10" cy="10" r="2.5" fill={color||"currentColor"} stroke="none"/></svg>;}
function IconCheck({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10.5l3.5 3.5L15 7"/></svg>;}

/* ââ Shared ââ */
function Pill({color,bg,children}){
  return <span style={{display:"inline-block",padding:"5px 14px",borderRadius:20,fontSize:13,fontWeight:600,fontFamily:F,color:color||C.accentDark,background:bg||C.softY,letterSpacing:0.2}}>{children}</span>;
}

function SectionLabel({children}){
  return <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:C.accent,textTransform:"uppercase",marginBottom:G.md,paddingLeft:G.xs}}>{children}</div>;
}

function CheckItem({label,time,checked,onChange,prayer,bjj,guard}){
  var chkC=guard?C.red:C.accent;
  var chkBg=guard?C.redBg:C.softY;
  return (
    <button onClick={onChange} style={{display:"flex",alignItems:"flex-start",gap:G.md,padding:G.md+"px 0",background:"none",border:"none",cursor:"pointer",width:"100%",fontFamily:F,textAlign:"left",borderBottom:"1px solid "+C.divider}}>
      <span style={{width:22,height:22,borderRadius:guard?11:6,marginTop:1,flexShrink:0,border:"1.5px solid "+(checked?chkC:C.light),background:checked?chkBg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:checked?chkC:"transparent"}}>{checked?(guard?"\u2717":"\u2713"):""}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:15,color:prayer?C.muted:guard&&checked?C.red:C.ink,fontWeight:prayer?400:500,fontStyle:prayer?"italic":"normal",textDecoration:checked&&!prayer&&!guard?"line-through":"none",opacity:checked&&!guard?0.45:1,lineHeight:1.45}}>{label}</div>
        {guard&&checked&&<div style={{fontSize:12,color:C.red,marginTop:G.xs,fontStyle:"italic"}}>Notice it. Reset tomorrow.</div>}
      </div>
      {time&&<span style={{fontSize:11,color:C.light,fontFamily:"monospace",marginTop:4,flexShrink:0}}>{time}</span>}
    </button>
  );
}

/* ââ Now Strip ââ horizontal carousel showing prev/current/next blocks */
function NowStrip({timeline,currentIdx,wide}){
  var scrollRef=useRef(null);
  useEffect(function(){
    if(scrollRef.current){
      var el=scrollRef.current.children[currentIdx];
      if(el){
        var cw=scrollRef.current.offsetWidth;
        scrollRef.current.scrollLeft=el.offsetLeft-cw/2+el.offsetWidth/2;
      }
    }
  },[currentIdx]);
  return(
    <div style={{position:"relative"}}>
    {wide&&<div style={{position:"absolute",top:0,left:0,bottom:4,width:28,background:"linear-gradient(to right,#FAF8F3,transparent)",zIndex:2,pointerEvents:"none"}}></div>}
    <div style={{position:"absolute",top:0,right:0,bottom:4,width:28,background:"linear-gradient(to left,#FAF8F3,transparent)",zIndex:2,pointerEvents:"none"}}></div>
    <div ref={scrollRef} className="now-strip" style={{display:"flex",gap:G.md,overflowX:"auto",padding:"0 "+G.lg+"px "+G.xs+"px",WebkitOverflowScrolling:"touch"}}>
      {timeline.map(function(item,i){
        var isCurrent=i===currentIdx;
        var isPast=i<currentIdx;
        var isNext=i===currentIdx+1;
        return(
          <div key={i} style={{
            minWidth:isCurrent?220:140,padding:isCurrent?(G.lg+"px "+G.lg+"px"):(G.base+"px "+G.base+"px"),
            borderRadius:G.base,flexShrink:0,
            background:isCurrent&&item.sleep?"#1B2438":isCurrent?C.ink:item.sleep?"#2A3550":C.card,
            border:isCurrent?"none":isNext?("1.5px solid "+C.accent):item.sleep?"1px solid #3A4560":("1px solid "+C.border),
            opacity:isPast?0.4:1,
            transition:"all 0.2s"
          }}>
            <div style={{fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:G.xs,color:isCurrent&&item.sleep?"#7B9FD4":isCurrent?C.yellow:isNext?C.accent:item.sleep?"#6B8BBF":C.muted}}>
              {isCurrent?"Now":isNext?"Up next":item.timeStr}
            </div>
            <div style={{fontSize:isCurrent?18:14,fontWeight:isCurrent?600:500,fontFamily:isCurrent?S:F,lineHeight:1.35,color:isCurrent?"#fff":item.sleep?"#C8D8EF":isPast?C.light:C.ink}}>
              {item.label}
            </div>
            {isCurrent&&item.sub&&<div style={{fontSize:13,marginTop:G.sm,color:item.sleep?"rgba(200,216,239,0.6)":"rgba(255,255,255,0.6)",fontStyle:"italic"}}>{item.sub}</div>}
          </div>
        );
      })}
    </div>
    </div>
  );
}

/* ââ Card Stack ââ */
function CardStack({cards,active,setActive}){
  if(!active){
    return(
      <div style={{borderRadius:G.base,border:"1px solid "+C.border,overflow:"hidden"}}>
        {cards.map(function(card,i){
          return(
            <button key={card.id} onClick={function(){setActive(card.id);}} style={{
              display:"flex",alignItems:"center",gap:G.md,width:"100%",
              padding:ROW,background:card.isNow?C.softY:i%2===0?C.card:"#FDFCF9",
              border:"none",borderBottom:i<cards.length-1?"1px solid "+C.divider:"none",
              borderLeft:card.isNow?"3px solid "+C.accent:"3px solid transparent",
              cursor:"pointer",fontFamily:F,textAlign:"left"
            }}>
              <span style={{color:card.isNow?C.accent:C.muted,display:"flex"}}>{card.icon}</span>
              <span style={{fontSize:14,fontWeight:card.isNow?600:500,color:card.isNow?C.ink:C.muted}}>{card.title}</span>
              {card.isNow&&<Pill>Now</Pill>}
              <span style={{fontSize:11,color:C.light,marginLeft:"auto",flexShrink:0,whiteSpace:"nowrap"}}>{card.sub}</span>
              <span style={{color:C.light,fontSize:14}}>{"\u2192"}</span>
            </button>
          );
        })}
      </div>
    );
  }

  var order=[];
  order.push(active);
  cards.forEach(function(c){if(c.id!==active)order.push(c.id);});

  return(
    <div style={{position:"relative"}}>
      {order.map(function(id,i){
        var card=cards.find(function(c){return c.id===id;});
        var isActive=i===0;
        var tabsBelow=order.length-1-i;

        if(isActive){
          return(
            <div key={id} style={{
              background:C.card,
              borderRadius:tabsBelow>0?(G.base+"px "+G.base+"px 0 0"):G.base+"px",
              border:card.isNow?"2px solid "+C.accent:"1px solid "+C.border,
              borderBottom:tabsBelow>0?"1px solid "+C.divider:(card.isNow?"2px solid "+C.accent:"1px solid "+C.border),
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              position:"relative",zIndex:10
            }}>
              <button onClick={function(){setActive(null);}} style={{width:"100%",display:"flex",alignItems:"center",gap:G.md,padding:G.base+"px "+G.lg+"px "+G.md+"px",background:card.isNow?C.softY:"transparent",border:"none",borderBottom:"none",cursor:"pointer",fontFamily:F,textAlign:"left",borderRadius:G.base+"px "+G.base+"px 0 0"}}>
                <span style={{color:C.accent,display:"flex"}}>{card.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:600,color:C.ink,fontFamily:F}}>{card.title}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:1}}>{card.sub}</div>
                </div>
                {card.isNow&&<Pill>Now</Pill>}
                <span style={{color:C.light,fontSize:14,transform:"rotate(90deg)",transition:"transform 0.2s"}}>{"\u2192"}</span>
              </button>
              <div style={{padding:G.md+"px "+G.lg+"px "+G.lg+"px"}}>
                {card.msg&&<div style={{padding:G.md+"px "+G.base+"px",borderRadius:G.md,marginBottom:G.md,background:C.softY,fontFamily:S,fontSize:14,color:C.accentDark,fontStyle:"italic",lineHeight:1.6}}>{card.msg}</div>}
                {card.body}
              </div>
            </div>
          );
        }

        var isLast=i===order.length-1;
        return(
          <button key={id} onClick={function(){setActive(id);}} style={{
            display:"flex",alignItems:"center",gap:G.md,width:"100%",
            padding:ROW,
            background:i%2===1?"#FDFCF9":C.card,
            border:"1px solid "+C.border,borderTop:"none",
            borderRadius:isLast?"0 0 "+G.base+"px "+G.base+"px":"0",
            cursor:"pointer",fontFamily:F,textAlign:"left",
            position:"relative",zIndex:10-i,
            boxShadow:isLast?"0 2px 8px rgba(0,0,0,0.04)":"none",
            borderBottom:isLast?"1px solid "+C.border:"1px solid "+C.divider,
            transition:"background 0.15s ease"
          }}>
            <span style={{color:C.muted,display:"flex"}}>{card.icon}</span>
            <span style={{fontSize:14,fontWeight:500,color:C.muted}}>{card.title}</span>
            <span style={{fontSize:11,color:C.light,marginLeft:"auto",flexShrink:0,whiteSpace:"nowrap"}}>{card.sub}</span>
            <span style={{color:C.light,fontSize:14}}>{"\u2192"}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ââ PST Section ââ checklist with move between categories */
function PSTSection({pst,savePst,openKey,setOpenKey}){
  var[newItem,setNewItem]=useState({p:"",s:"",t:""});
  var cats=[
    {k:"p",l:"Primary",s:"Today or tomorrow",c:C.red,targets:["s","t"]},
    {k:"s",l:"Secondary",s:"This week",c:C.accent,targets:["p","t"]},
    {k:"t",l:"Tertiary",s:"Whenever",c:C.muted,targets:["p","s"]}
  ];
  var catLabels={p:"P",s:"S",t:"T"};

  function addItem(catKey){
    var text=newItem[catKey].trim();
    if(!text)return;
    var next=Object.assign({},pst);
    next[catKey]=(next[catKey]||[]).concat([{text:text,done:false}]);
    savePst(next);
    setNewItem(function(prev){var n=Object.assign({},prev);n[catKey]="";return n;});
  }
  function toggleItem(catKey,idx){
    var next=Object.assign({},pst);
    next[catKey]=next[catKey].map(function(item,i){
      if(i===idx)return{text:item.text,done:!item.done};return item;
    });
    savePst(next);
  }
  function removeItem(catKey,idx){
    var next=Object.assign({},pst);
    next[catKey]=next[catKey].filter(function(_,i){return i!==idx;});
    savePst(next);
  }
  function moveItem(fromKey,toKey,idx){
    var next=Object.assign({},pst);
    var fromItems=next[fromKey].slice();
    var item=fromItems.splice(idx,1)[0];
    next[fromKey]=fromItems;
    next[toKey]=(next[toKey]||[]).concat([item]);
    savePst(next);
  }

  return(
    <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,overflow:"hidden"}}>
      {cats.map(function(cat,ci){
        var items=pst[cat.k]||[];
        var doneCount=items.filter(function(i){return i.done;}).length;
        var isOpen=openKey===cat.k;
        return(
          <div key={cat.k}>
            <button onClick={function(){setOpenKey(isOpen?null:cat.k);}} style={{width:"100%",display:"flex",alignItems:"center",gap:G.md,padding:ROW,minHeight:ROW_H,boxSizing:"border-box",background:isOpen?C.softY:"none",border:"none",borderBottom:isOpen?"none":(ci<2?"1px solid "+C.divider:"none"),cursor:"pointer",fontFamily:F,textAlign:"left",borderLeft:isOpen?"3px solid "+C.accent:"3px solid transparent"}}>
              <div style={{width:G.sm,height:G.sm,borderRadius:G.xs,background:cat.c,flexShrink:0}}></div>
              <div style={{flex:1}}>
                <span style={{fontSize:14,fontWeight:600,color:C.ink}}>{cat.l}</span>
                <span style={{fontSize:12,color:C.muted,marginLeft:G.sm}}>{cat.s}</span>
              </div>
              {items.length>0&&<span style={{fontSize:12,color:doneCount===items.length&&items.length>0?C.green:C.muted,fontWeight:500}}>{doneCount}/{items.length}</span>}
              <span style={{color:C.light,fontSize:14,transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"\u2192"}</span>
            </button>
            {isOpen&&(
              <div style={{padding:G.xs+"px "+G.lg+"px "+G.base+"px",background:C.softY,borderLeft:"3px solid "+C.accent}}>
                {items.map(function(item,idx){
                  return(
                    <div key={idx} style={{display:"flex",alignItems:"center",gap:G.sm,padding:G.sm+"px 0",borderBottom:"1px solid "+C.divider}}>
                      <button onClick={function(){toggleItem(cat.k,idx);}} style={{
                        width:22,height:22,borderRadius:6,flexShrink:0,padding:0,
                        border:"1.5px solid "+(item.done?C.accent:C.light),
                        background:item.done?C.softY:"transparent",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:13,color:item.done?C.accent:"transparent",cursor:"pointer"
                      }}>{item.done?"\u2713":""}</button>
                      <span style={{flex:1,fontSize:14,color:C.ink,fontFamily:F,textDecoration:item.done?"line-through":"none",opacity:item.done?0.4:1}}>{item.text}</span>
                      {cat.targets.map(function(tk){
                        return(
                          <button key={tk} onClick={function(){moveItem(cat.k,tk,idx);}} style={{
                            padding:"3px "+G.sm+"px",borderRadius:G.xs,fontSize:11,fontWeight:700,
                            border:"1px solid "+C.divider,background:C.bg,color:C.muted,
                            cursor:"pointer",fontFamily:F
                          }}>{catLabels[tk]}</button>
                        );
                      })}
                      <button onClick={function(){removeItem(cat.k,idx);}} style={{padding:"3px 6px",fontSize:15,color:C.light,background:"none",border:"none",cursor:"pointer"}}>{"\u00d7"}</button>
                    </div>
                  );
                })}
                <div style={{display:"flex",gap:G.sm,marginTop:G.sm}}>
                  <input
                    value={newItem[cat.k]}
                    onChange={function(e){setNewItem(function(prev){var n=Object.assign({},prev);n[cat.k]=e.target.value;return n;});}}
                    onKeyDown={function(e){if(e.key==="Enter")addItem(cat.k);}}
                    placeholder={"Add "+cat.l.toLowerCase()+" task..."}
                    style={{flex:1,border:"1px solid "+C.divider,borderRadius:G.sm,padding:G.sm+"px "+G.md+"px",fontSize:14,fontFamily:F,color:C.ink,background:C.bg,outline:"none",boxSizing:"border-box"}}
                  />
                  <button onClick={function(){addItem(cat.k);}} style={{padding:G.sm+"px "+G.base+"px",borderRadius:G.sm,background:C.accent,color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F}}>+</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ââ Telegram ââ */
function sendTelegram(token,chatId,text){
  if(!token||!chatId)return Promise.resolve(false);
  return fetch("https://api.telegram.org/bot"+token+"/sendMessage",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:chatId,text:text,parse_mode:"Markdown"})
  }).then(function(r){return r.ok;}).catch(function(){return false;});
}

/* ââ Settings icon ââ */
function IconGear({color,size}){var s=size||18;return <svg width={s} height={s} viewBox="0 0 20 20" fill="none" stroke={color||"currentColor"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="3"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4"/></svg>;}

/* ââ Main App ââ */
export default function App(){
  var[view,setView]=useState("today");
  var[date,setDate]=useState(today());
  var[habits,setHabits]=useState({});
  var[guards,setGuards]=useState({});
  var[ac,setAc]=useState({});
  var[one,setOne]=useState("");
  var[locked,setLocked]=useState(false);
  var[pst,setPst]=useState({p:[],s:[],t:[]});
  var[pstOpen,setPstOpen]=useState(null);
  var[debrief,setDebrief]=useState("");
  var[focusHrs,setFocusHrs]=useState(0);
  var[activeCard,setActiveCard]=useState(null);
  var pendingCard=useRef(null);
  var[hOpen,setHOpen]=useState(null);
  var[msg]=useState(randomMsg);
  var[onePlaceholder]=useState(randomOnePrompt);
  var[weekFocus,setWeekFocus]=useState(0);
  var[weekExpanded,setWeekExpanded]=useState(null);
  var[tgToken,setTgToken]=useState(loadVal("tg-token")||"");
  var[tgChatId,setTgChatId]=useState(loadVal("tg-chatid")||"");
  var[tgNotify,setTgNotify]=useState(loadVal("tg-notify")!==false);
  var[tgStatus,setTgStatus]=useState(null);
  var lastNotifiedRef=useRef(null);
  var[wide,setWide]=useState(window.innerWidth>=768);
  // ── PST import from URL (?pst=BASE64) ──────────────────────────────────
  useEffect(function(){
    try {
      var raw = new URLSearchParams(window.location.search).get('pst');
      if (raw) {
        var decoded = JSON.parse(atob(raw));
        if (decoded && (decoded.p || decoded.s || decoded.t)) {
          var todayKey = 'pst-' + new Date().toISOString().slice(0,10);
          saveVal(todayKey, decoded);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }
    } catch(e) {}
  }, []);

  useEffect(function(){
    function onResize(){setWide(window.innerWidth>=768);}
    window.addEventListener("resize",onResize);
    return function(){window.removeEventListener("resize",onResize);};
  },[]);

  var key=dateKey(date);
  var dow=date.getDay();
  var info=WEEK[dow];
  var blocks=BLOCKS[dow]||[];
  var isToday=key===dateKey(today());
  var act=isToday?getAct():null;
  var sleepNow=isToday&&isSleepTime();
  var rawTimeline=getTimeline(dow);
  var timeline=sleepNow?getSleepTimeline(rawTimeline):rawTimeline;
  var currentIdx=isToday?getCurrentIdx(timeline,sleepNow):null;

  useEffect(function(){
    setHabits(loadVal("h-"+key)||{});
    setGuards(loadVal("g-"+key)||{});
    setAc(loadVal("ac-"+key)||{});
    setOne(loadVal("o-"+key)||"");
    setLocked(loadVal("ol-"+key)||false);
    setPst(migratePst(loadVal("pst-"+key)));
    setDebrief(loadVal("d-"+key)||"");
    setFocusHrs(loadVal("fh-"+key)||0);
    setPstOpen(null);
    if(pendingCard.current){setActiveCard(pendingCard.current);pendingCard.current=null;}
    else{setActiveCard(null);}
  },[key]);

  useEffect(function(){
    var total=0;var d=new Date(date);var wd=d.getDay();
    var mon=new Date(d);mon.setDate(d.getDate()-((wd+6)%7));
    for(var i=0;i<7;i++){var dd=new Date(mon);dd.setDate(mon.getDate()+i);var val=loadVal("fh-"+dateKey(dd));if(val)total+=val;}
    setWeekFocus(total);
  },[date,focusHrs]);

  function toggleIn(setter,pre,k){setter(function(prev){var next=Object.assign({},prev);next[k]=!prev[k];saveVal(pre+"-"+key,next);return next;});}
  function saveOne(v){setOne(v);saveVal("o-"+key,v);}
  function doLock(){setLocked(true);saveVal("ol-"+key,true);}
  function doUnlock(){setLocked(false);saveVal("ol-"+key,false);}
  function savePst(next){setPst(next);saveVal("pst-"+key,next);}
  function saveDebrief(v){setDebrief(v);saveVal("d-"+key,v);}
  function saveFocus(v){setFocusHrs(v);saveVal("fh-"+key,v);}
  function goDay(n){var d=new Date(date);d.setDate(d.getDate()+n);setDate(d);}
  function sendMsg(text){
    if(tgToken&&tgChatId){
      sendTelegram(tgToken,tgChatId,text).then(function(ok){
        setTgStatus(ok?"Sent!":"Failed");setTimeout(function(){setTgStatus(null);},2000);
      });
    }else{
      window.open("https://wa.me/?text="+encodeURIComponent(text),"_blank");
    }
  }
  function syncTgConfig(token,chatId,notify){
    fetch("/api/tg-config",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:token,chatId:chatId,notify:notify})}).catch(function(){});
  }
  function saveTgToken(v){setTgToken(v);saveVal("tg-token",v);syncTgConfig(v,tgChatId,tgNotify);}
  function saveTgChatId(v){setTgChatId(v);saveVal("tg-chatid",v);syncTgConfig(tgToken,v,tgNotify);}
  function saveTgNotify(v){setTgNotify(v);saveVal("tg-notify",v);syncTgConfig(tgToken,tgChatId,v);}

  /* Auto-notify on block transitions */
  useEffect(function(){
    if(!tgToken||!tgChatId||!tgNotify)return;
    var iv=setInterval(function(){
      var now=new Date(),h=now.getHours(),m=now.getMinutes();
      var timeKey=h+":"+m;
      if(timeKey===lastNotifiedRef.current)return;
      var d=now.getDay(),tl=getTimeline(d);
      for(var i=0;i<tl.length;i++){
        var bh=Math.floor(tl[i].t24),bm=Math.round((tl[i].t24-bh)*60);
        if(h===bh&&m===bm){
          lastNotifiedRef.current=timeKey;
          var next=i<tl.length-1?tl[i+1]:null;
          var msg="\ud83d\udfe2 *"+tl[i].label+"*"+(tl[i].sub?"\n"+tl[i].sub:"");
          if(next)msg+="\n\nUp next: "+next.label+" at "+next.timeStr;
          sendTelegram(tgToken,tgChatId,msg);
          break;
        }
      }
    },30000);
    return function(){clearInterval(iv);};
  },[tgToken,tgChatId,tgNotify]);

  var allH=HABITS.flatMap(function(c){return c.items;});
  var doneH=allH.filter(function(h){return habits[h];}).length;
  var pctVal=allH.length?Math.round((doneH/allH.length)*100):0;
  var gBroken=GUARDS.filter(function(g){return guards[g];}).length;

  /* Build the 4 card stack items */
  var stackCards=[
    {
      id:"a1",title:"Foundation",sub:"6:30 \u2013 8:00am",
      icon:<IconHouse color={activeCard==="a1"?C.accent:C.muted} size={18}/>,
      isNow:act===1,msg:TMSG[1],
      body:<div>
        {ACT1.map(function(item,i){return <CheckItem key={i} label={item.l} time={item.t} checked={!!ac[item.k]} onChange={function(){toggleIn(setAc,"ac",item.k);}} />;})}
        {info.drop&&<div style={{marginTop:G.md,padding:G.md+"px "+G.base+"px",borderRadius:G.md,background:C.softY,fontSize:14,color:C.accentDark,lineHeight:1.5}}>{"8:00 \u2013 8:30 \u00b7 "+(info.drop==="Mo"?"You drop off kids":"Sarah drops off \u2014 gym or prep")}</div>}
        {info.bjj&&<div style={{marginTop:G.sm,padding:G.md+"px "+G.base+"px",borderRadius:G.md,background:C.softY,fontSize:14,color:C.accentDark}}>{"BJJ: "+info.bjj}</div>}
        <button onClick={function(){sendMsg("Act 1 complete. Transitioning to work.");}} style={{marginTop:G.md,display:"flex",alignItems:"center",gap:G.sm,padding:G.md+"px "+G.base+"px",borderRadius:G.md,background:tgToken?"#0088cc":"#25D366",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F,width:"100%",justifyContent:"center"}}>{tgToken?"\u2708\ufe0f Send via Telegram":"WhatsApp reminder"}{tgStatus&&<span style={{marginLeft:G.sm,fontSize:11}}>({tgStatus})</span>}</button>
      </div>
    },
    {
      id:"a2",title:info.label,sub:"9:00am \u2013 6:00pm",
      icon:<IconTarget color={activeCard==="a2"?C.accent:C.muted} size={18}/>,
      isNow:act===2,msg:TMSG[2],
      body:<div>
        {blocks.map(function(bl,i){return <CheckItem key={i} label={bl.l} time={bl.t} checked={!!ac["b"+i]} onChange={function(){toggleIn(setAc,"ac","b"+i);}} prayer={bl.p} bjj={bl.b} />;})}
        <div style={{background:C.bg,borderRadius:G.md,padding:G.base+"px",marginTop:G.md,border:"1px solid "+C.divider}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:G.sm}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:1,color:C.accent,textTransform:"uppercase"}}>Focus logged</span>
            <span style={{fontSize:18,fontFamily:S,color:C.ink}}>{focusHrs}<span style={{fontSize:12,color:C.muted}}>/{info.maxFocus}h</span></span>
          </div>
          <div style={{height:5,borderRadius:3,background:C.divider,overflow:"hidden",marginBottom:G.sm}}>
            <div style={{height:"100%",borderRadius:3,background:focusHrs>=info.maxFocus*0.9?C.green:C.accent,width:(info.maxFocus>0?Math.min(100,Math.round(focusHrs/info.maxFocus*100)):0)+"%",transition:"width 0.3s"}}></div>
          </div>
          <input type="range" min="0" max={info.maxFocus} step="0.5" value={focusHrs} onChange={function(e){saveFocus(parseFloat(e.target.value));}} style={{width:"100%"}} />
          {focusHrs<info.maxFocus&&<div style={{fontSize:12,color:C.muted,marginTop:G.xs}}>{Math.max(0,info.maxFocus-focusHrs)}h remaining</div>}
          {focusHrs>=info.maxFocus&&focusHrs>0&&<div style={{fontSize:12,color:C.green,fontWeight:600,marginTop:G.xs}}>Full capacity. Well done.</div>}
        </div>
        <button onClick={function(){sendMsg(Math.max(0,info.maxFocus-focusHrs)+"h focus remaining. On your ONE THING?");}} style={{marginTop:G.md,display:"flex",alignItems:"center",gap:G.sm,padding:G.md+"px "+G.base+"px",borderRadius:G.md,background:tgToken?"#0088cc":"#25D366",color:"#fff",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:F,width:"100%",justifyContent:"center"}}>{tgToken?"\u2708\ufe0f Send via Telegram":"WhatsApp check-in"}{tgStatus&&<span style={{marginLeft:G.sm,fontSize:11}}>({tgStatus})</span>}</button>
      </div>
    },
    {
      id:"a3",title:"Wind-down",sub:"6:00 \u2013 10:30pm",
      icon:<IconSunset color={activeCard==="a3"?C.accent:C.muted} size={18}/>,
      isNow:act===3,msg:TMSG[3],
      body:<div>
        {ACT3.map(function(item,i){return <CheckItem key={i} label={item.l} time={item.t} checked={!!ac[item.k]} onChange={function(){toggleIn(setAc,"ac",item.k);}} />;})}
      </div>
    },
    {
      id:"a4",title:"Debrief",sub:"End of day",
      icon:<IconNote color={activeCard==="a4"?C.accent:C.muted} size={18}/>,
      isNow:false,msg:TMSG[4],
      body:<div>
        <textarea value={debrief} onChange={function(e){saveDebrief(e.target.value);}} rows={4} placeholder="What did I learn today?" style={{width:"100%",border:"none",outline:"none",fontFamily:S,fontSize:16,color:C.ink,background:"transparent",resize:"vertical",padding:0,lineHeight:1.7,boxSizing:"border-box"}} />
      </div>
    }
  ];

  return(
    <div style={{fontFamily:F,background:C.cream,minHeight:"100vh",maxWidth:wide?640:480,margin:"0 auto",paddingBottom:40,overflowX:"hidden"}}>

      {/* ââ Sticky Nav ââ */}
      <div style={{position:"sticky",top:0,zIndex:20,background:"rgba(250,248,243,0.95)",backdropFilter:"blur(10px)",WebkitBackdropFilter:"blur(10px)"}}>
        <div style={{padding:G.base+"px "+G.xl+"px "+G.sm+"px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:S,fontSize:22,color:C.ink,lineHeight:1.2}}>{DAYS[dow]}</div>
            <div style={{fontSize:13,color:C.muted,marginTop:G.xs}}>{date.toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})}</div>
          </div>
          <Pill>{info.label}</Pill>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:G.sm,padding:G.sm+"px "+G.base+"px "+G.md+"px",borderBottom:"1px solid "+C.divider}}>
          <button onClick={function(){goDay(-1);}} style={{background:C.card,border:"1px solid "+C.border,borderRadius:G.sm,padding:G.sm+"px "+G.md+"px",cursor:"pointer",fontSize:15,color:C.muted,flexShrink:0}}>{"\u2190"}</button>
          {!isToday&&<button onClick={function(){setDate(today());}} style={{background:C.softY,border:"1px solid "+C.yellow,borderRadius:G.sm,padding:G.sm+"px "+G.md+"px",cursor:"pointer",fontSize:12,color:C.accent,fontWeight:600,flexShrink:0}}>Today</button>}
          <button onClick={function(){goDay(1);}} style={{background:C.card,border:"1px solid "+C.border,borderRadius:G.sm,padding:G.sm+"px "+G.md+"px",cursor:"pointer",fontSize:15,color:C.muted,flexShrink:0}}>{"\u2192"}</button>
          <div style={{flex:1,minWidth:0}}/>
          <div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}>
          {[{v:"today",l:"Day",I:IconToday},{v:"week",l:"Week",I:IconCalendar},{v:"habits",l:"Habits",I:IconCheck},{v:"settings",l:"",I:IconGear}].map(function(t){
            var on=view===t.v;
            return <button key={t.v} onClick={function(){setView(t.v);}} style={{background:on?C.ink:"transparent",color:on?"#fff":C.muted,border:"none",borderRadius:G.sm,padding:G.sm+"px "+G.sm+"px",fontSize:11,fontWeight:on?600:400,cursor:"pointer",display:"flex",alignItems:"center",gap:2,flexShrink:0,whiteSpace:"nowrap"}}>
              <t.I color={on?"#fff":C.muted} size={12}/>{t.l}
            </button>;
          })}
          </div>
        </div>
      </div>

      {/* âââ TODAY âââ */}
      {view==="today"&&(
        <>
          {/* Now Strip - only on today's date */}
          {isToday&&currentIdx!==null&&(
            <div style={{paddingTop:G.lg,paddingBottom:G.sm}}>
              <NowStrip timeline={timeline} currentIdx={currentIdx} wide={wide}/>
              <div style={{padding:G.sm+"px "+G.xl+"px 0",fontFamily:S,fontSize:14,color:C.accentDark,fontStyle:"italic",lineHeight:1.6,opacity:0.7}}>{msg}</div>
            </div>
          )}

          {/* Non-today: show day info */}
          {!isToday&&(
            <div style={{padding:G.lg+"px "+G.xl+"px 0"}}>
              <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.lg+"px "+G.xl+"px",marginBottom:G.sm}}>
                <div style={{fontSize:15,color:C.sub,lineHeight:1.5}}>{info.capMsg}</div>
                {info.callHrs>0&&<div style={{fontSize:13,color:C.muted,marginTop:G.xs}}>{info.maxFocus}h focus + ~{info.callHrs}h calls</div>}
                {!info.callHrs&&<div style={{fontSize:13,color:C.muted,marginTop:G.xs}}>{info.maxFocus}h focus capacity</div>}
              </div>
            </div>
          )}

          <div style={{padding:G.xl+"px "+G.lg+"px 0"}}>
              {/* ONE THING */}
              <div style={{marginBottom:G.xxxl}}>
                <SectionLabel>Your one thing</SectionLabel>
                <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.base+"px "+G.lg+"px"}}>
                  {locked?(
                    <div>
                      <div style={{fontFamily:S,fontSize:17,color:C.ink,lineHeight:1.5}}>{one}</div>
                      <button onClick={doUnlock} style={{fontSize:12,color:C.muted,background:"none",border:"none",cursor:"pointer",marginTop:G.sm,textDecoration:"underline"}}>edit</button>
                    </div>
                  ):(
                    <div>
                      <input value={one} onChange={function(e){saveOne(e.target.value);}} placeholder={onePlaceholder} style={{width:"100%",border:"none",outline:"none",fontFamily:S,fontSize:17,color:C.ink,background:"transparent",padding:0,lineHeight:1.5,boxSizing:"border-box"}} />
                      {one.trim()&&<button onClick={doLock} style={{marginTop:G.md,padding:G.sm+"px "+G.xl+"px",borderRadius:G.md,background:C.accent,color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:F}}>Lock it in</button>}
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Sort */}
              <div style={{marginBottom:G.xxxl}}>
                <SectionLabel>Priority sort</SectionLabel>
                <PSTSection pst={pst} savePst={savePst} openKey={pstOpen} setOpenKey={setPstOpen} />
              </div>

            {/* Card Stack */}
            <div style={{marginBottom:G.xxxl}}>
              <SectionLabel>Your day</SectionLabel>
              <CardStack cards={stackCards} active={activeCard} setActive={setActiveCard} />
            </div>
          </div>
        </>
      )}

      {/* âââ WEEK âââ */}
      {view==="week"&&(
        <div style={{padding:G.xl+"px "+G.lg+"px 0"}}>
          <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.lg+"px "+G.xl+"px",marginBottom:G.xxxl}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:C.accent,textTransform:"uppercase"}}>Weekly focus</div>
                <div style={{fontSize:13,color:C.muted,marginTop:G.xs}}>Target: ~24h focus / ~16h calls</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:S,fontSize:28,color:C.ink,lineHeight:1}}>{weekFocus}h</div>
                <div style={{fontSize:12,color:weekFocus>=20?C.green:weekFocus>=12?C.accent:C.red,marginTop:G.xs,fontWeight:600}}>{weekFocus>=20?"On track":weekFocus>=12?"Building":"Keep going"}</div>
              </div>
            </div>
            <div style={{marginTop:G.md,height:6,borderRadius:3,background:C.divider,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:3,background:weekFocus>=20?C.green:weekFocus>=12?C.accent:C.red,width:Math.min(100,Math.round(weekFocus/24*100))+"%",transition:"width 0.3s"}}></div>
            </div>
          </div>

          <SectionLabel>Your ideal week</SectionLabel>
          {[1,2,3,4,5,6,0].map(function(d){
            var inf=WEEK[d];var dd=new Date(date);dd.setDate(dd.getDate()+(d-date.getDay()));
            var td=dateKey(dd)===dateKey(today());
            var isExpanded=weekExpanded===d;
            var bdr=td?"2px solid "+C.accent:isExpanded?"1.5px solid "+C.ink:"1px solid "+C.border;
            return(
              <div key={d} style={{marginBottom:G.sm,borderRadius:14,border:bdr,background:C.card,overflow:"hidden"}}>
                <button onClick={function(){setWeekExpanded(isExpanded?null:d);}} style={{display:"flex",alignItems:"center",gap:G.base,width:"100%",padding:G.base+"px "+G.lg+"px",background:C.card,border:"none",cursor:"pointer",textAlign:"left",fontFamily:F}}>
                  <div style={{width:44,height:44,borderRadius:G.md,background:C.softY,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.accentDark,letterSpacing:0.5}}>{DAYS[d].slice(0,3).toUpperCase()}</span>
                    <span style={{fontSize:11,color:C.muted}}>{inf.maxFocus}h</span>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:15,fontWeight:500,color:C.ink}}>{DAYS[d]}</div>
                    <div style={{fontSize:13,color:C.muted}}>{inf.label}{inf.drop?" \u00b7 "+inf.drop+" drops off":""}</div>
                  </div>
                  {td&&<Pill>Today</Pill>}
                  <span style={{color:C.light,fontSize:14,transform:isExpanded?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"\u2192"}</span>
                </button>
                {isExpanded&&(
                  <div style={{borderTop:"1px solid "+C.divider,padding:"0 "+G.md+"px "+G.md+"px"}}>
                    <DayTimeline dow={d}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* âââ HABITS âââ */}
      {view==="habits"&&(
        <div style={{padding:G.xl+"px "+G.lg+"px 0"}}>
          <div style={{textAlign:"center",marginBottom:G.xxxl,marginTop:G.sm}}>
            <div style={{position:"relative",width:100,height:100,margin:"0 auto "+G.base+"px"}}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.divider} strokeWidth="6"/>
                <circle cx="50" cy="50" r="42" fill="none" stroke={C.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={pctVal*2.64+" "+(264-pctVal*2.64)} transform="rotate(-90 50 50)"/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:28,fontWeight:400,color:C.ink,fontFamily:S}}>{pctVal}%</span>
                <span style={{fontSize:12,color:C.muted}}>{doneH}/{allH.length}</span>
              </div>
            </div>
            {gBroken>0&&<div style={{fontSize:14,color:C.red,fontWeight:600,marginBottom:G.xs}}>{gBroken} guardrail{gBroken>1?"s":""} broken today</div>}
            {gBroken===0&&<div style={{fontSize:14,color:C.green,fontWeight:600,marginBottom:G.xs}}>Clean slate today</div>}
            <div style={{fontFamily:S,fontSize:15,color:C.accentDark,fontStyle:"italic",padding:"0 "+G.lg+"px",lineHeight:1.6}}>{msg}</div>
          </div>

          <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:C.accent,textTransform:"uppercase",marginBottom:G.md,paddingLeft:G.xs,display:"flex",alignItems:"center",gap:G.sm}}>
            Habit tracking
            <span style={{fontWeight:400,color:C.muted,textTransform:"none",letterSpacing:0}}>{"\u00b7"} small wins compound into big changes</span>
          </div>
          <div>
            <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,overflow:"hidden",marginBottom:G.xxxl}}>
              {HABITS.map(function(cat,ci){
                var isOpen=hOpen===ci;
                var done=cat.items.filter(function(h){return habits[h];}).length;
                return(
                  <div key={ci}>
                    <button onClick={function(){setHOpen(isOpen?null:ci);}} style={{width:"100%",display:"flex",alignItems:"center",gap:G.md,padding:ROW,minHeight:ROW_H,boxSizing:"border-box",background:isOpen?cat.color+"0A":"none",border:"none",borderBottom:isOpen?"none":(ci<HABITS.length-1?"1px solid "+C.divider:"none"),cursor:"pointer",fontFamily:F,textAlign:"left",borderLeft:isOpen?"3px solid "+cat.color:"3px solid transparent"}}>
                      <span style={{width:G.md,height:G.md,borderRadius:G.sm,background:cat.color,display:"inline-block",flexShrink:0}}></span>
                      <span style={{flex:1,fontSize:15,fontWeight:500,color:C.ink}}>{cat.cat}</span>
                      <span style={{fontSize:12,color:done===cat.items.length?C.green:C.muted,fontWeight:done===cat.items.length?600:400}}>{done}/{cat.items.length}</span>
                      <span style={{color:C.light,fontSize:14,transform:isOpen?"rotate(90deg)":"none",transition:"transform 0.2s"}}>{"\u2192"}</span>
                    </button>
                    {isOpen&&(
                      <div style={{padding:"0 "+G.lg+"px "+G.md+"px",background:cat.color+"0A",borderLeft:"3px solid "+cat.color}}>
                        {cat.items.map(function(item,i){return <CheckItem key={i} label={item} checked={!!habits[item]} onChange={function(){toggleIn(setHabits,"h",item);}} />;})}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

            <div style={{marginBottom:G.xxxl}}>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:1.5,color:C.red,textTransform:"uppercase",marginBottom:G.md,paddingLeft:G.xs,display:"flex",alignItems:"center",gap:G.sm}}>
                Guardrails
                <span style={{fontWeight:400,color:C.muted,textTransform:"none",letterSpacing:0}}>{"\u00b7"} mark any you broke</span>
              </div>
              <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.xs+"px "+G.lg+"px "+G.sm+"px"}}>
                {GUARDS.map(function(g,i){return <CheckItem key={i} label={g} checked={!!guards[g]} onChange={function(){toggleIn(setGuards,"g",g);}} guard />;})}
              </div>
            </div>
        </div>
      )}

      {/* âââ SETTINGS âââ */}
      {view==="settings"&&(
        <div style={{padding:G.xl+"px "+G.lg+"px 0"}}>
          <SectionLabel>Telegram</SectionLabel>
          <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.lg+"px "+G.xl+"px",marginBottom:G.xxxl}}>
            <div style={{marginBottom:G.base}}>
              <label style={{fontSize:12,fontWeight:700,letterSpacing:1,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:G.sm}}>Bot Token</label>
              <input value={tgToken} onChange={function(e){saveTgToken(e.target.value);}} placeholder="Paste token from BotFather" style={{width:"100%",border:"1px solid "+C.divider,borderRadius:G.md,padding:G.md+"px "+G.base+"px",fontSize:14,fontFamily:F,color:C.ink,background:C.bg,outline:"none",boxSizing:"border-box"}} />
            </div>
            <div style={{marginBottom:G.base}}>
              <label style={{fontSize:12,fontWeight:700,letterSpacing:1,color:C.muted,textTransform:"uppercase",display:"block",marginBottom:G.sm}}>Chat ID</label>
              <input value={tgChatId} onChange={function(e){saveTgChatId(e.target.value);}} placeholder="Your numeric chat ID" style={{width:"100%",border:"1px solid "+C.divider,borderRadius:G.md,padding:G.md+"px "+G.base+"px",fontSize:14,fontFamily:F,color:C.ink,background:C.bg,outline:"none",boxSizing:"border-box"}} />
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:G.base}}>
              <div>
                <div style={{fontSize:15,fontWeight:500,color:C.ink}}>Auto-notifications</div>
                <div style={{fontSize:13,color:C.muted}}>Send block reminders while app is open</div>
              </div>
              <button onClick={function(){saveTgNotify(!tgNotify);}} style={{width:44,height:24,borderRadius:12,border:"none",cursor:"pointer",background:tgNotify&&tgToken?"#0088cc":C.divider,position:"relative",transition:"background 0.2s"}}>
                <span style={{position:"absolute",top:2,left:tgNotify&&tgToken?22:2,width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 1px 3px rgba(0,0,0,0.2)",transition:"left 0.2s"}}></span>
              </button>
            </div>
            <button onClick={function(){
              sendTelegram(tgToken,tgChatId,"\u2705 *Momo connected!*\nYou'll receive block transition reminders here.").then(function(ok){
                setTgStatus(ok?"Connected!":"Check token/chat ID");setTimeout(function(){setTgStatus(null);},3000);
              });
            }} style={{width:"100%",padding:G.md+"px "+G.base+"px",borderRadius:G.md,background:tgToken&&tgChatId?"#0088cc":C.divider,color:"#fff",border:"none",cursor:tgToken&&tgChatId?"pointer":"default",fontSize:14,fontWeight:600,fontFamily:F,opacity:tgToken&&tgChatId?1:0.5}}>
              Test connection
            </button>
            {tgStatus&&<div style={{textAlign:"center",marginTop:G.sm,fontSize:14,fontWeight:600,color:tgStatus==="Connected!"||tgStatus==="Sent!"?C.green:C.red}}>{tgStatus}</div>}
          </div>

          <SectionLabel>About</SectionLabel>
          <div style={{background:C.card,borderRadius:G.base,border:"1px solid "+C.border,padding:G.lg+"px "+G.xl+"px"}}>
            <div style={{fontFamily:S,fontSize:18,color:C.ink,marginBottom:G.xs}}>Momo</div>
            <div style={{fontSize:14,color:C.muted,lineHeight:1.6}}>Your daily operating system. Built for focus, discipline, and presence.</div>
            <div style={{fontSize:13,color:C.light,marginTop:G.md}}>Data stored locally in your browser.</div>
          </div>
        </div>
      )}

    </div>
  );
}
