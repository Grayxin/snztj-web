0046dc93: push ebp
0046dc94: mov ebp, esp
0046dc96: push ecx
0046dc97: push 0
0046dc99: push 0x46dceb
0046dc9e: call 0x401174
0046dca3: add esp, 8
0046dca6: mov dword ptr [ebp - 4], eax
0046dca9: mov eax, dword ptr [ebp - 4]
0046dcac: mov dword ptr [eax], 0
0046dcb2: mov ecx, dword ptr [ebp - 4]
0046dcb5: mov dword ptr [ecx + 0x2c], 0
0046dcbc: mov edx, dword ptr [ebp - 4]
0046dcbf: mov dword ptr [edx + 0x28], 0
0046dcc6: mov eax, dword ptr [ebp - 4]
0046dcc9: mov dword ptr [eax + 0xfc], 0
0046dcd3: mov ecx, dword ptr [ebp - 4]
0046dcd6: mov edx, dword ptr [ebp + 8]
0046dcd9: mov dword ptr [ecx + 0xf0], edx
0046dcdf: mov eax, dword ptr [ebp + 0xc]
0046dce2: mov dword ptr [0x514964], eax
0046dce7: mov esp, ebp
0046dce9: pop ebp
0046dcea: ret 
0046dceb: push ebp
0046dcec: mov ebp, esp
0046dcee: sub esp, 0x1c
0046dcf1: mov eax, dword ptr [ebp + 8]
0046dcf4: mov ecx, dword ptr [eax + 0xfc]
0046dcfa: add ecx, 1
0046dcfd: mov edx, dword ptr [ebp + 8]
0046dd00: mov dword ptr [edx + 0xfc], ecx
0046dd06: mov eax, dword ptr [ebp + 8]
0046dd09: cmp dword ptr [eax + 0xfc], 0x12b
0046dd13: jne 0x46dd22
0046dd15: mov ecx, dword ptr [ebp + 8]
0046dd18: mov dword ptr [ecx + 0xfc], 0x12a
0046dd22: mov edx, dword ptr [ebp + 8]
0046dd25: mov eax, dword ptr [edx + 0xfc]
0046dd2b: mov dword ptr [ebp - 0x18], eax
0046dd2e: cmp dword ptr [ebp - 0x18], 0x22b
0046dd35: jg 0x46dd65
0046dd37: cmp dword ptr [ebp - 0x18], 0x22b
0046dd3e: je 0x46de04
0046dd44: cmp dword ptr [ebp - 0x18], 1
0046dd48: je 0x46dd84
0046dd4a: cmp dword ptr [ebp - 0x18], 0x131
0046dd51: je 0x46ddc4
0046dd53: cmp dword ptr [ebp - 0x18], 0x16a
0046dd5a: je 0x46dde0
0046dd60: jmp 0x46de7e
0046dd65: cmp dword ptr [ebp - 0x18], 0x233
0046dd6c: je 0x46de19
0046dd72: cmp dword ptr [ebp - 0x18], 0x235
0046dd79: je 0x46de57
0046dd7f: jmp 0x46de7e
0046dd84: push 0
0046dd86: call 0x46f5d0
0046dd8b: add esp, 4
0046dd8e: cmp dword ptr [0x51b3a0], 6
0046dd95: je 0x46dda9
0046dd97: cmp dword ptr [0x51b3a0], 0xb
0046dd9e: je 0x46dda9
0046dda0: cmp dword ptr [0x51b3a0], 0x10
0046dda7: jne 0x46ddb5
0046dda9: push 3
0046ddab: call 0x46f59b
0046ddb0: add esp, 4
0046ddb3: jmp 0x46ddbf
0046ddb5: push 1
0046ddb7: call 0x46f59b
0046ddbc: add esp, 4
0046ddbf: jmp 0x46de7e
0046ddc4: cmp dword ptr [0x51b3a0], 0x11
0046ddcb: je 0x46dddb
0046ddcd: push 0x2d
0046ddcf: push 0
0046ddd1: push 0x7f
0046ddd3: call 0x420300
0046ddd8: add esp, 0xc
0046dddb: jmp 0x46de7e
0046dde0: call 0x46f5d0
0046dde5: cmp dword ptr [0x51b3a0], 0x11
0046ddec: je 0x46ddf8
0046ddee: push 2
0046ddf0: call 0x46f59b
0046ddf5: add esp, 4
0046ddf8: call 0x46ecb3
0046ddfd: call 0x46ee0e
0046de02: jmp 0x46de7e
0046de04: push 0
0046de06: push 8
0046de08: push 0
0046de0a: push 0x10000
0046de0f: call 0x420440
0046de14: add esp, 0x10
0046de17: jmp 0x46de7e
0046de19: push 0xa
0046de1b: push 0
0046de1d: push 0x100
0046de22: call 0x41c427
0046de27: add esp, 0xc
0046de2a: push 0xff
0046de2f: call 0x417e33
0046de34: add esp, 4
0046de37: push 0x101
0046de3c: call 0x417e33
0046de41: add esp, 4
0046de44: call 0x414ba2
0046de49: push 5
0046de4b: push 1
0046de4d: call 0x401201
0046de52: add esp, 8
0046de55: jmp 0x46de7e
0046de57: mov ecx, dword ptr [ebp + 8]
0046de5a: push ecx
0046de5b: call 0x401803
0046de60: add esp, 4
0046de63: push 6
0046de65: push 0
0046de67: call 0x401201
0046de6c: add esp, 8
0046de6f: mov dword ptr [0x51b390], 3
0046de79: jmp 0x46e4a1
0046de7e: mov edx, dword ptr [0x51b3a0]
0046de84: mov dword ptr [ebp - 0x1c], edx
0046de87: cmp dword ptr [ebp - 0x1c], 6
0046de8b: je 0x46dea2
0046de8d: cmp dword ptr [ebp - 0x1c], 0xf
0046de91: je 0x46dea2
0046de93: cmp dword ptr [ebp - 0x1c], 0x10
0046de97: je 0x46e0ee
0046de9d: jmp 0x46e1b7
0046dea2: mov eax, dword ptr [ebp + 8]
0046dea5: cmp dword ptr [eax + 0xfc], 0xaa
0046deaf: jne 0x46e0d0
0046deb5: push 4
0046deb7: push 0x46e4b7
0046debc: call 0x401174
0046dec1: add esp, 8
0046dec4: mov dword ptr [ebp - 8], eax
0046dec7: mov ecx, dword ptr [ebp - 8]
0046deca: mov dword ptr [ecx], 0x20000000
0046ded0: mov edx, dword ptr [ebp - 8]
0046ded3: mov dword ptr [edx + 0x2c], 0x40100a2
0046deda: mov eax, dword ptr [ebp - 8]
0046dedd: mov dword ptr [eax + 0x1a8], 0x4171a9
0046dee7: mov ecx, dword ptr [ebp - 8]
0046deea: mov dword ptr [ecx + 0x24c], 0xa000
0046def4: mov edx, dword ptr [ebp - 8]
0046def7: mov dword ptr [edx + 0x250], 0x500
0046df01: mov eax, dword ptr [ebp - 8]
0046df04: mov dword ptr [eax + 0x254], 0x400
0046df0e: mov ecx, dword ptr [ebp - 8]
0046df11: mov dword ptr [ecx + 0x258], 0
0046df1b: mov edx, dword ptr [ebp - 8]
0046df1e: mov dword ptr [edx + 0x28], 0x500017
0046df25: mov eax, dword ptr [ebp - 8]
0046df28: mov dword ptr [eax + 0x1c], 0xe00000
0046df2f: mov ecx, dword ptr [ebp - 8]
0046df32: mov dword ptr [ecx + 0x20], 0xc80000
0046df39: mov edx, dword ptr [ebp - 8]
0046df3c: mov dword ptr [edx + 0x24], 0x40000000
0046df43: mov eax, dword ptr [ebp - 8]
0046df46: mov dword ptr [eax + 0xfc], 0x78
0046df50: mov ecx, dword ptr [ebp + 8]
0046df53: cmp dword ptr [ecx + 0xf0], 0xa
0046df5a: jl 0x46e016
0046df60: push 4
0046df62: push 0x46e4b7
0046df67: call 0x401174
0046df6c: add esp, 8
0046df6f: mov dword ptr [ebp - 8], eax
0046df72: mov edx, dword ptr [ebp - 8]
0046df75: mov dword ptr [edx], 0x20000000
0046df7b: mov eax, dword ptr [ebp - 8]
0046df7e: mov dword ptr [eax + 0x2c], 0x40100a2
0046df85: mov ecx, dword ptr [ebp - 8]
0046df88: mov dword ptr [ecx + 0x1a8], 0x4171a9
0046df92: mov edx, dword ptr [ebp - 8]
0046df95: mov dword ptr [edx + 0x24c], 0xa000
0046df9f: mov eax, dword ptr [ebp - 8]
0046dfa2: mov dword ptr [eax + 0x250], 0x500
0046dfac: mov ecx, dword ptr [ebp - 8]
0046dfaf: mov dword ptr [ecx + 0x254], 0x400
0046dfb9: mov edx, dword ptr [ebp - 8]
0046dfbc: mov dword ptr [edx + 0x258], 0
0046dfc6: mov eax, dword ptr [ebp + 8]
0046dfc9: mov eax, dword ptr [eax + 0xf0]
0046dfcf: cdq 
0046dfd0: mov ecx, 0xa
0046dfd5: idiv ecx
0046dfd7: add eax, 0x500018
0046dfdc: mov edx, dword ptr [ebp - 8]
0046dfdf: mov dword ptr [edx + 0x28], eax
0046dfe2: mov eax, dword ptr [ebp - 8]
0046dfe5: mov dword ptr [eax + 0x1c], 0x1700000
0046dfec: mov ecx, dword ptr [ebp - 8]
0046dfef: mov dword ptr [ecx + 0x20], 0xc80000
0046dff6: mov edx, dword ptr [ebp - 8]
0046dff9: mov dword ptr [edx + 0x24], 0x40000000
0046e000: mov eax, dword ptr [ebp - 8]
0046e003: mov dword ptr [eax + 0xfc], 0x78
0046e00d: mov dword ptr [ebp - 4], 0x200000
0046e014: jmp 0x46e01d
0046e016: mov dword ptr [ebp - 4], 0
0046e01d: push 4
0046e01f: push 0x46e4b7
0046e024: call 0x401174
0046e029: add esp, 8
0046e02c: mov dword ptr [ebp - 8], eax
0046e02f: mov ecx, dword ptr [ebp - 8]
0046e032: mov dword ptr [ecx], 0x20000000
0046e038: mov edx, dword ptr [ebp - 8]
0046e03b: mov dword ptr [edx + 0x2c], 0x40100a2
0046e042: mov eax, dword ptr [ebp - 8]
0046e045: mov dword ptr [eax + 0x1a8], 0x4171a9
0046e04f: mov ecx, dword ptr [ebp - 8]
0046e052: mov dword ptr [ecx + 0x24c], 0xa000
0046e05c: mov edx, dword ptr [ebp - 8]
0046e05f: mov dword ptr [edx + 0x250], 0x500
0046e069: mov eax, dword ptr [ebp - 8]
0046e06c: mov dword ptr [eax + 0x254], 0x400
0046e076: mov ecx, dword ptr [ebp - 8]
0046e079: mov dword ptr [ecx + 0x258], 0
0046e083: mov edx, dword ptr [ebp + 8]
0046e086: mov eax, dword ptr [edx + 0xf0]
0046e08c: cdq 
0046e08d: mov ecx, 0xa
0046e092: idiv ecx
0046e094: add edx, 0x500018
0046e09a: mov eax, dword ptr [ebp - 8]
0046e09d: mov dword ptr [eax + 0x28], edx
0046e0a0: mov ecx, dword ptr [ebp - 4]
0046e0a3: add ecx, 0x1700000
0046e0a9: mov edx, dword ptr [ebp - 8]
0046e0ac: mov dword ptr [edx + 0x1c], ecx
0046e0af: mov eax, dword ptr [ebp - 8]
0046e0b2: mov dword ptr [eax + 0x20], 0xc80000
0046e0b9: mov ecx, dword ptr [ebp - 8]
0046e0bc: mov dword ptr [ecx + 0x24], 0x40000000
0046e0c3: mov edx, dword ptr [ebp - 8]
0046e0c6: mov dword ptr [edx + 0xfc], 0x78
0046e0d0: mov eax, dword ptr [ebp + 8]
0046e0d3: cmp dword ptr [eax + 0xfc], 0x122
0046e0dd: jne 0x46e0e9
0046e0df: mov dword ptr [0x51b3ac], 1
0046e0e9: jmp 0x46e3fb
0046e0ee: mov ecx, dword ptr [ebp + 8]
0046e0f1: cmp dword ptr [ecx + 0xfc], 0x1e
0046e0f8: jne 0x46e199
0046e0fe: push 4
0046e100: push 0x46e4b7
0046e105: call 0x401174
0046e10a: add esp, 8
0046e10d: mov dword ptr [ebp - 8], eax
0046e110: mov edx, dword ptr [ebp - 8]
0046e113: mov dword ptr [edx], 0x20000000
0046e119: mov eax, dword ptr [ebp - 8]
0046e11c: mov dword ptr [eax + 0x2c], 0x40100a2
0046e123: mov ecx, dword ptr [ebp - 8]
0046e126: mov dword ptr [ecx + 0x1a8], 0x4171a9
0046e130: mov edx, dword ptr [ebp - 8]
0046e133: mov dword ptr [edx + 0x24c], 0xa000
0046e13d: mov eax, dword ptr [ebp - 8]
0046e140: mov dword ptr [eax + 0x250], 0x500
0046e14a: mov ecx, dword ptr [ebp - 8]
0046e14d: mov dword ptr [ecx + 0x254], 0x400
0046e157: mov edx, dword ptr [ebp - 8]
0046e15a: mov dword ptr [edx + 0x258], 0
0046e164: mov eax, dword ptr [ebp - 8]
0046e167: mov dword ptr [eax + 0x28], 0x500015
0046e16e: mov ecx, dword ptr [ebp - 8]
0046e171: mov dword ptr [ecx + 0x1c], 0xc80000
0046e178: mov edx, dword ptr [ebp - 8]
0046e17b: mov dword ptr [edx + 0x20], 0xc80000
0046e182: mov eax, dword ptr [ebp - 8]
0046e185: mov dword ptr [eax + 0x24], 0x40000000
0046e18c: mov ecx, dword ptr [ebp - 8]
0046e18f: mov dword ptr [ecx + 0xfc], 0x78
0046e199: mov edx, dword ptr [ebp + 8]
0046e19c: cmp dword ptr [edx + 0xfc], 0x96
0046e1a6: jne 0x46e1b2
0046e1a8: mov dword ptr [0x51b3ac], 1
0046e1b2: jmp 0x46e3fb
0046e1b7: mov eax, dword ptr [ebp + 8]
0046e1ba: cmp dword ptr [eax + 0xfc], 0x1e
0046e1c1: jne 0x46e3e2
0046e1c7: push 4
0046e1c9: push 0x46e4b7
0046e1ce: call 0x401174
0046e1d3: add esp, 8
0046e1d6: mov dword ptr [ebp - 8], eax
0046e1d9: mov ecx, dword ptr [ebp - 8]
0046e1dc: mov dword ptr [ecx], 0x20000000
0046e1e2: mov edx, dword ptr [ebp - 8]
0046e1e5: mov dword ptr [edx + 0x2c], 0x40100a2
0046e1ec: mov eax, dword ptr [ebp - 8]
0046e1ef: mov dword ptr [eax + 0x1a8], 0x4171a9
0046e1f9: mov ecx, dword ptr [ebp - 8]
0046e1fc: mov dword ptr [ecx + 0x24c], 0xa000
0046e206: mov edx, dword ptr [ebp - 8]
0046e209: mov dword ptr [edx + 0x250], 0x500
0046e213: mov eax, dword ptr [ebp - 8]
0046e216: mov dword ptr [eax + 0x254], 0x400
0046e220: mov ecx, dword ptr [ebp - 8]
0046e223: mov dword ptr [ecx + 0x258], 0
0046e22d: mov edx, dword ptr [ebp - 8]
0046e230: mov dword ptr [edx + 0x28], 0x500017
0046e237: mov eax, dword ptr [ebp - 8]
0046e23a: mov dword ptr [eax + 0x1c], 0xe00000
0046e241: mov ecx, dword ptr [ebp - 8]
0046e244: mov dword ptr [ecx + 0x20], 0xc80000
0046e24b: mov edx, dword ptr [ebp - 8]
0046e24e: mov dword ptr [edx + 0x24], 0x40000000
0046e255: mov eax, dword ptr [ebp - 8]
0046e258: mov dword ptr [eax + 0xfc], 0x78
0046e262: mov ecx, dword ptr [ebp + 8]
0046e265: cmp dword ptr [ecx + 0xf0], 0xa
0046e26c: jl 0x46e328
0046e272: push 4
0046e274: push 0x46e4b7
0046e279: call 0x401174
0046e27e: add esp, 8
0046e281: mov dword ptr [ebp - 8], eax
0046e284: mov edx, dword ptr [ebp - 8]
0046e287: mov dword ptr [edx], 0x20000000
0046e28d: mov eax, dword ptr [ebp - 8]
0046e290: mov dword ptr [eax + 0x2c], 0x40100a2
0046e297: mov ecx, dword ptr [ebp - 8]
0046e29a: mov dword ptr [ecx + 0x1a8], 0x4171a9
0046e2a4: mov edx, dword ptr [ebp - 8]
0046e2a7: mov dword ptr [edx + 0x24c], 0xa000
0046e2b1: mov eax, dword ptr [ebp - 8]
0046e2b4: mov dword ptr [eax + 0x250], 0x500
0046e2be: mov ecx, dword ptr [ebp - 8]
0046e2c1: mov dword ptr [ecx + 0x254], 0x400
0046e2cb: mov edx, dword ptr [ebp - 8]
0046e2ce: mov dword ptr [edx + 0x258], 0
0046e2d8: mov eax, dword ptr [ebp + 8]
0046e2db: mov eax, dword ptr [eax + 0xf0]
0046e2e1: cdq 
0046e2e2: mov ecx, 0xa
0046e2e7: idiv ecx
0046e2e9: add eax, 0x500018
0046e2ee: mov edx, dword ptr [ebp - 8]
0046e2f1: mov dword ptr [edx + 0x28], eax
0046e2f4: mov eax, dword ptr [ebp - 8]
0046e2f7: mov dword ptr [eax + 0x1c], 0x1700000
0046e2fe: mov ecx, dword ptr [ebp - 8]
0046e301: mov dword ptr [ecx + 0x20], 0xc80000
0046e308: mov edx, dword ptr [ebp - 8]
0046e30b: mov dword ptr [edx + 0x24], 0x40000000
0046e312: mov eax, dword ptr [ebp - 8]
0046e315: mov dword ptr [eax + 0xfc], 0x78
0046e31f: mov dword ptr [ebp - 4], 0x200000
0046e326: jmp 0x46e32f
0046e328: mov dword ptr [ebp - 4], 0
0046e32f: push 4
0046e331: push 0x46e4b7
0046e336: call 0x401174
0046e33b: add esp, 8
0046e33e: mov dword ptr [ebp - 8], eax
0046e341: mov ecx, dword ptr [ebp - 8]
0046e344: mov dword ptr [ecx], 0x20000000
0046e34a: mov edx, dword ptr [ebp - 8]
0046e34d: mov dword ptr [edx + 0x2c], 0x40100a2
0046e354: mov eax, dword ptr [ebp - 8]
0046e357: mov dword ptr [eax + 0x1a8], 0x4171a9
0046e361: mov ecx, dword ptr [ebp - 8]
0046e364: mov dword ptr [ecx + 0x24c], 0xa000
0046e36e: mov edx, dword ptr [ebp - 8]
0046e371: mov dword ptr [edx + 0x250], 0x500
0046e37b: mov eax, dword ptr [ebp - 8]
0046e37e: mov dword ptr [eax + 0x254], 0x400
0046e388: mov ecx, dword ptr [ebp - 8]
0046e38b: mov dword ptr [ecx + 0x258], 0
0046e395: mov edx, dword ptr [ebp + 8]
0046e398: mov eax, dword ptr [edx + 0xf0]
0046e39e: cdq 
0046e39f: mov ecx, 0xa
0046e3a4: idiv ecx
0046e3a6: add edx, 0x500018
0046e3ac: mov eax, dword ptr [ebp - 8]
0046e3af: mov dword ptr [eax + 0x28], edx
0046e3b2: mov ecx, dword ptr [ebp - 4]
0046e3b5: add ecx, 0x1700000
0046e3bb: mov edx, dword ptr [ebp - 8]
0046e3be: mov dword ptr [edx + 0x1c], ecx
0046e3c1: mov eax, dword ptr [ebp - 8]
0046e3c4: mov dword ptr [eax + 0x20], 0xc80000
0046e3cb: mov ecx, dword ptr [ebp - 8]
0046e3ce: mov dword ptr [ecx + 0x24], 0x40000000
0046e3d5: mov edx, dword ptr [ebp - 8]
0046e3d8: mov dword ptr [edx + 0xfc], 0x78
0046e3e2: mov eax, dword ptr [ebp + 8]
0046e3e5: cmp dword ptr [eax + 0xfc], 0x96
0046e3ef: jne 0x46e3fb
0046e3f1: mov dword ptr [0x51b3ac], 1
0046e3fb: cmp dword ptr [0x514964], 0
0046e402: jne 0x46e4a1
0046e408: mov ecx, dword ptr [ebp + 8]
0046e40b: cmp dword ptr [ecx + 0xfc], 0x12c
0046e415: jge 0x46e4a1
0046e41b: mov dword ptr [0x51b3ac], 2
0046e425: mov edx, dword ptr [ebp + 8]
0046e428: mov dword ptr [edx + 0xfc], 0x12c
0046e432: mov eax, dword ptr [0x51b3a0]
0046e437: add eax, 1
0046e43a: mov dword ptr [0x51b3a0], eax
0046e43f: call 0x403a0c
0046e444: mov dword ptr [ebp - 8], eax
0046e447: mov ecx, 3
0046e44c: sub ecx, dword ptr [0x51b368]
0046e452: mov dword ptr [ebp - 4], ecx
0046e455: mov edx, dword ptr [ebp - 4]
0046e458: imul edx, dword ptr [0x51b3b0]
0046e45f: shl edx, 4
0046e462: mov eax, dword ptr [ebp - 8]
0046e465: mov ecx, dword ptr [eax + 0x218]
0046e46b: add ecx, edx
0046e46d: mov dword ptr [0x51b378], ecx
0046e473: mov edx, dword ptr [ebp - 8]
0046e476: mov eax, dword ptr [0x51b378]
0046e47b: cmp eax, dword ptr [edx + 0x220]
0046e481: jl 0x46e492
0046e483: mov ecx, dword ptr [ebp - 8]
0046e486: mov edx, dword ptr [ecx + 0x220]
0046e48c: mov dword ptr [0x51b378], edx
0046e492: mov eax, dword ptr [ebp - 8]
0046e495: mov ecx, dword ptr [eax + 0x228]
0046e49b: mov dword ptr [0x51b3a4], ecx
0046e4a1: mov esp, ebp
0046e4a3: pop ebp
0046e4a4: ret 
0046e4a5: push ebp
0046e4a6: mov ebp, esp
0046e4a8: mov eax, dword ptr [0x514964]
0046e4ad: sub eax, 1
0046e4b0: mov dword ptr [0x514964], eax
0046e4b5: pop ebp
0046e4b6: ret 
0046e4b7: push ebp
0046e4b8: mov ebp, esp
0046e4ba: mov eax, dword ptr [ebp + 8]
0046e4bd: mov ecx, dword ptr [eax + 0x24c]
0046e4c3: mov edx, dword ptr [ebp + 8]
0046e4c6: add ecx, dword ptr [edx + 0x250]
0046e4cc: mov eax, dword ptr [ebp + 8]
0046e4cf: mov dword ptr [eax + 0x24c], ecx