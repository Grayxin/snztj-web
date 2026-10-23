"""Extract original Mystic Arts resources. CNX algorithm reference: PuyoTools (MIT), drx/Luke Zapart."""
from pathlib import Path
import struct,json
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'web'/'assets'; OUT.mkdir(exist_ok=True)
def cnx(b):
    assert b[:4]==b'CNX\x02'
    size=int.from_bytes(b[12:16],'big'); p=16; out=bytearray(); ring=bytearray(2048); bp=0
    def emit(v):
        nonlocal bp
        out.append(v);ring[bp]=v;bp=(bp+1)&2047
    while p<len(b):
        flag=b[p];p+=1
        if not flag:break
        for _ in range(4):
            mode=flag&3;flag>>=2
            if mode==0:
                p+=b[p]+1;break
            if mode==1:emit(b[p]);p+=1
            if mode==2:
                pair=int.from_bytes(b[p:p+2],'big');p+=2
                for j in range((pair&31)+4):emit(ring[(bp-(pair>>5)-1)&2047])
            if mode==3:
                n=b[p];p+=1
                for v in b[p:p+n]:emit(v)
                p+=n
            if p>=len(b):break
    assert len(out)==size,(len(out),size)
    return bytes(out)
def image(b,transparent):
    from PIL import Image
    assert b[:8]==b'GMP-200\0'
    h,w=struct.unpack_from('<II',b,8);off=struct.unpack_from('<I',b,24)[0]
    n,depth=struct.unpack_from('<HH',b,28)
    assert depth in (4,8)
    palette=[(b[34+i*4],b[33+i*4],b[32+i*4],0 if transparent and i==0 else 255) for i in range(n)]
    indices=list(b[off:]) if depth==8 else [j for v in b[off:] for j in (v>>4,v&15)]
    assert len(indices)==w*h
    im=Image.new('RGBA',(w,h));im.putdata([palette[i] for i in indices])
    return im.transpose(Image.Transpose.FLIP_TOP_BOTTOM)

def midi_notes(b):
    # Standard MIDI: collect note pairs, tempo changes, then convert ticks to seconds.
    division=int.from_bytes(b[12:14],'big');p=14;events=[];tempos=[(0,500000)]
    def vlq():
        nonlocal p
        v=0
        while True:
            c=b[p];p+=1;v=(v<<7)|(c&127)
            if c<128:return v
    while p<len(b) and b[p:p+4]==b'MTrk':
        end=p+8+int.from_bytes(b[p+4:p+8],'big');p+=8;t=0;running=0
        while p<end:
            t+=vlq();status=b[p]
            if status>=128:p+=1;running=status
            else:status=running
            if status==255:
                typ=b[p];p+=1;n=vlq()
                if typ==81:tempos.append((t,int.from_bytes(b[p:p+n],'big')))
                p+=n
            elif status in (240,247):n=vlq();p+=n
            else:
                n=1 if status>>4 in (12,13) else 2;data=b[p:p+n];p+=n
                if status>>4 in (8,9) and status&15!=9:events.append((t,status,data[0],data[1]))
        p=end
    tempos=sorted(dict(tempos).items())
    def secs(t):
        last=0;tempo=500000;s=0
        for tick,new in tempos:
            if tick>t:break
            s+=(tick-last)*tempo/1e6/division;last=tick;tempo=new
        return s+(t-last)*tempo/1e6/division
    active={};notes=[]
    for tick,status,key,vel in sorted(events):
        k=(status&15,key)
        if status>>4==9 and vel:active[k]=(tick,vel)
        elif k in active:
            start,v=active.pop(k);duration=secs(tick)-secs(start)
            if duration>0:notes.append([round(secs(start),4),round(duration,4),key,v])
    return sorted(notes)

if __name__=='__main__':
    manifest={}
    for p in (ROOT/'Cnx').glob('*.CNX'):
        name=p.stem.lower();b=cnx(p.read_bytes())
        im=image(b,name not in ['ttl','rogwall','rogo1','stgb01','stgb02','stgb03','end01','end02','end03','end04'])
        im.save(OUT/(name+'.png'));manifest[name]=list(im.size)
    levels=[]
    for stage in range(1,4):
        layers=[]
        for kind in ['f','a']:
            b=(ROOT/'Dat'/f'STG{kind}{stage:02}.brm').read_bytes();w,h=struct.unpack_from('<HH',b,8)
            data=struct.unpack_from('<'+'H'*(w*h),b,12);screens=h//30;assert h%30==0
            flat=[data[(s*30+y)*40+x] for y in range(30) for s in range(screens) for x in range(40)]
            layers.append(flat)
        assert max(layers[0])<280
        # Grass overhang extends above the attribute cell: 7px in forest, 3px in other tilesets.
        levels.append(dict(width=screens*40,height=30,surfaceOffset=7 if stage==1 else 3,tiles=layers[0],attrs=layers[1]))
    b=(ROOT/'Dat/MysticA.mlk').read_bytes();starts=[i for i in range(len(b)) if b.startswith(b'MThd',i)]
    music=[]
    for i,start in enumerate(starts):
        raw=b[start:starts[i+1] if i+1<len(starts) else len(b)];(OUT/f'music{i+1}.mid').write_bytes(raw)
        music.append(midi_notes(raw))
    (OUT/'data.js').write_text('window.GAME_DATA='+json.dumps(dict(images=manifest,levels=levels,music=music),separators=(',',':'))+';',encoding='utf8')
    (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
    print(f'Validated {len(manifest)} images; {len(levels)} maps; {len(music)} MIDI songs / {sum(map(len,music))} notes')
