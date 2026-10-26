"""Read bounded sprite descriptors from the supplied PE; no REA or target execution."""
from pathlib import Path
import struct,json,hashlib
ROOT=Path(__file__).resolve().parents[2]; b=(ROOT/'Mystic.exe').read_bytes()
pe=struct.unpack_from('<I',b,60)[0];base=struct.unpack_from('<I',b,pe+24+28)[0];n=struct.unpack_from('<H',b,pe+6)[0];ss=pe+24+struct.unpack_from('<H',b,pe+20)[0]
def offset(va):
 rva=va-base
 for i in range(n):
  _,size,start,length,raw=struct.unpack_from('<8sIIII',b,ss+i*40)
  if start<=rva<start+length:return raw+rva-start
 raise ValueError(hex(va))
spec={'gor1l':(0x4cd160,True),'gor1r':(0x4cd520,True),'gor2l':(0x4cd900,True),'gor2r':(0x4cdcc0,True),'gor3l':(0x4ce0a0,True),'gor3r':(0x4ce460,True),'wolf_l':(0x490cc0,False),'wolf_r':(0x491440,False),'wiz':(0x4950c0,True),'wiz_maru':(0x4954b0,True),'effect1':(0x49a008,True),'effect2':(0x49ac38,True),'kumo':(0x4cfd40,True)}
manifest=json.loads((ROOT/'web/assets/manifest.json').read_text());atlas={};evidence={}
for name,(va,corners) in spec.items():
 frames=[];w,h=manifest[name]
 for i in range(256):
  r=list(struct.unpack_from('<6i',b,offset(va)+i*24))
  if r[1]==0 and r[3]==0:break
  x,y,c,d,ox,oy=r;fw=c-x if corners else c;fh=d-y if corners else d
  assert 0<=x<x+fw<=w and 0<=y<y+fh<=h,(name,i,r)
  frames.append([x,y,fw,fh,ox,oy])
 atlas[name]=frames;evidence[name]={'address':hex(va),'layout':'xyxy' if corners else 'xywh','frames':len(frames)}
(ROOT/'web/assets/native-atlas.js').write_text('window.NATIVE_ATLAS='+json.dumps(atlas,separators=(',',':'))+';',encoding='utf8')
(ROOT/'web/docs/reverse/atlas-evidence.json').write_text(json.dumps({'source_sha256':hashlib.sha256(b).hexdigest(),'tool':'Python struct PE reader (not REA)','tables':evidence},indent=2),encoding='utf8')
print('Validated sprite descriptors:',{k:len(v) for k,v in atlas.items()})

encounters=json.loads((ROOT/'web/docs/reverse/stage-native.json').read_text(encoding='utf8'))
constructors={'0x428c20':('goblin',1),'0x428ea2':('goblin',2),'0x429124':('goblin',3),'0x433402':('dog',1),'0x433684':('dog',2),'0x43aeb3':('skeleton',1),'0x43b135':('skeleton',3),'0x43b3b7':('skeleton',2),'0x404d7b':('werewolf',1),'0x4094ce':('mage',1),'0x4550f1':('cloud',1),'0x4471aa':('golem',1),'0x44742c':('golem',2),'0x4476ae':('golem',3),'0x447930':('golem',2),'0x447bb2':('golem',3)}
stages=[]
for row in encounters['stages']:
    spawns=[]
    for e in row['spawns']:
        typ,variant=constructors[e['constructor']]
        if typ=='werewolf' and row['stage']==15:variant=2
        spawns.append(dict(type=typ,variant=variant,x=e['x'],y=e['y'],constructor=e['constructor'],parameter=e['constructor_arg']))
    stages.append(dict(number=row['stage'],group=row['resource_group']-1,screen=row['map_screen']-1,spawns=spawns,bossRound=row['stage'] in (6,11,15,16),player=row.get('player_spawn')))
(ROOT/'web/assets/encounters.js').write_text('window.NATIVE_STAGES='+json.dumps(stages,separators=(',',':'))+';',encoding='utf8')
print('Exported 16 original encounters:',[len(s['spawns']) for s in stages])
