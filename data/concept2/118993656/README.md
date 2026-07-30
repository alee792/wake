# Concept2 workout 118993656

Source exports supplied by the athlete on July 30, 2026. All files are kept
unchanged so the Concept2 adapter can be tested against multiple representations
of the same workout.

The TCX identifies the activity at `2026-07-30T13:35:00Z` and describes eight
alternating laps:

| Phase | Session time |
|---|---:|
| Work 1 | 0:00–4:00 |
| Recovery 1 | 4:00–7:00 |
| Work 2 | 7:00–11:00 |
| Recovery 2 | 11:00–14:00 |
| Work 3 | 14:00–18:00 |
| Recovery 3 | 18:00–21:00 |
| Work 4 | 21:00–25:00 |
| Recovery 4 | 25:00–28:00 |

The stroke-level CSV contains 761 records across four seven-minute blocks. Its
`Time (seconds)` and distance fields reset at the start of each block. The four
block endpoints are:

| Block | Local end | Distance at end |
|---|---:|---:|
| 1 | 420.7 s | 1,520.2 m |
| 2 | 396.9 s | 1,445.5 m |
| 3 | 419.1 s | 1,521.4 m |
| 4 | 404.2 s | 1,443.8 m |

Consumers must normalize each block onto the global 0:00–28:00 session clock.
The final block endpoint is not the full workout duration.

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `concept2-logbook-workout-118993656.fit` | 12,255 | `ce762b300e28977990e10d0d490d4f74b46ff06c01136196b3afb464b42b9da2` |
| `concept2-logbook-workout-118993656.tcx` | 364,788 | `e4654c407bc5d9b125b3f20c32d373af125d940b2d1ff6a61d79b7349770bbf5` |
| `concept2-result-118993656.csv` | 27,911 | `c3dc6d7e044ba72dcb75290aa942350e326daf9f4c34243124de60daeca38506` |

The TCX is valid XML. The FIT file is retained as the original binary export;
the CSV is the easiest fixture for initial ingestion and comparison.
