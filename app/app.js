const SVG = {
  left: 64,
  right: 694,
  top: 32,
  bottom: 312,
  maxYear: 500,
};

const PARTICLE_COUNT = 84;
const YEARS_PER_SECOND = 24;

const elements = {
  card: document.querySelector(".experiment-card"),
  emitButton: document.querySelector("#emit-button"),
  emitLabel: document.querySelector("#emit-label"),
  resetButton: document.querySelector("#reset-button"),
  modelStatus: document.querySelector("#model-status"),
  modelNote: document.querySelector("#model-note"),
  yearValue: document.querySelector("#year-value"),
  massValue: document.querySelector("#mass-value"),
  percentValue: document.querySelector("#percent-value"),
  particles: document.querySelector("#particle-field"),
  responseLine: document.querySelector("#response-line"),
  timeLine: document.querySelector("#time-line"),
  timePoint: document.querySelector("#time-point"),
  timeSlider: document.querySelector("#time-slider"),
  playButton: document.querySelector("#play-button"),
  chartDescription: document.querySelector("#chart-description"),
  insightCopy: document.querySelector("#insight-copy"),
  forcingYearValue: document.querySelector("#forcing-year-value"),
  forcingMassValue: document.querySelector("#forcing-mass-value"),
  forcingCoefficientValue: document.querySelector("#forcing-coefficient-value"),
  forcingValue: document.querySelector("#forcing-value"),
  forcingLine: document.querySelector("#forcing-line"),
  forcingTimeLine: document.querySelector("#forcing-time-line"),
  forcingTimePoint: document.querySelector("#forcing-time-point"),
  forcingTimeSlider: document.querySelector("#forcing-time-slider"),
  forcingChartDescription: document.querySelector("#forcing-chart-description"),
  forcingAxisTop: document.querySelector("#forcing-axis-top"),
  forcingAxisMiddle: document.querySelector("#forcing-axis-middle"),
};

const state = {
  model: null,
  emitted: false,
  playing: false,
  year: 0,
  lastFrame: null,
  animationFrame: null,
};

function interpolateSeries(name, year) {
  const values = state.model.series[name];
  const lowerYear = Math.max(0, Math.min(Math.floor(year), values.length - 1));
  const upperYear = Math.min(lowerYear + 1, values.length - 1);
  const offset = year - lowerYear;
  return values[lowerYear] * (1 - offset) + values[upperYear] * offset;
}

function remainingFraction(year) {
  return interpolateSeries("airborne_fraction", year);
}

function forcingAt(year) {
  return interpolateSeries("forcing_w_m2_per_tonne", year);
}

function xScale(year) {
  return SVG.left + (year / SVG.maxYear) * (SVG.right - SVG.left);
}

function yScale(fraction) {
  return SVG.bottom - fraction * (SVG.bottom - SVG.top);
}

function buildPath() {
  const points = [];
  for (let year = 0; year <= SVG.maxYear; year += 2) {
    points.push([xScale(year), yScale(remainingFraction(year))]);
  }

  const line = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
  elements.responseLine.setAttribute("d", line);
}

function forcingYScale(value) {
  return SVG.bottom - (value / state.model.series.forcing_w_m2_per_tonne[0]) * (SVG.bottom - SVG.top);
}

function buildForcingPath() {
  const points = [];
  for (let year = 0; year <= SVG.maxYear; year += 2) {
    points.push([xScale(year), forcingYScale(forcingAt(year))]);
  }
  elements.forcingLine.setAttribute("d", points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" "));
}

function scientific(value, significantDigits = 3) {
  const superscript = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const [mantissa, exponent] = value.toExponential(significantDigits - 1).split("e");
  return `${mantissa} × 10${[...String(Number(exponent))].map((character) => superscript[character]).join("")}`;
}

function updateForcingView() {
  if (!state.model) return;
  const roundedYear = Math.round(state.year);
  const remainingKg = state.model.emission_mass_kg * remainingFraction(state.year);
  const forcing = forcingAt(state.year);
  const x = xScale(state.year);
  const y = forcingYScale(forcing);
  elements.forcingYearValue.textContent = roundedYear.toLocaleString();
  elements.forcingMassValue.textContent = Math.round(remainingKg).toLocaleString();
  elements.forcingCoefficientValue.textContent = scientific(state.model.initial_forcing_w_m2_per_kg);
  elements.forcingValue.textContent = scientific(forcing);
  elements.forcingTimeSlider.value = String(roundedYear);
  elements.forcingTimeLine.setAttribute("x1", x.toFixed(2));
  elements.forcingTimeLine.setAttribute("x2", x.toFixed(2));
  elements.forcingTimePoint.setAttribute("cx", x.toFixed(2));
  elements.forcingTimePoint.setAttribute("cy", y.toFixed(2));
  elements.forcingChartDescription.textContent = `At year ${roundedYear}, the one-tonne pulse produces ${scientific(forcing)} watts per square metre of global-average effective radiative forcing.`;
}

function seededPosition(index) {
  const angle = index * 2.3999632297;
  const radius = 23 + ((index * 47) % 100) / 100 * 24;
  const wobble = ((index * 29) % 17) - 8;
  return {
    left: 50 + Math.cos(angle) * radius,
    top: 48 + Math.sin(angle) * radius * 0.72 + wobble * 0.32,
  };
}

function buildParticles() {
  const fragment = document.createDocumentFragment();
  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const particle = document.createElement("i");
    const position = seededPosition(index);
    particle.className = "particle";
    particle.style.left = `${position.left}%`;
    particle.style.top = `${position.top}%`;
    particle.dataset.threshold = String((index + 0.5) / PARTICLE_COUNT);
    fragment.appendChild(particle);
  }
  elements.particles.appendChild(fragment);
}

function insightFor(year, fraction) {
  if (year === 0) {
    return "The release is over. Its atmospheric story has just begun.";
  }
  if (year < 20) {
    return `After ${year} ${year === 1 ? "year" : "years"}, faster exchanges have removed part of the pulse—but ${Math.round(fraction * 100)}% remains.`;
  }
  if (year < 100) {
    return "Different carbon-cycle processes act on different timescales, so the curve does not follow one simple lifetime.";
  }
  if (year < 300) {
    return `A century after the emission, a substantial share is still affecting atmospheric CO2.`;
  }
  return "Even after several centuries, the model retains a long-lived remainder. CO2 does not have one expiration date.";
}

function updateView() {
  updateForcingView();
  if (!state.emitted) return;

  const roundedYear = Math.round(state.year);
  const fraction = remainingFraction(state.year);
  const remainingKg = Math.round(state.model.emission_mass_kg * fraction);
  const x = xScale(state.year);
  const y = yScale(fraction);

  elements.yearValue.textContent = roundedYear.toLocaleString();
  elements.massValue.textContent = remainingKg.toLocaleString();
  elements.percentValue.textContent = `${Math.round(fraction * 100)}%`;
  elements.timeSlider.value = String(roundedYear);
  elements.timeLine.setAttribute("x1", x.toFixed(2));
  elements.timeLine.setAttribute("x2", x.toFixed(2));
  elements.timePoint.setAttribute("cx", x.toFixed(2));
  elements.timePoint.setAttribute("cy", y.toFixed(2));
  elements.insightCopy.textContent = insightFor(roundedYear, fraction);
  elements.chartDescription.textContent = `At year ${roundedYear}, approximately ${remainingKg} kilograms, or ${Math.round(fraction * 100)} percent, of the original one-tonne pulse remains in the atmosphere in this introductory response model.`;

  elements.particles.querySelectorAll(".particle").forEach((particle) => {
    particle.classList.toggle("visible", Number(particle.dataset.threshold) <= fraction);
  });
}

function setPlaying(playing) {
  state.playing = playing;
  elements.card.dataset.state = playing ? "active" : "paused";
  elements.playButton.innerHTML = `<span aria-hidden="true">${playing ? "Ⅱ" : "▶"}</span>`;
  elements.playButton.setAttribute("aria-label", playing ? "Pause time" : "Play time");
  state.lastFrame = null;

  if (playing && state.animationFrame === null) {
    state.animationFrame = requestAnimationFrame(tick);
  }
}

function tick(timestamp) {
  if (!state.playing) {
    state.animationFrame = null;
    return;
  }

  if (state.lastFrame !== null) {
    const elapsedSeconds = Math.min((timestamp - state.lastFrame) / 1000, 0.1);
    state.year = Math.min(SVG.maxYear, state.year + elapsedSeconds * YEARS_PER_SECOND);
    updateView();
  }
  state.lastFrame = timestamp;

  if (state.year >= SVG.maxYear) {
    setPlaying(false);
    state.animationFrame = null;
    return;
  }

  state.animationFrame = requestAnimationFrame(tick);
}

function emit() {
  state.emitted = true;
  state.year = 0;
  elements.card.classList.remove("just-emitted");
  // Restart the brief pulse animation when the button is pressed again.
  void elements.card.offsetWidth;
  elements.card.classList.add("just-emitted");
  elements.emitLabel.textContent = "Emit 1 t CO2 again";
  elements.resetButton.hidden = false;
  elements.timeSlider.disabled = false;
  elements.playButton.disabled = false;
  elements.modelStatus.textContent = "Pulse released at year 0";
  updateView();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  setPlaying(!reduceMotion);
}

function reset() {
  setPlaying(false);
  state.emitted = false;
  state.year = 0;
  elements.card.dataset.state = "idle";
  elements.card.classList.remove("just-emitted");
  elements.emitLabel.textContent = "Emit 1 t CO2";
  elements.resetButton.hidden = true;
  elements.timeSlider.value = "0";
  elements.timeSlider.disabled = true;
  elements.playButton.disabled = true;
  elements.forcingTimeSlider.value = "0";
  elements.yearValue.textContent = "0";
  elements.massValue.textContent = "—";
  elements.percentValue.textContent = "—";
  elements.modelStatus.textContent = "Ready for one pulse";
  elements.insightCopy.textContent = "Start the experiment to see why the date of an emission is not the end of its story.";
  elements.particles.querySelectorAll(".particle").forEach((particle) => particle.classList.remove("visible"));
  updateForcingView();
}

function bindEvents() {
  elements.emitButton.addEventListener("click", emit);
  elements.resetButton.addEventListener("click", reset);
  elements.playButton.addEventListener("click", () => {
    if (state.year >= SVG.maxYear) state.year = 0;
    setPlaying(!state.playing);
  });
  elements.timeSlider.addEventListener("input", (event) => {
    setPlaying(false);
    state.year = Number(event.target.value);
    updateView();
  });
  elements.forcingTimeSlider.addEventListener("input", (event) => {
    if (state.emitted) setPlaying(false);
    state.year = Number(event.target.value);
    updateView();
  });
}

async function initialize() {
  buildParticles();
  bindEvents();

  try {
    const response = await fetch("./data/co2-pulse.json");
    if (!response.ok) throw new Error(`Model request failed with ${response.status}`);
    state.model = await response.json();
    buildPath();
    buildForcingPath();
    const initialForcing = state.model.series.forcing_w_m2_per_tonne[0];
    elements.forcingAxisTop.textContent = scientific(initialForcing, 2);
    elements.forcingAxisMiddle.textContent = scientific(initialForcing / 2, 2);
    elements.forcingTimeSlider.disabled = false;
    updateForcingView();
    elements.emitButton.disabled = false;
    elements.emitLabel.textContent = "Emit 1 t CO2";
    elements.modelStatus.textContent = "AR6 CO2 pulse model ready";
    elements.modelNote.textContent = `${state.model.assessment_status}. Parameters and output are generated from the pinned scientific implementation; forcing and temperature are revealed in the next scenes.`;
  } catch (error) {
    elements.emitLabel.textContent = "Model unavailable";
    elements.modelStatus.textContent = "Serve the app over HTTP to load its model data";
    console.error(error);
  }
}

initialize();
