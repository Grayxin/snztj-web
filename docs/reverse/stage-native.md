# Native stage roster: static evidence

Date: 2026-10-26. Tooling: existing Capstone disassembly plus ordinary pefile/struct reads. No REA, Ghidra or target execution. No game files changed by this analysis.

## What is established

- `0x458c34..0x458c53` dispatches `(stage - 1)` through the PE-resident pointer table at `0x45a629`. Its first 16 entries each initialize one 640×480 stage; entry 17 (`0x45a5c2`) sets mode 5.
- `0x46d83e..0x46d899` selects resource groups by bytes at `0x46db38`: stages 1–6 use group 1; 7–11 use group 2; 12–16 use group 3. It subtracts 6 or 11 to get the within-group screen index.
- `0x46d9dc..0x46da00` selects `(screen - 1) × 40 × 30` words from the BRM payload. Thus the BRM is a sequence of independent screen maps; stitching into a continuous platform world was a reconstruction choice, not original stage structure.
- Spawn helper `0x458a2e` calls the supplied constructor with its second argument, writes the next raw argument into object+0x1ac, then writes x/y shifted left 16 to object+0x1c/+0x20. Those first two numeric arguments are retained raw; their gameplay semantics are not established here.
- Controller helper `0x46dc93` takes stage and an expected enemy count, and initializes `0x514964` at `0x46dce2`. All 16 initial counters exactly equal extracted spawn counts.
- `0x46e4a5` decrements that counter, with 19 incoming calls from enemy update/death handlers. `0x46e3fb` waits for zero; `0x46e432..0x46e43a` increments the stage. This supports clear-all-enemies progression, not a fabricated portal requirement.
- There are explicit comparisons for stages 6, 11 and 16 at `0x46dd8e..0x46dda7` and `0x465be7..0x465c00`. These are distinguished major rounds. Stage 15 also uses the large wolf constructor with a different variant flag.

## Complete roster

Resource labels below denote bound image families, not original character names. Native x/y are object origins in 16.16 fixed point after conversion, not established player-foot coordinates.

| Stage | Resource group / map screen | Player origin x,y | Initial enemy count | Constructor roster |
| --- | --- | --- | --- | --- |
| 1 | 1 / 1 | 204, 358 | 4 | gob1, gob1, gob1, dog1 |
| 2 | 1 / 2 | 224, 336 | 5 | gob1, gob1, gob1, dog1, dog1 |
| 3 | 1 / 3 | 128, 336 | 5 | gob1, gob1, gob2, dog1, dog1 |
| 4 | 1 / 4 | 144, 192 | 6 | gob1, gob2, gob2, gob3, dog1, dog2 |
| 5 | 1 / 5 | 174, 384 | 6 | gob1, gob2, gob3, gob3, dog1, dog2 |
| 6 | 1 / 6 | 32, 384 | 1 | wolf |
| 7 | 2 / 1 | 80, 384 | 5 | dog2, bone1, bone1, gob3, gob3 |
| 8 | 2 / 2 | 224, 256 | 5 | gob3, gob3, dog2, bone1, bone3 |
| 9 | 2 / 3 | 192, 336 | 6 | bone1, bone1, dog2, bone3, bone3, bone3 |
| 10 | 2 / 4 | 32, 320 | 6 | bone3, bone3, bone3, bone2, bone2, bone2 |
| 11 | 2 / 5 | 288, 368 | 4 | gor2_special, gor3_special, kumo, kumo |
| 12 | 3 / 1 | 288, 256 | 6 | bone2, bone2, bone2, bone2, gor1, gor1 |
| 13 | 3 / 2 | 128, 384 | 3 | gor1, gor1, gor2 |
| 14 | 3 / 3 | 288, 224 | 5 | gor2, gor2, gor3, kumo, kumo |
| 15 | 3 / 4 | 32, 384 | 1 | wolf |
| 16 | 3 / 5 | 96, 384 | 1 | wiz |

## Constructor/resource binding

| Constructor | Initial resource slot | Update callback | Resource family |
| --- | --- | --- | --- |
| 0x4471aa | 0x28 | 0x447e34 | gor1 |
| 0x44742c | 0x2a | 0x44a65b | gor2 |
| 0x4476ae | 0x2d | 0x44cf0a | gor3 |
| 0x447930 | 0x2a | 0x44fb0b | gor2, distinct special behavior |
| 0x447bb2 | 0x2d | 0x452345 | gor3, distinct special behavior |
| 0x404d7b | 0x32 | 0x405010 | wolf_l / wolf_r |
| 0x4094ce | 0x36 | 0x40a102 | wiz / wiz_maru |
| 0x4550f1 | 0x36 | 0x4553b0 | kumo, context-specific shared slot |
| 0x43aeb3 | 0x25 | 0x43b8a9 | bone1 |
| 0x43b135 | 0x26 | 0x43f5d4 | bone3 |
| 0x43b3b7 | 0x27 | 0x442bb3 | bone2 |

The giant resource loaders register gor1 slots0x28/0x29 (`0x446da0..0x446de7`), gor2 slots0x2a/0x2b (`0x446f7e..0x446fc5`), gor3 slots0x2d/0x2e (`0x44715c..0x4471a3`). The specialized stage11 constructors therefore share gor2/gor3 art but have separate callbacks from their later ordinary variants.

Stage6 invokes `0x404d7b` at `0x459607`, then writes object+0x1d0=0 at `0x45961a`. Stage15 invokes the same constructor at `0x45a482`, then writes object+0x1d0=1 at `0x45a495`. Both spawn at native x288,y−224, consistent with offscreen entry but not runtime observation of its exact trajectory.

## Origin and timing limits

`0x46d3c7` converts object+0x1c/+0x20 from fixedpoint to integer logical x/y. It obtains the frame dimensions/pivots via `0x419f5c`, optionally scales them, and conditionally subtracts pivots based on sprite/object flags. Native origin must be combined with the actual descriptor to reconstruct screen placement; assigning the supplied y directly to a feet-based body is not established.

This pass does not recover exact enemy attack timing, hitboxes, HP scaling, AI decision thresholds, intermission presentation or every special death path. It establishes the stage sequence, explicit spawns and high-level completion counter. Any new combat timings should be labelled reconstructed until further decoded evidence is available.

The structured record is [stage-native.json](stage-native.json), including each spawn callsite, raw arguments, player spawn and BRM byte offset. SHA-256: `9813a73c418d76499ca1eff6d676884e7d5f127cee821dd4a95e03fffb75fa4f`.
