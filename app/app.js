const SVG = {
  left: 64,
  right: 694,
  top: 32,
  bottom: 312,
  maxYear: 500,
};

const PARTICLE_COUNT = 84;
const YEARS_PER_SECOND = 24;
const DECOMPOSITION = {
  left: 110,
  right: 910,
  laneBaselines: [105, 255, 405, 555],
  laneAmplitude: 58,
  sumTop: 680,
  sumBottom: 930,
};

const METHOD_GRID = [0, 2, 5, 10, 20, 35, 55, 80, 110, 150, 200, 270, 350, 425, 500];
const METHOD_PROJECTIONS = {
  top: {
    origin: { x: 120, y: 560 },
    xVector: { x: 680, y: 0 },
    yVector: { x: 0, y: -460 },
    zHeight: 0,
  },
};

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
  decayCard: document.querySelector("#decay-card"),
  combineButton: document.querySelector("#combine-button"),
  combineLabel: document.querySelector("#combine-label"),
  decayChartDescription: document.querySelector("#decay-chart-description"),
  componentLines: [...document.querySelectorAll(".component-line")],
  fallingLines: [...document.querySelectorAll(".falling-line")],
  sumBands: [...document.querySelectorAll(".sum-band")],
  sumLine: document.querySelector("#sum-line"),
  tangentLines: [1, 2, 3].map((index) => document.querySelector(`#origin-tangent-${index}`)),
  efoldPoints: [1, 2, 3].map((index) => document.querySelector(`#efold-point-${index}`)),
  tauLabels: [1, 2, 3].map((index) => document.querySelector(`#tau-label-${index}`)),
  concentrationMassValue: document.querySelector("#concentration-mass-value"),
  concentrationConversionValue: document.querySelector("#concentration-conversion-value"),
  concentrationIncrementValue: document.querySelector("#concentration-increment-value"),
  concentrationScaleButtons: [...document.querySelectorAll("#concentration-scale-controls button")],
  pulseConcentrationConversionValue: document.querySelector("#pulse-concentration-conversion-value"),
  pulseConcentrationIncrementValue: document.querySelector("#pulse-concentration-increment-value"),
  ar6BackgroundValue: document.querySelector("#ar6-background-value"),
  temperatureCard: document.querySelector("#temperature-card"),
  temperatureCombineButton: document.querySelector("#temperature-combine-button"),
  temperatureCombineLabel: document.querySelector("#temperature-combine-label"),
  temperatureYearValue: document.querySelector("#temperature-year-value"),
  temperatureFastValue: document.querySelector("#temperature-fast-value"),
  temperatureSlowValue: document.querySelector("#temperature-slow-value"),
  temperatureTotalValue: document.querySelector("#temperature-total-value"),
  temperatureFastLine: document.querySelector("#temperature-fast-line"),
  temperatureSlowLine: document.querySelector("#temperature-slow-line"),
  temperatureFastBand: document.querySelector("#temperature-fast-band"),
  temperatureSlowBand: document.querySelector("#temperature-slow-band"),
  temperatureTotalLine: document.querySelector("#temperature-total-line"),
  temperatureTimeLine: document.querySelector("#temperature-time-line"),
  temperatureTimePoint: document.querySelector("#temperature-time-point"),
  temperatureTimeSlider: document.querySelector("#temperature-time-slider"),
  temperatureAxisTop: document.querySelector("#temperature-axis-top"),
  temperatureAxisMiddle: document.querySelector("#temperature-axis-middle"),
  temperatureChartDescription: document.querySelector("#temperature-chart-description"),
  methodCard: document.querySelector("#method-card"),
  methodInputForcingLine: document.querySelector("#method-input-forcing-line"),
  methodInputThermalLine: document.querySelector("#method-input-thermal-line"),
  surfaceBuildButton: document.querySelector("#surface-build-button"),
  surfaceBuildLabel: document.querySelector("#surface-build-label"),
  methodViewButton: document.querySelector("#method-view-button"),
  methodRotationSlider: document.querySelector("#method-rotation-slider"),
  methodYearValue: document.querySelector("#method-year-value"),
  methodChart: document.querySelector("#method-chart"),
  methodChartDescription: document.querySelector("#method-chart-description"),
  methodGroundGrid: document.querySelector("#method-ground-grid"),
  methodSurfaceCells: document.querySelector("#method-surface-cells"),
  methodSurfaceGrid: document.querySelector("#method-surface-grid"),
  methodForcingBoundary: document.querySelector("#method-forcing-boundary"),
  methodThermalBoundary: document.querySelector("#method-thermal-boundary"),
  methodObservationPlane: document.querySelector("#method-observation-plane"),
  methodDiagonalArea: document.querySelector("#method-diagonal-area"),
  methodDiagonalLine: document.querySelector("#method-diagonal-line"),
  methodDragSurface: document.querySelector("#method-drag-surface"),
  methodXLabel: document.querySelector("#method-x-label"),
  methodYLabel: document.querySelector("#method-y-label"),
  methodZLabel: document.querySelector("#method-z-label"),
  methodTimeSlider: document.querySelector("#method-time-slider"),
  methodPlayButton: document.querySelector("#method-play-button"),
  methodResultYear: document.querySelector("#method-result-year"),
  methodTemperatureValue: document.querySelector("#method-temperature-value"),
  methodOutputLine: document.querySelector("#method-output-line"),
  methodOutputTimeLine: document.querySelector("#method-output-time-line"),
  methodOutputPoint: document.querySelector("#method-output-point"),
  methodOutputChartDescription: document.querySelector("#method-output-chart-description"),
  methodName: document.querySelector("#method-name"),
};

const state = {
  model: null,
  emitted: false,
  playing: false,
  year: 0,
  lastFrame: null,
  animationFrame: null,
  methodSurfaceBuilt: false,
  methodView: "3d",
  methodAngle: 12,
  methodInteracted: false,
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

function interpolateValues(values, year) {
  const lowerYear = Math.max(0, Math.min(Math.floor(year), values.length - 1));
  const upperYear = Math.min(lowerYear + 1, values.length - 1);
  const offset = year - lowerYear;
  return values[lowerYear] * (1 - offset) + values[upperYear] * offset;
}

function temperatureAt(year) {
  return interpolateSeries("temperature_change_k_per_tonne", year);
}

function temperatureComponentAt(mode, year) {
  return interpolateValues(state.model.series.temperature_components_k_per_tonne[mode], year);
}

function thermalKernelAt(year) {
  return interpolateSeries("thermal_impulse_response_k_per_w_m2_year", year);
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

function temperatureYScale(value) {
  const maximum = Math.max(...state.model.series.temperature_change_k_per_tonne);
  return SVG.bottom - (value / maximum) * (SVG.bottom - SVG.top);
}

function miniTemperaturePath(values) {
  const maximum = Math.max(...values);
  const points = [];
  for (let year = 0; year <= SVG.maxYear; year += 2) {
    const x = 10 + (year / SVG.maxYear) * 300;
    const y = 98 - (values[year] / maximum) * 82;
    points.push([x, y]);
  }
  return linePath(points);
}

function buildTemperaturePaths() {
  const series = state.model.series;
  const fast = series.temperature_components_k_per_tonne.fast;
  const slow = series.temperature_components_k_per_tonne.slow;
  const total = series.temperature_change_k_per_tonne;
  const years = [];
  for (let year = 0; year <= SVG.maxYear; year += 2) years.push(year);

  elements.temperatureFastLine.setAttribute("d", miniTemperaturePath(fast));
  elements.temperatureSlowLine.setAttribute("d", miniTemperaturePath(slow));

  const zero = years.map((year) => [xScale(year), temperatureYScale(0)]);
  const fastUpper = years.map((year) => [xScale(year), temperatureYScale(fast[year])]);
  const totalUpper = years.map((year) => [xScale(year), temperatureYScale(total[year])]);
  elements.temperatureFastBand.setAttribute("d", areaPath(fastUpper, zero));
  elements.temperatureSlowBand.setAttribute("d", areaPath(totalUpper, fastUpper));
  elements.temperatureTotalLine.setAttribute("d", linePath(totalUpper));

  const maximum = Math.max(...total);
  elements.temperatureAxisTop.textContent = scientific(maximum, 2);
  elements.temperatureAxisMiddle.textContent = scientific(maximum / 2, 2);
}

function decompositionX(year) {
  return DECOMPOSITION.left + (year / SVG.maxYear) * (DECOMPOSITION.right - DECOMPOSITION.left);
}

function sumY(value) {
  return DECOMPOSITION.sumBottom - value * (DECOMPOSITION.sumBottom - DECOMPOSITION.sumTop);
}

function componentValue(component, year) {
  if (component.lifetime_years === null) return component.amplitude;
  return component.amplitude * Math.exp(-year / component.lifetime_years);
}

function linePath(points) {
  return points.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function methodProjection() {
  if (state.methodView === "top") return METHOD_PROJECTIONS.top;
  const angle = state.methodAngle * Math.PI / 180;
  const length = 510;
  const verticalCompression = 0.46;
  const xVector = {
    x: length * Math.cos(angle),
    y: length * verticalCompression * Math.sin(angle),
  };
  const yVector = {
    x: length * Math.cos(angle - Math.PI / 2),
    y: length * verticalCompression * Math.sin(angle - Math.PI / 2),
  };
  return {
    origin: {
      x: 460 - (xVector.x + yVector.x) / 2,
      y: 475 - (xVector.y + yVector.y) / 2,
    },
    xVector,
    yVector,
    zHeight: 285,
  };
}

function projectMethod(forcingYear, responseLag, normalizedContribution = 0) {
  const projection = methodProjection();
  return {
    x: projection.origin.x
      + (forcingYear / SVG.maxYear) * projection.xVector.x
      + (responseLag / SVG.maxYear) * projection.yVector.x,
    y: projection.origin.y
      + (forcingYear / SVG.maxYear) * projection.xVector.y
      + (responseLag / SVG.maxYear) * projection.yVector.y
      - normalizedContribution * projection.zHeight,
  };
}

function contributionAt(forcingYear, responseLag) {
  return forcingAt(forcingYear) * thermalKernelAt(responseLag);
}

function normalizedContributionAt(forcingYear, responseLag) {
  return contributionAt(forcingYear, responseLag) / contributionAt(0, 0);
}

function methodPath(points) {
  return linePath(points.map(({ x, y }) => [x, y]));
}

function methodPolygon(points) {
  return `${methodPath(points)} Z`;
}

function createSvgElement(name, attributes = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function clearSvgGroup(group) {
  while (group.firstChild) group.removeChild(group.firstChild);
}

function buildMethodGroundGrid() {
  clearSvgGroup(elements.methodGroundGrid);
  [0, 100, 200, 300, 400, 500].forEach((year) => {
    const xLine = createSvgElement("path", {
      d: methodPath([projectMethod(year, 0), projectMethod(year, SVG.maxYear)]),
    });
    const yLine = createSvgElement("path", {
      d: methodPath([projectMethod(0, year), projectMethod(SVG.maxYear, year)]),
    });
    elements.methodGroundGrid.append(xLine, yLine);
  });
}

function buildMethodInputCurves() {
  const years = Array.from({ length: 101 }, (_, index) => index * 5);
  const miniPath = (valueAt) => methodPath(years.map((year) => ({
    x: 30 + year / SVG.maxYear * 312,
    y: 125 - valueAt(year) / valueAt(0) * 107,
  })));
  elements.methodInputForcingLine.setAttribute("d", miniPath(forcingAt));
  elements.methodInputThermalLine.setAttribute("d", miniPath(thermalKernelAt));
}

function methodOutputX(year) {
  return 55 + year / SVG.maxYear * 635;
}

function methodOutputY(value) {
  const maximum = Math.max(...state.model.series.temperature_change_k_per_tonne);
  return 190 - value / maximum * 165;
}

function buildMethodSurface() {
  clearSvgGroup(elements.methodSurfaceCells);
  clearSvgGroup(elements.methodSurfaceGrid);
  buildMethodGroundGrid();

  const cells = [];
  for (let xIndex = 0; xIndex < METHOD_GRID.length - 1; xIndex += 1) {
    for (let yIndex = 0; yIndex < METHOD_GRID.length - 1; yIndex += 1) {
      const x0 = METHOD_GRID[xIndex];
      const x1 = METHOD_GRID[xIndex + 1];
      const y0 = METHOD_GRID[yIndex];
      const y1 = METHOD_GRID[yIndex + 1];
      const values = [
        normalizedContributionAt(x0, y0),
        normalizedContributionAt(x1, y0),
        normalizedContributionAt(x1, y1),
        normalizedContributionAt(x0, y1),
      ];
      const points = [
        projectMethod(x0, y0, values[0]),
        projectMethod(x1, y0, values[1]),
        projectMethod(x1, y1, values[2]),
        projectMethod(x0, y1, values[3]),
      ];
      cells.push({
        depth: points.reduce((sum, point) => sum + point.y, 0) / points.length,
        strength: values.reduce((sum, value) => sum + value, 0) / values.length,
        points,
      });
    }
  }

  cells.sort((a, b) => a.depth - b.depth).forEach((cell) => {
    const strength = Math.sqrt(cell.strength);
    elements.methodSurfaceCells.appendChild(createSvgElement("path", {
      d: methodPolygon(cell.points),
      fill: "rgb(39, 105, 121)",
      opacity: (0.12 + strength * 0.78).toFixed(3),
    }));
  });

  METHOD_GRID.forEach((fixedYear) => {
    const alongX = METHOD_GRID.map((year) => projectMethod(
      year,
      fixedYear,
      normalizedContributionAt(year, fixedYear),
    ));
    const alongY = METHOD_GRID.map((year) => projectMethod(
      fixedYear,
      year,
      normalizedContributionAt(fixedYear, year),
    ));
    elements.methodSurfaceGrid.append(
      createSvgElement("path", { d: methodPath(alongX) }),
      createSvgElement("path", { d: methodPath(alongY) }),
    );
  });

  const boundaryYears = Array.from({ length: 101 }, (_, index) => index * 5);
  elements.methodForcingBoundary.setAttribute("d", methodPath(boundaryYears.map((year) => (
    projectMethod(year, 0, normalizedContributionAt(year, 0))
  ))));
  elements.methodThermalBoundary.setAttribute("d", methodPath(boundaryYears.map((year) => (
    projectMethod(0, year, normalizedContributionAt(0, year))
  ))));

  const projection = methodProjection();
  const xEnd = projectMethod(SVG.maxYear, 0);
  const yEnd = projectMethod(0, SVG.maxYear);
  const zEnd = projectMethod(0, 0, 1.06);
  elements.methodXLabel.setAttribute("x", (xEnd.x + 12).toFixed(2));
  elements.methodXLabel.setAttribute("y", (xEnd.y + 6).toFixed(2));
  elements.methodYLabel.setAttribute("x", (yEnd.x + 8).toFixed(2));
  elements.methodYLabel.setAttribute("y", (yEnd.y - 10).toFixed(2));
  elements.methodZLabel.setAttribute("x", (zEnd.x - 8).toFixed(2));
  elements.methodZLabel.setAttribute("y", (zEnd.y - 10).toFixed(2));
  elements.methodZLabel.textContent = projection.zHeight ? "temperature contribution" : "";
  updateMethodView();
}

function revealMethodName() {
  if (!state.methodSurfaceBuilt || state.methodInteracted) return;
  state.methodInteracted = true;
  elements.methodName.hidden = false;
}

function updateMethodView() {
  if (!state.model) return;
  const year = Math.round(state.year);
  const groundStart = projectMethod(year, 0);
  const groundEnd = projectMethod(0, year);
  const diagonalPoints = [];
  const diagonalGroundPoints = [];
  const pointCount = Math.max(2, Math.ceil(year / 5) + 1);
  for (let index = 0; index < pointCount; index += 1) {
    const forcingYear = pointCount === 1 ? 0 : year * index / (pointCount - 1);
    const responseLag = year - forcingYear;
    diagonalPoints.push(projectMethod(
      forcingYear,
      responseLag,
      normalizedContributionAt(forcingYear, responseLag),
    ));
    diagonalGroundPoints.push(projectMethod(forcingYear, responseLag));
  }

  if (state.methodView === "3d") {
    const planeStart = projectMethod(year, 0, 1.08);
    const planeEnd = projectMethod(0, year, 1.08);
    elements.methodObservationPlane.setAttribute("d", methodPolygon([
      groundStart,
      groundEnd,
      planeEnd,
      planeStart,
    ]));
  } else {
    elements.methodObservationPlane.setAttribute("d", methodPath([groundStart, groundEnd]));
  }

  elements.methodDiagonalArea.setAttribute("d", methodPolygon([
    ...diagonalPoints,
    ...diagonalGroundPoints.reverse(),
  ]));
  elements.methodDiagonalLine.setAttribute("d", methodPath(diagonalPoints));
  elements.methodYearValue.textContent = year.toLocaleString();
  elements.methodResultYear.textContent = year.toLocaleString();
  elements.methodTimeSlider.value = String(year);
  elements.methodTemperatureValue.textContent = scientific(temperatureAt(year));
  const outputYears = Array.from({ length: year + 1 }, (_, index) => index);
  elements.methodOutputLine.setAttribute("d", methodPath(outputYears.map((outputYear) => ({
    x: methodOutputX(outputYear),
    y: methodOutputY(temperatureAt(outputYear)),
  }))));
  const outputX = methodOutputX(year);
  const outputY = methodOutputY(temperatureAt(year));
  elements.methodOutputTimeLine.setAttribute("x1", outputX.toFixed(2));
  elements.methodOutputTimeLine.setAttribute("x2", outputX.toFixed(2));
  elements.methodOutputPoint.setAttribute("cx", outputX.toFixed(2));
  elements.methodOutputPoint.setAttribute("cy", outputY.toFixed(2));
  elements.methodOutputChartDescription.textContent = `The diagonal sweep has drawn the temperature response through year ${year}, reaching ${scientific(temperatureAt(year))} kelvin per tonne.`;
  elements.methodChartDescription.textContent = state.methodSurfaceBuilt
    ? `At observation year ${year}, the plane x plus y equals ${year} cuts through the contribution surface. The highlighted diagonal contributions sum to ${scientific(temperatureAt(year))} kelvin per tonne.`
    : "The forcing-time and response-lag boundary curves are ready to be expanded into a contribution surface.";
}

function toggleMethodSurface() {
  state.methodSurfaceBuilt = !state.methodSurfaceBuilt;
  elements.methodCard.dataset.state = state.methodSurfaceBuilt ? "surface" : "edges";
  elements.surfaceBuildLabel.textContent = state.methodSurfaceBuilt
    ? "Return to boundary curves"
    : "Build contribution surface";
  elements.surfaceBuildButton.querySelector("span[aria-hidden]").textContent = state.methodSurfaceBuilt ? "↙" : "↗";
  updateMethodView();
}

function toggleMethodView() {
  state.methodView = state.methodView === "3d" ? "top" : "3d";
  elements.methodCard.dataset.view = state.methodView;
  elements.methodViewButton.textContent = state.methodView === "3d" ? "View from above" : "Return to 3D";
  elements.methodRotationSlider.disabled = state.methodView !== "3d";
  buildMethodSurface();
}

function methodYearFromPointer(event) {
  const bounds = elements.methodChart.getBoundingClientRect();
  const pointer = {
    x: (event.clientX - bounds.left) * 920 / bounds.width,
    y: (event.clientY - bounds.top) * 640 / bounds.height,
  };
  const projection = methodProjection();
  const midpointVector = {
    x: (projection.xVector.x + projection.yVector.x) / 2,
    y: (projection.xVector.y + projection.yVector.y) / 2,
  };
  const fromOrigin = {
    x: pointer.x - projection.origin.x,
    y: pointer.y - projection.origin.y,
  };
  const denominator = midpointVector.x ** 2 + midpointVector.y ** 2;
  const fraction = (fromOrigin.x * midpointVector.x + fromOrigin.y * midpointVector.y) / denominator;
  return Math.round(Math.max(0, Math.min(1, fraction)) * SVG.maxYear);
}

function setMethodYearFromPointer(event) {
  if (state.emitted) setPlaying(false);
  state.year = methodYearFromPointer(event);
  revealMethodName();
  updateView();
}

function areaPath(upper, lower) {
  return `${linePath(upper)} ${lower.slice().reverse().map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(" ")} Z`;
}

function buildDecomposition() {
  const components = state.model.components;
  const years = [];
  for (let year = 0; year <= SVG.maxYear; year += 2) years.push(year);

  components.forEach((component, index) => {
    const baseline = 105;
    const points = years.map((year) => [
      decompositionX(year),
      baseline - DECOMPOSITION.laneAmplitude * componentValue(component, year) / component.amplitude,
    ]);
    const path = linePath(points);
    elements.componentLines[index].setAttribute("d", path);
    elements.fallingLines[index].setAttribute("d", path);
    elements.fallingLines[index].style.setProperty("--fall-y", `${DECOMPOSITION.sumBottom - DECOMPOSITION.laneBaselines[index]}px`);
    elements.fallingLines[index].style.setProperty("--term-delay", `${index * 130}ms`);
    elements.sumBands[index].style.setProperty("--term-delay", `${350 + index * 130}ms`);

    if (component.lifetime_years !== null) {
      const tangentIndex = index - 1;
      const tauX = decompositionX(component.lifetime_years);
      const curveAtTauY = baseline - DECOMPOSITION.laneAmplitude / Math.E;
      elements.tangentLines[tangentIndex].setAttribute("x1", String(DECOMPOSITION.left));
      elements.tangentLines[tangentIndex].setAttribute("y1", String(baseline - DECOMPOSITION.laneAmplitude));
      elements.tangentLines[tangentIndex].setAttribute("x2", tauX.toFixed(2));
      elements.tangentLines[tangentIndex].setAttribute("y2", String(baseline));
      elements.efoldPoints[tangentIndex].setAttribute("cx", tauX.toFixed(2));
      elements.efoldPoints[tangentIndex].setAttribute("cy", curveAtTauY.toFixed(2));
      elements.tauLabels[tangentIndex].setAttribute("x", tauX.toFixed(2));
      elements.tauLabels[tangentIndex].setAttribute("y", String(baseline + 18));
    }
  });

  let lowerValues = years.map(() => 0);
  components.forEach((component, index) => {
    const upperValues = years.map((year, pointIndex) => lowerValues[pointIndex] + componentValue(component, year));
    const upper = years.map((year, pointIndex) => [decompositionX(year), sumY(upperValues[pointIndex])]);
    const lower = years.map((year, pointIndex) => [decompositionX(year), sumY(lowerValues[pointIndex])]);
    elements.sumBands[index].setAttribute("d", areaPath(upper, lower));
    lowerValues = upperValues;
  });

  elements.sumLine.setAttribute("d", linePath(years.map((year) => [decompositionX(year), sumY(remainingFraction(year))])));
}

function toggleDecomposition() {
  const combined = elements.decayCard.dataset.state !== "combined";
  elements.decayCard.dataset.state = combined ? "combined" : "separate";
  elements.combineLabel.textContent = combined ? "Separate the terms" : "Add the four terms";
  elements.combineButton.querySelector("span[aria-hidden]").textContent = combined ? "↑" : "↓";
  elements.decayChartDescription.textContent = combined
    ? "The four fitted terms are stacked in the fifth panel. Their upper boundary is the total atmospheric response at every year."
    : "Four fitted response terms are shown independently above an empty total panel.";
}

function toggleTemperatureResponses() {
  const combined = elements.temperatureCard.dataset.state !== "combined";
  elements.temperatureCard.dataset.state = combined ? "combined" : "separate";
  elements.temperatureCombineLabel.textContent = combined ? "Separate responses" : "Combine responses";
  elements.temperatureCombineButton.querySelector("span[aria-hidden]").textContent = combined ? "↑" : "↓";
  elements.temperatureChartDescription.textContent = combined
    ? "The fast and slow thermal contributions are stacked; their upper boundary is the total global mean surface temperature response to the pulse."
    : "The fast and slow thermal response contributions are shown separately; combine them to reveal their sum.";
}

function scientific(value, significantDigits = 3) {
  if (value === 0) return "0";
  const superscript = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const [mantissa, exponent] = value.toExponential(significantDigits - 1).split("e");
  return `${mantissa} × 10${[...String(Number(exponent))].map((character) => superscript[character]).join("")}`;
}

function massScaleLabel(tonnes) {
  if (tonnes === 1e9) return "1 Gt";
  if (tonnes === 1e6) return "1 Mt";
  if (tonnes === 1e3) return "1 kt";
  return `${tonnes.toLocaleString()} t`;
}

function updateConcentrationScale(tonnes) {
  if (!state.model) return;
  const incrementPpm = tonnes * 1000 / state.model.kg_co2_per_ppm;
  elements.concentrationMassValue.textContent = massScaleLabel(tonnes);
  elements.concentrationConversionValue.textContent = `${(state.model.kg_co2_per_ppm / 1e12).toFixed(2)} Gt`;
  elements.concentrationIncrementValue.textContent = incrementPpm >= 0.001
    ? `${incrementPpm.toFixed(3)} ppm`
    : `${scientific(incrementPpm)} ppm`;
  elements.concentrationScaleButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.tonnes) === tonnes));
  });
}

function updatePulseConcentration() {
  if (!state.model) return;
  const incrementPpm = 1000 / state.model.kg_co2_per_ppm;
  elements.pulseConcentrationConversionValue.textContent = `${(state.model.kg_co2_per_ppm / 1e12).toFixed(2)} Gt`;
  elements.pulseConcentrationIncrementValue.textContent = `${scientific(incrementPpm)} ppm`;
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

function updateTemperatureView() {
  if (!state.model) return;
  const roundedYear = Math.round(state.year);
  const fast = temperatureComponentAt("fast", state.year);
  const slow = temperatureComponentAt("slow", state.year);
  const total = temperatureAt(state.year);
  const x = xScale(state.year);
  const y = temperatureYScale(total);

  elements.temperatureYearValue.textContent = roundedYear.toLocaleString();
  elements.temperatureFastValue.textContent = scientific(fast);
  elements.temperatureSlowValue.textContent = scientific(slow);
  elements.temperatureTotalValue.textContent = scientific(total);
  elements.temperatureTimeSlider.value = String(roundedYear);
  elements.temperatureTimeLine.setAttribute("x1", x.toFixed(2));
  elements.temperatureTimeLine.setAttribute("x2", x.toFixed(2));
  elements.temperatureTimePoint.setAttribute("cx", x.toFixed(2));
  elements.temperatureTimePoint.setAttribute("cy", y.toFixed(2));
  elements.temperatureChartDescription.textContent = elements.temperatureCard.dataset.state === "combined"
    ? `At year ${roundedYear}, the stacked fast and slow thermal modes sum to ${scientific(total)} kelvin of global mean surface temperature change per tonne emitted.`
    : `At year ${roundedYear}, the fast contribution is ${scientific(fast)} kelvin and the slow contribution is ${scientific(slow)} kelvin per tonne emitted; they are currently shown separately.`;
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
    return "Emission complete. The atmospheric pulse remains.";
  }
  if (year < 20) {
    return `Year ${year}: faster exchanges act; ${Math.round(fraction * 100)}% of the pulse remains.`;
  }
  if (year < 100) {
    return "Several carbon processes shape this multi-timescale decline.";
  }
  if (year < 300) {
    return "A century on, a substantial share still remains.";
  }
  return "Centuries on, CO2 retains a long-lived remainder.";
}

function updateView() {
  updateForcingView();
  updateMethodView();
  updateTemperatureView();
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
  if (state.emitted) elements.card.dataset.state = playing ? "active" : "paused";
  elements.playButton.innerHTML = `<span aria-hidden="true">${playing ? "Ⅱ" : "▶"}</span>`;
  elements.playButton.setAttribute("aria-label", playing ? "Pause time" : "Play time");
  elements.methodPlayButton.innerHTML = `<span aria-hidden="true">${playing ? "Ⅱ" : "▶"}</span>`;
  elements.methodPlayButton.setAttribute("aria-label", playing ? "Pause observation-year sweep" : "Sweep observation year");
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
  elements.methodTimeSlider.value = "0";
  elements.temperatureTimeSlider.value = "0";
  elements.yearValue.textContent = "0";
  elements.massValue.textContent = "—";
  elements.percentValue.textContent = "—";
  elements.modelStatus.textContent = "Ready for one pulse";
  elements.insightCopy.textContent = "Emit the tonne to begin.";
  elements.particles.querySelectorAll(".particle").forEach((particle) => particle.classList.remove("visible"));
  updateForcingView();
  updateMethodView();
  updateTemperatureView();
}

function bindEvents() {
  let draggingMethodPlane = false;
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
  elements.combineButton.addEventListener("click", toggleDecomposition);
  elements.surfaceBuildButton.addEventListener("click", toggleMethodSurface);
  elements.methodViewButton.addEventListener("click", toggleMethodView);
  elements.methodRotationSlider.addEventListener("input", (event) => {
    state.methodAngle = Number(event.target.value);
    buildMethodSurface();
  });
  elements.methodPlayButton.addEventListener("click", () => {
    if (state.year >= SVG.maxYear) state.year = 0;
    revealMethodName();
    setPlaying(!state.playing);
  });
  elements.methodTimeSlider.addEventListener("input", (event) => {
    if (state.emitted) setPlaying(false);
    state.year = Number(event.target.value);
    revealMethodName();
    updateView();
  });
  elements.methodDragSurface.addEventListener("pointerdown", (event) => {
    if (!state.methodSurfaceBuilt) return;
    draggingMethodPlane = true;
    elements.methodDragSurface.setPointerCapture(event.pointerId);
    setMethodYearFromPointer(event);
  });
  elements.methodDragSurface.addEventListener("pointermove", (event) => {
    if (draggingMethodPlane) setMethodYearFromPointer(event);
  });
  elements.methodDragSurface.addEventListener("pointerup", (event) => {
    draggingMethodPlane = false;
    if (elements.methodDragSurface.hasPointerCapture(event.pointerId)) {
      elements.methodDragSurface.releasePointerCapture(event.pointerId);
    }
  });
  elements.methodDragSurface.addEventListener("pointercancel", () => {
    draggingMethodPlane = false;
  });
  elements.temperatureCombineButton.addEventListener("click", toggleTemperatureResponses);
  elements.concentrationScaleButtons.forEach((button) => {
    button.addEventListener("click", () => updateConcentrationScale(Number(button.dataset.tonnes)));
  });
  elements.temperatureTimeSlider.addEventListener("input", (event) => {
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
    buildDecomposition();
    buildMethodInputCurves();
    buildMethodSurface();
    buildTemperaturePaths();
    const initialForcing = state.model.series.forcing_w_m2_per_tonne[0];
    elements.forcingAxisTop.textContent = scientific(initialForcing, 2);
    elements.forcingAxisMiddle.textContent = scientific(initialForcing / 2, 2);
    elements.forcingTimeSlider.disabled = false;
    elements.ar6BackgroundValue.textContent = state.model.reference_background_co2_ppm.toFixed(1);
    updateConcentrationScale(1);
    updatePulseConcentration();
    elements.combineButton.disabled = false;
    elements.combineLabel.textContent = "Add the four terms";
    elements.surfaceBuildButton.disabled = false;
    elements.surfaceBuildLabel.textContent = "Build contribution surface";
    elements.methodViewButton.disabled = false;
    elements.methodRotationSlider.disabled = false;
    elements.methodTimeSlider.disabled = false;
    elements.methodPlayButton.disabled = false;
    elements.temperatureCombineButton.disabled = false;
    elements.temperatureCombineLabel.textContent = "Combine responses";
    elements.temperatureTimeSlider.disabled = false;
    updateForcingView();
    updateMethodView();
    updateTemperatureView();
    elements.emitButton.disabled = false;
    elements.emitLabel.textContent = "Emit 1 t CO2";
    elements.modelStatus.textContent = "AR6 CO2 pulse model ready";
    elements.modelNote.textContent = `${state.model.assessment_status}. Burden, forcing, and temperature scenes share this generated pulse response and the same selected year.`;
  } catch (error) {
    elements.emitLabel.textContent = "Model unavailable";
    elements.modelStatus.textContent = "Serve the app over HTTP to load its model data";
    console.error(error);
  }
}

initialize();
