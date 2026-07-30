# Wake — Product Vision

Status

Canonical product guide for the hackathon and future development

Purpose

Keep the product on its golden path while implementation moves quickly.

## 1. Product Thesis

Wake turns a recorded rowing session into an interactive coaching replay.

The athlete provides a workout video, Concept2 performance data, and optionally heart-rate data or workout intent. Specialized agents examine these synchronized signals over time, build a shared understanding of the session, and produce coaching that feels natural, selective, and specific.

The product does not merely summarize a video or graph telemetry. It reconstructs how the session unfolded: what changed, which moments mattered, what likely influenced those changes, what a coach would have said, and what the athlete should practice next.

One-sentence description

Wake transforms recorded rowing sessions into explainable coaching replays that show what changed, why it mattered, and how to improve.

## 2. User Promise

After reviewing a session, the athlete should understand:

- the defining story of the workout;
- the most important performance or technique transitions;
- what a good coxswain would have said at pivotal moments;
- which patterns repeated or worsened over time;
- what the athlete did well or corrected naturally;
- the highest-leverage drill for the next session.

The experience should feel like reviewing footage with a coach who watched every stroke, understood the workout plan, and remembered the objective data.

## 3. The Problem

Concept2 machines provide excellent measurements but limited interpretation. A rower can see pace, watts, stroke rate, distance, intervals, and heart rate, yet still not know why performance changed.

Video provides additional context, but manually reviewing an entire session is tedious and requires expertise. A single visual observation can also be misleading without the workout phase and telemetry around it.

Most fitness products therefore stop at one of two weak outcomes:

- dashboards that show what happened without explaining it;
- generic AI advice that is not tied to specific evidence.

Wake connects the performance record, visible technique, sound, effort, workout intent, and timing into one understandable coaching experience.

## 4. Primary User

The initial user is a recreational or competitive Concept2 rower who records workouts on a phone and wants better feedback without requiring a coach to review every session.

The expected capture setup is ordinary:

- one phone;
- a full recorded workout;
- a front, three-quarter, or side view;
- normal household or gym lighting;
- independently available Concept2 data;
- optional heart-rate data.

The product should extract value from realistic consumer recordings rather than assuming a laboratory setup.

## 5. The Core Experience

5.1 Upload a session

The athlete provides:

- workout video;
- Concept2 workout data;
- optional heart-rate data;
- optional workout structure, target pace, target rate, or focus.

5.2 Reconstruct the session

Agents align the inputs to a common clock, identify phases of the workout, and produce timestamped observations.

They then collaborate to identify meaningful events such as:

- cadence transition;
- rhythm stabilization;
- efficiency loss;
- technique drift;
- fatigue-associated change;
- strong correction;
- water break;
- interruption;
- final push.

5.3 Explore the replay

The primary interface is a synchronized timeline with:

- video;
- pace, watts, stroke rate, and distance;
- heart rate when available;
- workout phases;
- technique and rhythm markers;
- audio-derived events;
- coxswain cues;
- pivotal moments.

Selecting a moment seeks the video and reveals a concise coaching insight. Evidence and deeper reasoning are available on expansion rather than forced into the default experience.

5.4 Leave with a plan

The review ends with a small number of drills tied directly to observed patterns.

Each drill explains:

- the pattern it addresses;
- why it matters;
- how to perform the drill;
- how success will be measured in a future session.
## 6. Product Principles

6.1 Coaching first

Wake is a coaching product, not an analytics dashboard.

The default language should sound like a coach:

“Settle the recovery. You’re adding rate without adding power.”

It should not sound like a research report:

“Across multiple modalities, the system infers reduced efficiency.”

The user should receive the insight first. Explanation and evidence should remain available underneath it.

6.2 Time is the organizing structure

Athletic performance changes throughout a session. Every meaningful observation, event, cue, and recommendation must be anchored to time or to a workout segment.

A single score cannot capture a session’s story.

6.3 Events are the unit of understanding

Measurements support observations. Observations form events. Events become coaching.

The system should organize the replay around moments a coach would care about, not around isolated model outputs.

6.4 Shared performance understanding

No individual input tells the complete story.

Concept2 is the authoritative performance layer. Video contributes visible movement, rhythm, technique, and real-world events. Audio contributes cadence, breathing, speech, and interruption cues. Heart rate provides effort context. Workout intent explains what the athlete was trying to do.

Agents should combine these into one evolving understanding rather than producing separate reports.

6.5 Evidence should be available, not intrusive

A coach states the useful insight directly.

When the athlete asks why, the product explains. When the athlete wants proof, the product reveals the relevant video, metrics, timing, confidence, and limitations.

The hierarchy is:

Coach

→ Explanation

→ Evidence

6.6 Selective coaching

A useful coxswain does not speak every stroke.

The system should prioritize a small number of high-value cues and recognize when silence, encouragement, or confirmation is better than correction.

6.7 Workout intent changes meaning

The same behavior may be appropriate in one phase and inefficient in another. A rate increase during a sprint is not the same as an unplanned rate increase during steady work.

Analysis must consider the current interval, target, remaining work, and session objective.

6.8 Personalized action

Recommendations must trace back to the athlete’s session. Generic drills that could have been produced without reviewing the workout are not good enough.

## 7. The Primary Product Surface

The interactive workout timeline is the product’s center of gravity.

At overview level, it shows the shape of the session:

- workout phases;
- performance trends;
- stable and unstable periods;
- clusters of notable events;
- selected coaching moments.

At moment level, it shows:

- the relevant video clip;
- the concise coaching insight;
- what changed before and after;
- supporting performance values;
- optional deeper analysis;
- a related drill or future focus.

The graph, agent workflow, prompts, and intermediate outputs are implementation machinery. They should disappear behind a polished replay.

## 8. Coaching Output

8.1 Coxswain cues

Cues are short, timely, and actionable.

Examples:

“Settle the rhythm. Don’t chase the rate.”

“Stay long through the finish.”

“Good reset. Hold this pattern.”

“Two intervals left. Protect the stroke.”

8.2 Deep dives

A small number of pivotal moments receive richer explanation:

“At 12:40, rate climbed from 25 to 28 while watts stayed nearly flat. Recovery timing shortened and became less consistent. You were working harder to move faster without getting a proportional return.”

The explanation should remain readable and coach-like. Supporting citations can expand below it.

8.3 Drills

Drills convert insight into behavior.

Example:

Finding

Late-interval rate increases were not matched by proportional power.

Drill

Five rounds of one minute at controlled recovery followed by thirty seconds at normal rhythm.

Success criterion

Hold watts within five percent while reducing rate by two strokes per minute.

## 9. What Makes This Different

Wake is not:

- a pose-estimation demo;
- a static workout summary;
- a generic chatbot attached to fitness data;
- a single technique score;
- a telemetry dashboard with AI copy.

Its differentiation is the coherent reconstruction of a changing performance session and the projection of that understanding into natural coaching.

## 10. Product Boundaries

The initial product is not intended to:

- provide medical diagnosis;
- make clinical injury-risk claims;
- replace a qualified coach;
- guarantee causal explanations;
- require real-time processing;
- support every machine or sport;
- deliver perfect biomechanics from every camera view.

These boundaries should not dominate the demo. They are production guardrails, not the product story.

## 11. Future Direction

The same product model can expand into:

- live coxswain mode;
- voice and gesture interaction;
- memory across sessions;
- comparison with personal bests;
- ghost rowing against a friend or reference performance;
- remote coach review;
- additional sports where technique and performance evolve over time.
## 12. Golden Path

When product or implementation decisions conflict, preserve this sequence:

Session inputs

→ synchronized understanding

→ meaningful events

→ natural coaching

→ inspectable explanation

→ personalized practice

Anything that does not strengthen this path is secondary.

## 13. Product North Star

Wake succeeds when an athlete understands their session more clearly than they could from the video or Concept2 metrics alone—and knows exactly what to do next.

## 14. Progressive Coaching Depth

Wake should provide useful coaching from the recording an athlete already has, then guide the athlete toward better capture when deeper technique analysis would be valuable.

A front-facing recording is well suited to:

- stroke timing and cadence;
- rhythm consistency;
- broad frontal movement and symmetry;
- visible exertion and head or shoulder behavior;
- pauses, gestures, water breaks, and other session events;
- telemetry-linked changes across a full workout.

A side-facing recording can additionally support:

- seat and handle timing;
- drive and recovery sequence;
- slide velocity and recovery control;
- broad torso timing;
- catch and finish consistency;
- more specific rowing drills.

These are not separate products. They are different levels of coaching depth within the same experience.

The product should not require an ideal recording before providing value. When useful, it should turn capture guidance into part of the coaching journey:

“For a deeper technique review next time, record this interval from the side.”

This creates a natural progression from ordinary consumer capture to more precise sport-specific feedback without making camera setup the center of the product story.
