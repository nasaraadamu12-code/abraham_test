import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Info,
  RotateCcw,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import classroomImage from "@/assets/classroom-master.jpg";
import amara from "@/assets/learners/amara-okafor.jpg";
import chinedu from "@/assets/learners/chinedu-okeke.jpg";
import aisha from "@/assets/learners/aisha-bello.jpg";
import tunde from "@/assets/learners/tunde-adeyemi.jpg";
import zainab from "@/assets/learners/zainab-musa.jpg";
import ifeanyi from "@/assets/learners/ifeanyi-okoro.jpg";
import adaeze from "@/assets/learners/adaeze-eze.jpg";
import emeka from "@/assets/learners/emeka-nwosu.jpg";
import kemi from "@/assets/learners/kemi-ogunleye.jpg";
import sade from "@/assets/learners/sade-balogun.jpg";
import halima from "@/assets/learners/halima-yusuf.jpg";
import femi from "@/assets/learners/femi-akinola.jpg";
import ngozi from "@/assets/learners/ngozi-obi.jpg";
import ebuka from "@/assets/learners/ebuka-umeh.jpg";
import mariam from "@/assets/learners/mariam-garba.jpg";
import david from "@/assets/learners/david-ekanem.jpg";
import chioma from "@/assets/learners/chioma-nwoke.jpg";
import segun from "@/assets/learners/segun-adebayo.jpg";
import folake from "@/assets/learners/folake-salami.jpg";
import ibrahim from "@/assets/learners/ibrahim-danjuma.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Class Sorting | Classroom Judgement Simulation" },
      { name: "description", content: "Organise 20 learners into four balanced working pods in an interactive classroom simulation." },
      { property: "og:title", content: "Class Sorting Simulation" },
      { property: "og:description", content: "Explore learner profiles, arrange four pods, and reflect on your classroom judgement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClassSorting,
});

type Step = "intro" | "explore" | "sorting" | "review" | "feedback";
type PodId = "pod-01" | "pod-02" | "pod-03" | "pod-04";
type Learner = {
  id: string; name: string; image: string; ability: "High" | "Developing" | "Emerging";
  learningStyle: "Visual" | "Auditory" | "Reading/Writing" | "Kinesthetic";
  personality: string; socialSkill: "High" | "Moderate" | "Low"; observation: string;
};

const learnerSeed: Array<[string, string, string, Learner["ability"], Learner["learningStyle"], string, Learner["socialSkill"], string]> = [
  ["amara-okafor", "Amara Okafor", amara, "High", "Visual", "Calm", "High", "Thoughtful and inclusive. Brings a calm influence to groups."],
  ["chinedu-okeke", "Chinedu Okeke", chinedu, "Developing", "Kinesthetic", "Energetic", "High", "Contributes readily and encourages others during practical work."],
  ["aisha-bello", "Aisha Bello", aisha, "High", "Reading/Writing", "Reflective", "Moderate", "Works carefully and shares considered ideas when invited."],
  ["tunde-adeyemi", "Tunde Adeyemi", tunde, "Emerging", "Auditory", "Outgoing", "High", "Responds well to discussion and helps groups sustain momentum."],
  ["zainab-musa", "Zainab Musa", zainab, "Developing", "Visual", "Confident", "High", "Explains visual patterns clearly and welcomes peer questions."],
  ["ifeanyi-okoro", "Ifeanyi Okoro", ifeanyi, "High", "Kinesthetic", "Independent", "Moderate", "Enjoys solving practical problems and can work at speed."],
  ["adaeze-eze", "Adaeze Eze", adaeze, "Emerging", "Auditory", "Sociable", "High", "Learns through conversation and makes quieter peers feel included."],
  ["emeka-nwosu", "Emeka Nwosu", emeka, "High", "Reading/Writing", "Measured", "Moderate", "Produces detailed work and values clear roles within a group."],
  ["kemi-ogunleye", "Kemi Ogunleye", kemi, "Developing", "Visual", "Warm", "High", "Notices when peers need help and explains ideas patiently."],
  ["sade-balogun", "Sade Balogun", sade, "High", "Auditory", "Assertive", "Moderate", "Offers strong ideas and benefits from sharing leadership."],
  ["halima-yusuf", "Halima Yusuf", halima, "Emerging", "Reading/Writing", "Quiet", "Low", "Needs time to formulate responses and thrives with gentle encouragement."],
  ["femi-akinola", "Femi Akinola", femi, "Developing", "Kinesthetic", "Lively", "High", "Brings positive energy and stays engaged through active tasks."],
  ["ngozi-obi", "Ngozi Obi", ngozi, "High", "Visual", "Attentive", "Moderate", "Reads situations well and helps a group return to the task."],
  ["ebuka-umeh", "Ebuka Umeh", ebuka, "Emerging", "Kinesthetic", "Energetic", "Moderate", "Engages deeply with practical tasks but may need clear boundaries."],
  ["mariam-garba", "Mariam Garba", mariam, "Developing", "Auditory", "Cooperative", "High", "Listens closely and is comfortable building on a peer’s idea."],
  ["david-ekanem", "David Ekanem", david, "High", "Reading/Writing", "Reserved", "Low", "Works independently with care and may need a direct invitation to contribute."],
  ["chioma-nwoke", "Chioma Nwoke", chioma, "Developing", "Visual", "Thoughtful", "Moderate", "Makes useful connections and responds well to shared planning."],
  ["segun-adebayo", "Segun Adebayo", segun, "Emerging", "Auditory", "Confident", "High", "Communicates readily and benefits from purposeful responsibility."],
  ["folake-salami", "Folake Salami", folake, "High", "Kinesthetic", "Expressive", "Moderate", "Generates creative approaches and enjoys testing ideas with others."],
  ["ibrahim-danjuma", "Ibrahim Danjuma", ibrahim, "Developing", "Reading/Writing", "Steady", "Low", "Prefers predictable routines and contributes reliably once settled."],
];
const learners: Learner[] = learnerSeed.map(([id,name,image,ability,learningStyle,personality,socialSkill,observation]) => ({ id,name,image,ability,learningStyle,personality,socialSkill,observation }));
const POD_IDS: PodId[] = ["pod-01", "pod-02", "pod-03", "pod-04"];
const emptyPods = (): Record<PodId,string[]> => ({ "pod-01": [], "pod-02": [], "pod-03": [], "pod-04": [] });
const reflections = [
  "Which learner characteristic influenced your grouping decisions most?",
  "Which characteristic did you find hardest to account for?",
  "Looking at the resulting groups, is there one learner you would reconsider placing differently?",
  "What does this activity suggest about the relationship between knowing your learners and organising your classroom?",
];

const Button = ({ children, onClick, disabled, kind="primary", className="" }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; kind?: "primary"|"secondary"|"icon"; className?: string }) => (
  <button type="button" onClick={onClick} disabled={disabled} className={`btn btn-${kind} ${className}`}>{children}</button>
);

function DraggableLearner({ learner, onInspect, compact=false }: { learner: Learner; onInspect: () => void; compact?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: learner.id });
  return <button ref={setNodeRef} {...listeners} {...attributes} type="button" onClick={onInspect} aria-label={`${learner.name}. Open learner profile.`} className={compact ? "member-chip" : "learner-card"} style={{ transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined, opacity: isDragging ? .25 : 1 }}>
    <img src={learner.image} alt={learner.name} width={400} height={384} loading="lazy" />
    <span>{learner.name.split(" ")[0]}</span>
  </button>;
}

function Pod({ id, members, onInspect, review=false }: { id: PodId; members: Learner[]; onInspect: (l:Learner)=>void; review?: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <section ref={setNodeRef} role="region" aria-label={`${id.replace("pod-","Pod ")}, ${members.length} of 5 learners assigned`} className={`pod-zone ${id} ${isOver ? "pod-over" : ""} ${review ? "pod-review" : ""}`}>
    <div className="pod-label"><strong>{id.replace("pod-","Pod ")}</strong><span>{members.length}/5</span></div>
    <div className="pod-members">{members.map(l => <DraggableLearner key={l.id} learner={l} compact onInspect={()=>onInspect(l)} />)}</div>
  </section>;
}

function ProfilePanel({ learner, pods, onClose, onAssign, canAssign }: { learner: Learner; pods: Record<PodId,string[]>; onClose:()=>void; onAssign:(id:PodId|"available")=>void; canAssign:boolean }) {
  return <motion.aside className="profile-panel" initial={{ opacity:0,x:80 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:80 }} transition={{ duration:.42,ease:[.22,1,.36,1] }}>
    <Button kind="icon" onClick={onClose} className="close-btn"><X size={18}/><span className="sr-only">Close profile</span></Button>
    <img className="profile-portrait" src={learner.image} alt={learner.name} width={400} height={384}/>
    <div><span className="eyebrow">Learner Profile · Year 9</span><h2>{learner.name}</h2></div>
    <dl className="profile-facts">
      <div><dt>Ability</dt><dd>{learner.ability}</dd></div><div><dt>Learning Style</dt><dd>{learner.learningStyle}</dd></div>
      <div><dt>Personality</dt><dd>{learner.personality}</dd></div><div><dt>Social Skill</dt><dd>{learner.socialSkill}</dd></div>
    </dl>
    <div className="observation"><span>Observation</span><p>{learner.observation}</p></div>
    {canAssign && <div className="assign-row" aria-label={`Assign ${learner.name} to a pod`}>
      <span>Assign to</span>{POD_IDS.map((id,i)=><button key={id} type="button" disabled={pods[id].length>=5} onClick={()=>onAssign(id)}>{i+1}<small>{pods[id].length}/5</small></button>)}
      <button type="button" onClick={()=>onAssign("available")}><RotateCcw size={14}/></button>
    </div>}
  </motion.aside>;
}

function evaluate(pods: Record<PodId,string[]>) {
  const podProfiles = POD_IDS.map(id => pods[id].map(x=>learners.find(l=>l.id===x)).filter((x):x is Learner=>Boolean(x)));
  const dimension = (key: keyof Pick<Learner,"ability"|"learningStyle"|"socialSkill">, max:number) => Math.round(podProfiles.reduce((sum,p)=>sum + new Set(p.map(l=>l[key])).size/max*100,0)/4);
  const ability = dimension("ability",3), styles=dimension("learningStyle",4), social=dimension("socialSkill",3);
  const stability = Math.round(podProfiles.reduce((s,p)=>s + (100-Math.max(0,p.filter(l=>["Energetic","Lively","Assertive"].includes(l.personality)).length-1)*18),0)/4);
  const composition = Math.round((ability+styles+social+stability)/4);
  const score=Math.round(stability*.30+social*.25+ability*.20+styles*.15+composition*.10);
  const band=score>=90?"Excellent":score>=80?"Strong":score>=70?"Satisfactory":score>=60?"Developing":"Needs Improvement";
  return { ability,styles,social,stability,composition,score,band };
}

function ClassSorting() {
  const [step,setStep]=useState<Step>("intro"); const [selected,setSelected]=useState<Learner|null>(null); const [reviewed,setReviewed]=useState<string[]>([]);
  const [pods,setPods]=useState<Record<PodId,string[]>>(emptyPods); const [activeId,setActiveId]=useState<string|null>(null); const [page,setPage]=useState(0);
  const [notice,setNotice]=useState(""); const [reflectionIndex,setReflectionIndex]=useState(0); const [responses,setResponses]=useState<Record<number,string>>({});
  const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:8}}),useSensor(KeyboardSensor));
  const unplaced=learners.filter(l=>!POD_IDS.some(id=>pods[id].includes(l.id))); const complete=unplaced.length===0&&POD_IDS.every(id=>pods[id].length===5);
  const result=useMemo(()=>evaluate(pods),[pods]);
  const move=(learnerId:string,target:PodId|"available")=>{ setNotice(""); setPods(prev=>{ const next=Object.fromEntries(POD_IDS.map(id=>[id,prev[id].filter(x=>x!==learnerId)])) as Record<PodId,string[]>; if(target!=="available"){if(next[target].length>=5){setNotice(`${target.replace("pod-","Pod ")} is full.`);return prev;}next[target]=[...next[target],learnerId];} return next;}); };
  const inspect=(l:Learner)=>{setSelected(l);setReviewed(r=>r.includes(l.id)?r:[...r,l.id]);};
  const onDragEnd=({active,over}:DragEndEvent)=>{setActiveId(null);if(!over)return;const target=String(over.id);if(POD_IDS.includes(target as PodId))move(String(active.id),target as PodId);else if(target==="available")move(String(active.id),"available");};
  const reset=()=>{setPods(emptyPods());setSelected(null);setPage(0);setNotice("");};
  const pageItems=unplaced.slice(page*10,page*10+10);
  const stepLabel=step==="intro"?0:step==="explore"?1:step==="sorting"?2:step==="review"?3:4;
  return <main className="simulation-shell">
    <img className="classroom-media" src={classroomImage} alt="Contemporary Nigerian classroom arranged with four collaborative tables" width={1920} height={1080}/><div className="cinematic-wash"/>
    <header className="top-bar"><div className="brand"><span className="brand-mark"><Users size={18}/></span><span>CLASS SORTING</span></div>{step!=="intro"&&<nav aria-label="Activity progress">{["Explore Learners","Arrange Pods","Review","Feedback"].map((x,i)=><span key={x} className={i<=stepLabel-1?"active":""}><b>{i<stepLabel-1?<Check size={12}/>:i+1}</b>{x}</span>)}</nav>}<div className="status"><Users size={15}/>20 learners <i/> 4 pods</div></header>
    <AnimatePresence mode="wait">
      {step==="intro"&&<motion.section key="intro" className="intro-card" initial={{opacity:0,scale:.96,y:22}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:1.02,y:-14}} transition={{duration:.65,ease:[.22,1,.36,1]}}>
        <motion.span className="eyebrow" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.18}}>CLASSROOM JUDGEMENT SIMULATION</motion.span><motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.25}}>Class Sorting</motion.h1>
        <motion.h2 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.34}}>Organise 20 learners into four working pods of five.</motion.h2>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.42}}>Every classroom is made up of different learners. Knowing those learners is one thing. Deciding how they should work together is another. In this activity, you will organise a class of 20 learners into four working groups. Before you decide where anyone belongs, take the time to understand who is in your classroom. There is no single perfect arrangement. Your decisions should reflect what you know about the learners.</motion.p>
        <motion.div className="intro-actions" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:.55}}><Button onClick={()=>setStep("explore")}>Start Activity <ArrowRight size={18}/></Button><button className="text-link" onClick={()=>setStep("explore")}>Preview Class</button></motion.div>
      </motion.section>}
      {step==="explore"&&<motion.section key="explore" className={`explore-panel ${selected?"profile-open":""}`} initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} exit={{opacity:0,y:30}} transition={{duration:.55,ease:[.22,1,.36,1]}}>
        <div className="panel-head"><div><span className="eyebrow">STEP 1 OF 4</span><h1>Explore Your Class</h1><p>Review the learners before arranging them into pods.</p></div><div className="hint"><Info size={16}/> Click any learner to view profile.</div></div>
        <div className="learner-grid">{learners.map((l,i)=><motion.div key={l.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*.018}}><button type="button" className="learner-card" data-reviewed={reviewed.includes(l.id)} onClick={()=>inspect(l)} aria-label={`${l.name}. Open learner profile.`}><img src={l.image} alt={l.name} width={400} height={384} loading="lazy"/><span>{l.name}</span>{reviewed.includes(l.id)&&<b><Check size={11}/></b>}</button></motion.div>)}</div>
        <div className="panel-foot"><Button kind="secondary" onClick={()=>setStep("intro")}><ArrowLeft size={16}/>Back</Button><span>{reviewed.length} of 20 explored</span><Button onClick={()=>{setSelected(null);setStep("sorting")}}>Continue to Sorting <ArrowRight size={17}/></Button></div>
      </motion.section>}
      {(step==="sorting"||step==="review")&&<motion.section key={step} className="workspace" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.48}}>
        <div className="workspace-title"><span className="eyebrow">{step==="sorting"?(complete?"CLASS ARRANGED":"STEP 2 OF 4"):"STEP 3 OF 4"}</span><h1>{step==="sorting"?(complete?"Review your groups":"Arrange Your Class"):"Review Your Groups"}</h1><p>{step==="sorting"?(complete?"Review your groups before making your final decision.":"Place each learner into one of four working pods."):"See what your arrangement created across the four pods."}</p></div>
        <DndContext sensors={sensors} onDragStart={(e:DragStartEvent)=>setActiveId(String(e.active.id))} onDragEnd={onDragEnd} onDragCancel={()=>setActiveId(null)}>
          <div className="pods-canvas">{POD_IDS.map(id=><Pod key={id} id={id} review={step==="review"} members={pods[id].map(x=>learners.find(l=>l.id===x)).filter((x):x is Learner=>Boolean(x))} onInspect={inspect}/>)}</div>
          {step==="sorting"&&<AvailableTray items={pageItems} total={unplaced.length} page={page} pages={Math.max(1,Math.ceil(unplaced.length/10))} onPage={setPage} onInspect={inspect} complete={complete} notice={notice} onReset={reset} onBack={()=>setStep("explore")} onConfirm={()=>{if(complete){setSelected(null);setStep("review");}else setNotice("Complete all four groups before confirming your arrangement.");}}/>}
          {step==="review"&&<ReviewOverlay pods={pods} result={result} onBack={()=>setStep("sorting")} onContinue={()=>{setSelected(null);setStep("feedback");}}/>} 
          <DragOverlay>{activeId?<div className="drag-portrait"><img src={learners.find(l=>l.id===activeId)?.image} alt=""/></div>:null}</DragOverlay>
        </DndContext>
      </motion.section>}
      {step==="feedback"&&<motion.section key="feedback" className="result-panel" initial={{opacity:0,scale:.94,y:25}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.6,ease:[.22,1,.36,1]}}>
        <div className="result-head"><div><span className="eyebrow">FINAL FEEDBACK</span><h1>Classroom Judgment Score</h1></div><div className="score-orbit"><strong>{result.score}</strong><span>{result.band}</span></div></div>
        <div className="score-grid">{[["Group Stability",result.stability],["Peer Support",result.social],["Ability Distribution",result.ability],["Learning Style Consideration",result.styles],["Overall Composition",result.composition]].map(([label,value])=><div key={String(label)}><span>{label}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}</strong></div>)}</div>
        <div className="feedback-cards"><article><span>WHAT YOU CREATED</span><p>Your groups combine different strengths and create clear opportunities for learners to support one another.</p></article><article><span>OPPORTUNITY</span><p>Review any pod with similar social tendencies and consider how another mix could support more independent participation.</p></article><article><span>TEACHING INSIGHT</span><p>Grouping is not simply about balancing ability. Social and learning characteristics shape how independently a group functions.</p></article></div>
        <div className="reflection"><div><span className="eyebrow">TAKE A MOMENT TO REFLECT</span><small>{reflectionIndex+1} of 4</small></div><p>{reflections[reflectionIndex]}</p><textarea aria-label="Reflection response" value={responses[reflectionIndex]??""} onChange={e=>setResponses({...responses,[reflectionIndex]:e.target.value})} placeholder="Write your reflection…"/>
          <div>{reflectionIndex>0&&<Button kind="secondary" onClick={()=>setReflectionIndex(x=>x-1)}>Back</Button>}<button className="text-link" onClick={()=>reflectionIndex<3?setReflectionIndex(x=>x+1):undefined}>Skip</button>{reflectionIndex<3?<Button onClick={()=>setReflectionIndex(x=>x+1)}>Next <ArrowRight size={16}/></Button>:<><Button kind="secondary" onClick={()=>{reset();setReflectionIndex(0);setStep("sorting")}}><RotateCcw size={15}/>Try Again</Button><Button onClick={()=>setStep("intro")}>Finish <Check size={16}/></Button></>}</div>
        </div>
      </motion.section>}
    </AnimatePresence>
    <AnimatePresence>{selected&&<ProfilePanel learner={selected} pods={pods} onClose={()=>setSelected(null)} canAssign={step==="sorting"} onAssign={target=>move(selected.id,target)}/>}</AnimatePresence>
  </main>;
}

function AvailableTray({items,total,page,pages,onPage,onInspect,complete,notice,onReset,onBack,onConfirm}:{items:Learner[];total:number;page:number;pages:number;onPage:(x:number)=>void;onInspect:(l:Learner)=>void;complete:boolean;notice:string;onReset:()=>void;onBack:()=>void;onConfirm:()=>void}) {
  const {setNodeRef,isOver}=useDroppable({id:"available"});
  return <div ref={setNodeRef} className={`available-tray ${isOver?"tray-over":""}`}><div className="tray-head"><div><strong>Available Learners <b>{total}</b></strong><span>{complete?"All learners have been assigned to pods.":"Drag a learner to a pod · Click to inspect"}</span></div>{notice&&<p role="status">{notice}</p>}<div className="tray-tools"><Button kind="icon" onClick={onReset}><RotateCcw size={17}/><span className="sr-only">Reset arrangement</span></Button><span>{page+1}/{pages}</span><Button kind="icon" onClick={()=>onPage(Math.max(0,page-1))} disabled={page===0}><ChevronLeft size={18}/></Button><Button kind="icon" onClick={()=>onPage(Math.min(pages-1,page+1))} disabled={page>=pages-1}><ChevronRight size={18}/></Button></div></div>
    <div className="tray-content"><div className="tray-learners">{items.map(l=><DraggableLearner key={l.id} learner={l} onInspect={()=>onInspect(l)}/>)}</div>{complete&&<div className="all-assigned"><Sparkles size={22}/><div><strong>All learners assigned</strong><span>You can now review and confirm your arrangement.</span></div></div>}<div className="tray-actions"><Button kind="secondary" onClick={onBack}><ArrowLeft size={16}/>Back</Button><Button disabled={!complete} onClick={onConfirm}>Confirm Arrangement <ArrowRight size={16}/></Button></div></div>
  </div>;
}

function ReviewOverlay({pods,result,onBack,onContinue}:{pods:Record<PodId,string[]>;result:ReturnType<typeof evaluate>;onBack:()=>void;onContinue:()=>void}) {
  const messages=POD_IDS.map((id,i)=>{const ps=pods[id].map(x=>learners.find(l=>l.id===x)).filter((x):x is Learner=>Boolean(x));const styles=new Set(ps.map(l=>l.learningStyle)).size;const highSocial=ps.filter(l=>l.socialSkill==="High").length;return styles>=3&&highSocial>0?"This group combines varied approaches with a socially confident learner who may support participation.":i%2===0?"This pod may benefit from deliberate opportunities for every learner to contribute.":"The mix creates useful peer-support potential, with clear roles helping the group work independently.";});
  return <><div className="review-callouts">{POD_IDS.map((id,i)=><article key={id} className={id}><span>{id.replace("pod-","POD ")}</span><p>{messages[i]}</p></article>)}</div><div className="review-bar"><Button kind="secondary" onClick={onBack}><ArrowLeft size={16}/>Adjust Groups</Button><div>{[["Ability Balance",result.ability],["Peer Support",result.social],["Group Stability",result.stability],["Learning Style Mix",result.styles]].map(([x,v])=><span key={String(x)}><Check size={13}/>{x}<b>{v}</b></span>)}</div><Button onClick={onContinue}>See Final Feedback <ArrowRight size={16}/></Button></div></>;
}