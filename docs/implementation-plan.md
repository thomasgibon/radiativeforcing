# Implementation plan

This is the canonical plan for the project. It records the scientific story,
delivery phases, technical architecture, and completion criteria. Short-term
tasks may live elsewhere, but changes to the product direction belong here.

## Product purpose

Build a concise, transparent, interactive explanation that lets a reader
reconstruct the IPCC AR6 greenhouse-gas metrics from first principles:

1. an emitted gas persists in the atmosphere;
2. the remaining atmospheric burden changes Earth's radiative balance;
3. that radiative forcing continues through time;
4. integrating the forcing gives absolute global warming potential (AGWP);
5. comparing AGWP with the equal-mass CO2 response gives GWP; and
6. applying a climate-response function connects forcing to global mean
   surface temperature change; and
7. an emissions history is the sum of many shifted pulse responses: a
   convolution.

The AR6 assessment is both the source of scientific conventions and the
acceptance target. The product should derive its reported values rather than
present them as an unexplained lookup table.

The primary experience is a guided interactive article inspired by Bartosz
Ciechanowski's one-concept-at-a-time explanations. A notebook provides the
parallel, fully inspectable derivation. A free-form laboratory becomes
available only after the guided story establishes the concepts.

### Persistent causal-chain map

[AR6 WGI Technical Summary Figure TS.4](https://www.ipcc.ch/report/ar6/wg1/figures/technical-summary/figure-ts-4/)
is the principal narrative reference for the whole article. Its assessed
cause-and-effect chain is adapted—not copied—as a small persistent map:

```text
human activity -> emissions -> concentration -> forcing -> climate response -> impacts
```

The map begins muted. Each narrative scene activates one link and leaves the
links already understood visible. It provides orientation without presenting
all processes at once. The one-tonne pulse is the microscope used to understand
the emissions-to-concentration-to-forcing portion before profiles,
convolution, feedbacks, or multiple gases are introduced.

The map must also show where an emissions metric stops. GWP maps a pulse to
integrated forcing; GTP maps it further to temperature at a specified time;
neither directly represents the complete set of regional impacts.

## Scientific framing

### Opening question

> If we release one tonne of CO2 today, how much additional influence does it
> exert on Earth's energy balance, and for how long?

The reader presses **Release 1 t CO2**. Time begins at the instant of the
emission. The first interaction connects three quantities without initially
requiring an equation:

- the one-time emission;
- the fraction of that pulse remaining in the atmosphere; and
- the radiative forcing produced by the remaining atmospheric burden.

Immediately after the one-tonne release, introduce concentration as the share
of dry-air molecules that are CO2. Keep observed context and metric convention
visibly separate:

- **Observed context:** date-stamp NOAA's global mean (428.73 ppm for May
  2026, preliminary) and compare it with approximately 280 ppm before
  industrialization.
- **Pulse-scale conversion:** the AR6 mass conversion gives approximately
  7.80 billion tonnes CO2 per ppm, so one idealized globally mixed tonne adds
  only `1.28e-10 ppm`. Display the background and increment separately rather
  than writing a falsely precise combined concentration.
- **Metric convention:** retain 409.9 ppm as the explicitly labelled AR6
  reference background used to reproduce its radiative-efficiency calculation.
  Do not silently replace it with the current observed concentration.

One tonne is used because it is tangible. Calculations must state whether
values are per kilogram or per tonne; GWP is unchanged by that choice when the
same mass basis is used for the gas and CO2. The global forcing caused by a
single tonne is extremely small, so visual scaling must always be disclosed.

### Energy-budget orientation

The initial prose should use physically precise language along these lines:

> CO2 is a greenhouse gas: it absorbs and re-emits infrared radiation,
> reducing the rate at which energy escapes to space. Additional CO2 therefore
> causes a positive radiative forcing. Until the climate warms enough to
> increase its energy loss, incoming energy exceeds outgoing energy and the
> Earth system gains energy.

AR6 assesses that, for the observed global energy increase during 1971–2018,
approximately 91% warmed the ocean, 5% heated land, 3% melted ice, and 1%
warmed the atmosphere. These are shares of the observed Earth-system energy
inventory over a stated historical period, not a tracing of the fate of energy
from the illustrative one-tonne pulse.

After this orientation, the article focuses on **atmospheric burden and
top-of-atmosphere radiative forcing**, not atmospheric heat storage. The small
atmospheric share is therefore not in conflict with the central role of
atmospheric greenhouse gases.

### Quantities that must remain distinct

- **Emission**: mass introduced at a particular time.
- **Atmospheric burden/impulse response**: emitted mass remaining through time.
- **Radiative efficiency**: forcing per change in atmospheric abundance.
- **Radiative forcing**: a rate of perturbation to Earth's energy budget,
  expressed in W m-2 (or W m-2 kg-1 for a mass-normalized pulse response).
- **Earth energy imbalance and heat uptake**: the net energy actually gained
  after the climate's radiative response is included.
- **AGWP**: radiative forcing integrated to a chosen time horizon, with units
  of forcing multiplied by time per unit emission.
- **GWP**: the dimensionless ratio of a gas's AGWP to CO2's AGWP for equal-mass
  pulse emissions and the same time horizon.

In particular, the shaded area used to derive AGWP is not a direct simulation
of accumulated ocean or atmospheric heat. Surface warming increases outgoing
radiation and partly restores the energy balance; that climate response is not
represented by simply integrating forcing. The article must not call GWP a
temperature multiplier.

Global mean surface temperature is one central climate outcome, but not the
only outcome that matters: regional extremes, precipitation, sea level, ocean
heat, and other impacts can differ even at the same global mean temperature.
The article should nevertheless complete the causal chain from emissions to
temperature so that the physical meaning and limitations of GWP remain clear.

### Rates, stocks, and the bounded car analogy

The car analogy is useful for one specific distinction:

| Driving quantity | CO2 quantity | Meaning |
| --- | --- | --- |
| acceleration or braking | change in annual emissions | whether the emissions rate is rising or falling |
| speed | annual emissions | how much CO2 is added per unit time |
| odometer or distance travelled | cumulative net emissions | total net CO2 emitted along the pathway |
| reverse gear | net negative emissions | durable removal exceeds remaining emissions |

Its central lesson is: **braking is not reversing**. A declining but still
positive annual emissions rate continues to increase cumulative emissions.
Holding annual emissions constant means that accumulation continues at a
constant rate. Reaching net zero CO2 stops adding to cumulative net CO2;
becoming net negative can reduce it.

For CO2 over policy-relevant warming ranges, global mean warming is
approximately proportional to cumulative CO2 emissions through the transient
climate response to cumulative emissions (TCRE). The temperature display may
therefore sit beside the odometer as a second, approximately aligned scale. It
must be labelled as a scientifically assessed relationship, not presented as a
mathematical identity or an additional time integral.

The analogy must stop there. Radiative forcing is **not** the car's speed, and
temperature is **not** simply the time integral of forcing:

- atmospheric burden depends on emissions plus uptake by oceans and land;
- CO2 forcing depends approximately logarithmically on concentration;
- temperature depends on the forcing history, ocean heat uptake, climate
  feedbacks, and response timescales; and
- short-lived gases do not follow the same cumulative-emissions relationship
  as CO2.

The scientifically explicit cause-and-effect chain remains:

```text
emission rate
  -> cumulative net emissions
  -> atmospheric burden/concentration (with sinks and chemistry)
  -> effective radiative forcing
  -> Earth energy imbalance (forcing minus radiative response)
  -> climate response, including global mean temperature
  -> regional changes and impacts
```

Stopping growth in emissions is not the same as reducing emissions; reducing
emissions is not the same as net zero; and net zero is not net negative. For
CO2, net zero is approximately the condition for stabilizing CO2-induced
warming. It is not correct to say that radiative forcing necessarily continues
to accumulate after CO2 emissions reach net zero.

Carbon capture and storage applied to fossil emissions primarily avoids an
emission. Reversing cumulative emissions requires **carbon dioxide removal
(CDR)** with durable storage, net of lifecycle emissions. A project described
as CCUS is not automatically a negative emission.

## Narrative page

The page scrolls through a sequence of linked scenes. Each scene introduces at
most one important new idea, retains useful visual encodings from the previous
scene, and provides one primary interaction.

Color carries the same meaning across scenes: orange marks the emission event,
blue-grey the atmospheric burden/concentration, coral radiative forcing, and
teal climate/temperature response. Component decompositions may use related
shades, but must recombine into their parent quantity's established color.
Labels, line styles, and accessible descriptions must repeat the distinction so
color is never the only encoding.

### 1. Release one tonne

- **Action:** press `Release 1 t CO2` and scrub time.
- **Visual:** a pulse at year zero; do not yet introduce scaling, another gas,
  or an emissions history.
- **Lesson:** a pulse is an emission idealized as occurring at one instant.

### 2.1. From one tonne to concentration

- **Action:** convert only the released tonne to ppm.
- **Visual:** keep the observed background (`428.73 ppm`, May 2026) separate
  from the calculated one-tonne increment (`+1.28e-10 ppm`); do not yet offer
  kt, Mt, or Gt controls.
- **Lesson:** ppm is a mole fraction, the atmosphere already contains CO2, and
  global mixing is an idealization rather than an immediate physical event.
- **Convention disclosure:** show the AR6 `409.9 ppm` calculation background in
  a compact note beside radiative efficiency, where its role matters.

### 2.2. Why the concentration increment persists

- **Action:** scrub time, then separate and recombine the fitted response terms.
- **Visual:** retain the one-tonne atmospheric counter and response curve.
- **Lesson:** the emission is instantaneous; its atmospheric influence is not.
- **Fitted-term animation:** show the persistent term and three exponential
  terms independently, then let colored copies fall into a fifth panel. Stack
  their exact contributions at every year so the upper boundary draws the
  total AR6 response.
- **Timescale intuition:** label each term above its chart. For finite terms,
  draw the origin tangent (which reaches zero at `t = tau`) and mark the actual
  exponential at `t = tau` (where `e^-1`, about 37%, remains).
- **Interpretive guardrail:** the fitted terms are mathematical modes of the
  coupled carbon cycle, not individually identifiable land, forest, soil,
  ocean, or geological reservoirs. Individual upper panels may normalize their
  vertical scales for legibility; the combined panel must use the common true
  scale and state this distinction.
- **Source disclosure:** reproduce the relevant carbon-cycle rows of Millar et
  al. (2017), Table 1, in an accessible expandable table and explain that its
  AR5-IR parameters were fitted to the Joos et al. (2013) ensemble.
- **Reservoir language:** early losses from the atmospheric pulse are mainly
  transfers into land and ocean reservoirs and are not necessarily permanent.
  A later disclosure may show reversible arrows between reservoirs.
- **Long-timescale boundary:** explain that ocean–sediment chemistry and rock
  weathering continue to draw down the remainder over tens to hundreds of
  thousands of years and longer, but are not represented by the 500-year
  response shown here.

### 3.1. From remaining gas to forcing

- **Action:** move a radiative-efficiency control for a hypothetical gas.
- **Visual:** atmospheric burden and instantaneous forcing in aligned plots.
- **Lesson:** persistence says how much remains; radiative efficiency says how
  strongly that amount perturbs the energy balance.
- **Equation reveal:** `RF_i(t) = RE_i * IRF_i(t)`, with conversions and units
  available on demand.

### 3.2. What forcing changes

- **Visual:** keep the same pulse and introduce the top-of-atmosphere energy
  imbalance without adding another calculation.
- **Lesson:** forcing changes the rate of Earth's energy flow; it is not stored
  heat and is not temperature.

### 4.1. Build one temperature value from the forcing history

- **Action:** first show the familiar forcing curve and the climate's response
  to a brief unit of forcing as separate, labelled 2D curves. The latter is a
  new concept at this point and must be explained before either curve is moved
  into 3D. Then build their product surface and drag the observation-time
  plane.
- **Visual:** forcing time is `x`, response lag is `y`, and the product is the
  temperature-contribution density on `z`. The plane `x + y = t` selects a
  diagonal through the surface; the diagonal sum gives temperature at `t`.
  A top view provides the equivalent heat map and must remain available as the
  clearer 2D reading. The 3D projection may be rotated without changing the
  selected year.
- **Output link:** each position of the plane must place the diagonal total at
  the corresponding year in a separate temperature panel. Sweeping the plane
  progressively draws the full temperature-response curve; the value readout
  alone is insufficient to teach the operation.
- **Narrative pacing:** do not name the operation initially. Reveal the term
  `convolution` only after the reader has moved the plane and seen one value
  assembled.
- **Lesson:** each forcing instant has had a different amount of time to act by
  the observation year. Temperature is therefore not simply the area under the
  forcing curve.
- **Prototype status:** a dependency-free SVG spike now exports the AR6 thermal
  impulse kernel, introduces both input curves in 2D, constructs a rotatable
  product surface, links a draggable/scrubbable `x + y = t` slice to the shared
  year, and draws the verified AR6 pulse-temperature output. The geometry and
  pedagogy require user testing before polish.

### 4.2. Forcing is not temperature

- **Action:** separate and combine the fast and slow AR6 thermal contributions
  at the same selected year.
- **Visual:** linked forcing, Earth energy imbalance, and global mean surface
  temperature plots.
- **Thermal decomposition:** expose the two fitted AR6 thermal modes separately
  and combine their exact contributions into AGTP.
- **Lesson:** forcing initiates a response, while heat uptake and feedbacks
  determine how temperature evolves. The two fitted modes explain the shape of
  the climate impulse response used in 4.1.

### 5. Scale beyond one tonne

- **Action:** step through `1 t`, `1 kt`, `1 Mt`, and `1 Gt`, then introduce a
  dated historical emissions and concentration view.
- **Visual:** reuse the mass-to-ppm conversion and align gross emissions with
  sink-modified atmospheric growth.
- **Lesson:** the one-tonne chain scales, but emissions and atmospheric growth
  are not identical because land and ocean uptake operate simultaneously.

#### 5.1. Braking is not reversing

- **Action:** accelerate, brake, stop, and briefly reverse a stylized CO2
  emissions pathway.
- **Visual:** pair annual emissions with an odometer-like cumulative-emissions
  display and conventional time-series plots.
- **Lesson:** lowering a positive emissions rate still adds CO2 cumulatively;
  net zero stops adding; net negative reduces the cumulative total.
- **Analogy boundary:** use the car only for the rate/stock relationship, then
  explicitly put it away.
- **Carbon removal:** introduce deliberate CDR here as the physical meaning of
  reverse gear. Distinguish it from avoided emissions and disclose that land
  and ocean outgassing means an atmospheric removal pulse is not generally the
  exact mirror image of an emission pulse.

### 6. Introduce another greenhouse gas

- **Action:** keep pulse mass fixed and replace CO2 with one contrasting gas.
- **Visual:** reuse the now-familiar concentration, persistence, and forcing
  views before introducing any metric ratio.
- **Lesson:** gases follow the same causal chain with different lifetimes,
  chemistry, and radiative efficiencies.

### 7. Accumulate forcing through time

- **Action:** drag the time horizon `H`.
- **Visual:** shade the forcing curve from zero to `H`; update the integral
  continuously.
- **Lesson:** a declining instantaneous effect can still create a growing
  cumulative metric.
- **Equation reveal:** `AGWP_i(H) = integral_0^H RF_i(t) dt`.

The existing Desmos GWP construction is the interaction reference for this
scene. Its horizon slider, shaded areas, response functions, and live ratios
should be retained while its simultaneous concepts are separated into steps.

This scene must answer why an operational metric integrates forcing even
though temperature and impacts are further down the causal chain. The later
AR6 reconstruction should also distinguish GWP from temperature-based AGTP/GTP.

### 8. Why the horizon matters

- **Action:** move between 20, 100, and 500 years, then scrub continuously.
- **Visual:** compare a short-lived illustrative gas with persistent CO2.
- **Lesson:** the metric answers a horizon-dependent policy question; it is not
  an intrinsic, horizon-free property of a molecule.

### 9. Compare with CO2

- **Action:** place the two shaded areas into a live ratio.
- **Visual:** equal-mass pulse responses for the selected gas and CO2.
- **Lesson:** GWP is a normalization of cumulative forcing.
- **Equation reveal:** `GWP_i(H) = AGWP_i(H) / AGWP_CO2(H)`.

### 10. Reconstruct AR6

- **Action:** progressively enable assessed components and conventions.
- **Visual:** a transparent stack from the elementary response to the complete
  assessed value, alongside the published rounded value.
- **Lesson:** indirect effects, adjustments, feedback conventions, and
  uncertainty are scientific components, not hidden correction factors.
- **Requirement:** every displayed parameter and component links to provenance.
- **Metric distinction:** show that AR6 can map a pulse to integrated forcing
  (AGWP/GWP) or to temperature at a chosen time (AGTP/GTP); these answer
  different questions.

### 11. Explore other gases

- **Action:** choose an AR6 gas and horizon in a laboratory view.
- **Visual:** reuse the now-familiar burden, forcing, area, and ratio views.
- **Lesson:** the same construction explains the catalogue; the catalogue does
  not precede the construction.

### 12. From a pulse to an emissions history

- **Action:** add, move, or resize emissions in several years.
- **Visual:** show each emission cohort as a shifted copy of the pulse response,
  then stack or sum the cohorts at the selected observation year.
- **Lesson:** today's forcing contains surviving contributions from many past
  emissions.

### 13. See the convolution

- **Action:** drag the observation-time plane through the cohort surface.
- **Visual progression:** aligned curves, then a two-dimensional cohort heat
  map, then the optional three-dimensional surface with emission time on `x`,
  elapsed time on `y`, and forcing contribution on `z`.
- **Lesson:** the diagonal `emission time + elapsed time = observation time`
  selects the contributions that are summed to obtain forcing at that time.
- **Accessibility:** the 3D view supplements rather than replaces the 2D view
  and a numerical/table representation.

## Delivery phases

### Phase 1 — Repository recovery and reproducibility (complete)

Purpose: preserve the historical work, make its status explicit, and establish
a reproducible baseline without silently changing the science.

Delivered:

- historical code and AR5-era data separated and documented;
- two supported notebooks with portable paths;
- locked Python environment and notebook execution workflow;
- maintenance, reference, and model-status documentation; and
- known scientific and unit limitations recorded for later resolution.

The locally executed notebook outputs currently visible in the worktree are
not part of Phase 2 and must not be overwritten or discarded incidentally.

### Phase 2 — AR6 scientific foundation and executable derivation

Purpose: establish one tested, traceable scientific implementation before the
polished web experience is built.

Status: **in progress**. The pinned AR6 table, CO2 atmospheric response,
effective forcing, AGWP, two-timescale temperature response, AGTP, generated
browser data, and published-value regressions are complete. Non-CO2 gases,
their indirect effects, and the remaining metric derivations remain in this
phase. The compact `03_ar6_co2_causal_chain.ipynb` now provides the executable
CO2 vertical slice from pulse through burden, forcing, temperature, and AGWP.

Deliverables:

- acquire and preserve the AR6 Chapter 7 metrics supplement, including
  `metrics_supplement_cleaned.csv`, with a pinned source revision, checksum,
  license/provenance note, and unmodified raw copy;
- document the relevant AR6 metric definitions, impulse-response functions,
  radiative efficiencies, climate-response functions, indirect effects,
  feedback conventions, horizons, and units;
- implement a small Python calculation package for burden, forcing, numerical
  integration, AGWP, GWP, temperature response, AGTP/GTP, and later discrete
  convolution;
- represent each calculation as inspectable components rather than a single
  opaque factor;
- rewrite the first notebook as the executable version of narrative scenes
  1–8;
- add scientific invariants and regression tests; and
- reproduce selected published AR6 GWP and GTP values at assessed horizons
  within explicitly documented rounding/tolerance rules.

Exit criterion: a reviewer can trace each selected AR6 result from source data
through units and equations to the published value, and no unexplained
correction remains in the supported path.

The dependency-free page in `app/` began as a **design spike** for the opening
interaction. Its CO2 burden and linked instantaneous-forcing scenes now consume
browser data generated from the verified AR6 implementation. This early Phase
3 vertical slice does not by itself make Phase 2 complete.

### Phase 3 — Guided radiative-forcing and GWP article

Purpose: turn the verified derivation into the one-concept-at-a-time web story.

Deliverables:

- implement narrative scenes 1–9, including the bounded rate/stock analogy and
  the forcing-to-temperature distinction;
- provide direct manipulation, scroll-linked continuity, live equations, and
  optional calculation/provenance disclosures;
- add the unlocked gas-and-horizon laboratory;
- support keyboard input, screen-reader summaries, reduced motion, responsive
  layouts, and non-colour-only encodings; and
- deploy a versioned static preview.

Exit criterion: a first-time reader can explain how persistence, radiative
efficiency, integration horizon, and normalization to CO2 produce GWP without
starting from a factor table.

### Phase 4 — Custom profiles and visual convolution

Purpose: extend the pulse model to time-varying emissions while making the
convolution visually understandable.

Deliverables:

- define and validate an emission-profile schema with explicit mass/time units;
- support drawing, editing, importing, and selecting example profiles,
  including explicitly labelled net-negative segments;
- implement discrete convolution against the verified response kernels;
- build the cohort curves and heat-map explanation before introducing 3D;
- implement the observation-time diagonal slice and linked total-forcing plot;
- add conservation, superposition, time-shift, limiting-case, and Python/browser
  parity tests; and
- rewrite the second notebook to use the supported model.

The first release may treat small negative perturbations with the same linear
kernel only where that approximation is scientifically justified and clearly
labelled. Detailed carbon-cycle rebound after large-scale CDR is a later model
extension, not something to conceal inside the initial convolution.

Exit criterion: the total forcing curve is numerically verified, and a reader
can identify it as the sum of the contributions selected by the diagonal slice.

### Phase 5 — Publication, review, and maintenance

Purpose: make the article durable and responsibly publishable.

Deliverables:

- independent scientific review and resolved review log;
- usability testing with readers who do not already know GWP;
- performance and cross-browser testing;
- stable hosting, automated deployment, metadata, citation, and versioning;
- downloadable data/calculation provenance; and
- a documented process for adding later assessment versions without replacing
  AR6 in place.

Exit criterion: the deployed article is reproducible from a clean checkout,
scientifically reviewed, accessible, and explicitly versioned to its assessment
data.

## Technical specification

### Repository shape

The intended structure is:

```text
data/
  ar5/                 historical inputs
  ar6/raw/             immutable downloaded source files
  ar6/processed/       generated normalized tables
src/radiativeforcing/  tested Python scientific model
notebooks/             executable narrative and validation
app/                   narrative web application
tests/                 scientific and data regression tests
docs/                  plan, sources, decisions, and model status
```

Generated data must be reproducible from raw data by a checked-in script. Raw
assessment files are never edited in place.

### Scientific source of truth

The Python package is the reference implementation. It will generate:

- normalized parameter data with source metadata;
- response kernels and component time series used by the article;
- regression fixtures at selected gases, times, and horizons; and
- published-value comparison reports.

The browser should not contain an independent, opaque reimplementation of the
AR6 model. It may interpolate shipped response kernels and perform simple,
inspectable integration and convolution for interaction. Browser results must
be checked against Python-generated fixtures. Conceptual hypothetical-gas
controls are explicitly labelled as a simplified model.

### Web application

Provisional stack, to be confirmed by a small Phase 3 prototype:

- SvelteKit and TypeScript for narrative structure and shared interaction state;
- static generation so the article can be hosted without a calculation server;
- SVG for axes, labels, annotations, and modest-size interactive charts;
- Canvas for dense cohort animations and heat maps;
- D3 modules only where useful for scales, shapes, and axes; and
- Three.js only for the optional three-dimensional convolution scene.

The visual language should be custom and restrained. A plotting-library
dashboard is not the target, and 3D is used only after the equivalent 2D
construction is understood.

### State continuity

A single selected pulse, gas, time, and horizon should persist as the reader
moves between scenes. New scenes transform the existing visual rather than
replace it with an unrelated chart. URL state is desirable for shareable lab
configurations but must not complicate the guided default path.

### Units and numerical behavior

- Every model input and output has an explicit unit in code and documentation.
- UI labels distinguish absolute values, per-mass responses, fractions, and
  ratios.
- Integration rules, grid spacing, endpoints, and interpolation are specified
  and tested.
- Display rounding is separate from calculation precision.
- Uncertainty and assessment conventions are carried through when supported;
  unsupported uncertainty propagation is stated rather than implied.

### Verification

- `pytest`: equations, units, limiting cases, integration, convolution, source
  parsing, climate response, and AR6 GWP/GTP regressions.
- notebook execution: executable narrative remains synchronized with the
  package.
- browser unit tests: presentation calculations and state transitions.
- browser/Python parity fixtures: selected curves, integrals, and profiles.
- end-to-end tests: the principal learning path and keyboard interactions.
- lightweight visual regression tests: only for stable, explanatory scenes.

### Accessibility and performance

- All interactions work by keyboard and pointer.
- Every chart has a textual summary and accessible data alternative.
- Motion respects `prefers-reduced-motion` and never carries essential meaning
  on its own.
- Colours have sufficient contrast and are reinforced by line/area styles.
- The opening interaction should become usable quickly on a typical phone;
  heavy 3D code is loaded only when its scene is approached.

## Sources currently selected

- [IPCC AR6 WGI Chapter 7](https://www.ipcc.ch/report/ar6/wg1/chapter/chapter-7/)
  and its supplementary material define the principal scientific conventions.
- The IPCC-WG1 Chapter 7 repository's
  [`metrics_supplement_cleaned.csv`](https://github.com/IPCC-WG1/Chapter-7/blob/main/data_output/7sm/metrics_supplement_cleaned.csv)
  is the candidate machine-readable metrics source; Phase 2 will pin and audit
  the exact revision.
- IPCC AR6 WGI Table 7.1 and
  [FAQ 7.1](https://www.ipcc.ch/report/ar6/wg1/figures/chapter-7/faq-7-1-figure-1/)
  support the 1971–2018 Earth-system energy shares used in the opening
  orientation.
- [AR6 Technical Summary Figure TS.4](https://www.ipcc.ch/report/ar6/wg1/figures/technical-summary/figure-ts-4/)
  provides the assessed emissions-to-concentration-to-forcing-to-climate
  cause-and-effect chain.
- The [AR6 WGI Technical Summary](https://www.ipcc.ch/report/ar6/wg1/chapter/technical-summary/)
  supports the near-linear relationship between cumulative CO2 emissions and
  CO2-caused global surface warming, and the need for net-zero CO2 to stabilize
  that contribution.
- The existing [Desmos GWP graph](https://www.desmos.com/calculator/5226b9e2a0)
  is the interaction and mathematical reference for horizon-dependent shaded
  forcing and GWP ratios.
- The existing AR5 notebook remains a historical comparison, not the current
  assessment source.

## Product decisions

Decided:

- guided interactive article first, laboratory second;
- begin with a one-tonne CO2 pulse;
- introduce the energy budget briefly, then focus on atmospheric burden and
  top-of-atmosphere forcing;
- use the car analogy only for change in emissions rate, annual emissions,
  cumulative emissions, and net-negative reversal;
- connect cumulative CO2 emissions approximately to CO2-induced warming through
  TCRE while keeping forcing and temperature outside the derivative analogy;
- distinguish avoided emissions from genuine carbon dioxide removal;
- derive metrics before showing a gas catalogue;
- expose the difference between simplified intuition and full AR6 conventions;
- teach convolution in 2D before offering the 3D surface; and
- maintain the Python notebook as an inspectable counterpart to the article.

Still to validate:

- the exact visual metaphor for the opening energy imbalance;
- whether the initial forcing display uses a per-tonne axis, normalized scale,
  or an intentionally magnified physical value;
- the best wording and interaction for distinguishing integrated forcing from
  actual Earth-system heat uptake;
- the final web framework after the narrative prototype; and
- which gases best reveal each concept without overwhelming the first path.
