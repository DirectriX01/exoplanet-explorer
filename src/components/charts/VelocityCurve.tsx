"use client";

import { useRef, useEffect, type RefObject } from "react";
import * as d3 from "d3";

interface RVPoint {
  phase: number;
  velocity: number;
  error?: number;
}

interface VelocityCurveProps {
  fitData: RVPoint[];
  observedData?: RVPoint[];
  label?: string;
  color?: string;
  className?: string;
  /** When provided, an auto-cursor rides the curve at the current orbital phase. */
  phaseRef?: RefObject<number>;
}

const PAPER = "#f4ecdc";
const MIST = "rgba(244, 236, 220, 0.55)";
const HAIRLINE = "rgba(244, 236, 220, 0.08)";
const RULE = "rgba(244, 236, 220, 0.18)";

export default function VelocityCurve({
  fitData,
  observedData,
  label = "Radial Velocity Curve",
  color = "#ff6b3d",
  className = "",
  phaseRef,
}: VelocityCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || fitData.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const width = container?.clientWidth || 500;
    const height = 300;
    const margin = { top: 40, right: 24, bottom: 48, left: 64 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const allV = [...fitData.map((d) => d.velocity), ...(observedData || []).map((d) => d.velocity)];
    const vMax = Math.max(...allV.map(Math.abs)) * 1.2;

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([-vMax, vMax]).range([innerHeight, 0]);

    // Gentle blue/red bands
    g.append("rect").attr("x", 0).attr("y", 0).attr("width", innerWidth).attr("height", y(0))
      .attr("fill", "#7eb6ff").attr("fill-opacity", 0.025);
    g.append("rect").attr("x", 0).attr("y", y(0)).attr("width", innerWidth).attr("height", innerHeight - y(0))
      .attr("fill", "#ff7e7e").attr("fill-opacity", 0.025);

    g.append("g")
      .selectAll("line").data(y.ticks(6)).join("line")
      .attr("x1", 0).attr("x2", innerWidth).attr("y1", (d) => y(d)).attr("y2", (d) => y(d))
      .attr("stroke", HAIRLINE).attr("stroke-dasharray", "1 3");

    // Zero line
    g.append("line").attr("x1", 0).attr("x2", innerWidth).attr("y1", y(0)).attr("y2", y(0))
      .attr("stroke", RULE).attr("stroke-dasharray", "3 4");

    g.append("text").attr("x", innerWidth - 6).attr("y", 12).attr("text-anchor", "end")
      .attr("fill", "#7eb6ff").attr("font-family", "var(--font-mono), monospace").attr("font-size", "9px")
      .attr("letter-spacing", "0.1em").attr("opacity", 0.6).text("APPROACHING");
    g.append("text").attr("x", innerWidth - 6).attr("y", innerHeight - 4).attr("text-anchor", "end")
      .attr("fill", "#ff7e7e").attr("font-family", "var(--font-mono), monospace").attr("font-size", "9px")
      .attr("letter-spacing", "0.1em").attr("opacity", 0.6).text("RECEDING");

    const xAxis = g.append("g").attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10).tickFormat(d3.format(".1f")));
    xAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g.append("g").call(d3.axisLeft(y).ticks(6).tickSize(0).tickPadding(10));
    yAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    // Fit line
    const line = d3.line<RVPoint>().x((d) => x(d.phase)).y((d) => y(d.velocity)).curve(d3.curveBasis);
    const path = g.append("path").datum(fitData).attr("d", line)
      .attr("fill", "none").attr("stroke", color).attr("stroke-width", 1.75)
      .attr("filter", `drop-shadow(0 0 6px ${color}66)`);
    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
      .transition().duration(1500).ease(d3.easeQuadOut).attr("stroke-dashoffset", 0);

    if (observedData) {
      const obs = g.selectAll(".obs").data(observedData).join("g").attr("class", "obs").attr("opacity", 0);
      obs.transition().delay((_, i) => 1500 + i * 50).attr("opacity", 1);
      obs.filter((d) => d.error != null).append("line")
        .attr("x1", (d) => x(d.phase)).attr("x2", (d) => x(d.phase))
        .attr("y1", (d) => y(d.velocity - (d.error || 0))).attr("y2", (d) => y(d.velocity + (d.error || 0)))
        .attr("stroke", color).attr("stroke-opacity", 0.4).attr("stroke-width", 1);
      obs.append("circle")
        .attr("cx", (d) => x(d.phase)).attr("cy", (d) => y(d.velocity))
        .attr("r", 3.5).attr("fill", color).attr("stroke", "#07060d").attr("stroke-width", 1.5);
    }

    // ─── CROSSHAIR ────────────────────────────────────
    const crosshair = g.append("g").style("opacity", 0);
    const cLine = crosshair.append("line").attr("y1", 0).attr("y2", innerHeight)
      .attr("stroke", color).attr("stroke-width", 1).attr("stroke-dasharray", "2 3").attr("stroke-opacity", 0.65);
    const cDot = crosshair.append("circle").attr("r", 5).attr("fill", color).style("filter", `drop-shadow(0 0 8px ${color})`);
    const cDotInner = crosshair.append("circle").attr("r", 2).attr("fill", PAPER);

    const readout = g.append("g").style("opacity", 0);
    const readoutBg = readout.append("rect").attr("rx", 4).attr("height", 22)
      .attr("fill", "#07060d").attr("stroke", color).attr("stroke-opacity", 0.5);
    const readoutText = readout.append("text").attr("y", 14).attr("x", 8)
      .attr("fill", PAPER).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10.5px");

    const overlay = g.append("rect").attr("width", innerWidth).attr("height", innerHeight)
      .attr("fill", "transparent").style("cursor", "crosshair").style("touch-action", "pan-y");
    const bisect = d3.bisector<RVPoint, number>((d) => d.phase).center;

    function show(eventX: number) {
      const xVal = x.invert(eventX);
      const pt = fitData[Math.max(0, Math.min(fitData.length - 1, bisect(fitData, xVal)))];
      const px = x(pt.phase), py = y(pt.velocity);
      crosshair.style("opacity", 1);
      cLine.attr("x1", px).attr("x2", px);
      cDot.attr("cx", px).attr("cy", py);
      cDotInner.attr("cx", px).attr("cy", py);
      readoutText.text(`phase ${pt.phase.toFixed(2)}  ·  v ${pt.velocity.toFixed(1)} m/s`);
      const bbox = (readoutText.node() as SVGTextElement).getBBox();
      const w = bbox.width + 16;
      const xPos = Math.max(0, Math.min(innerWidth - w, px - w / 2));
      readout.style("opacity", 1).attr("transform", `translate(${xPos}, ${-26})`);
      readoutBg.attr("width", w);
    }
    overlay.on("pointermove", (e) => show(d3.pointer(e)[0])).on("pointerleave", () => { crosshair.style("opacity", 0); readout.style("opacity", 0); });

    // ─── PHASE-DRIVEN AUTO CURSOR ──────────────────────
    let rafId = 0;
    if (phaseRef) {
      const auto = g.append("g").attr("class", "auto-cursor");
      const aLine = auto.append("line").attr("y1", 0).attr("y2", innerHeight)
        .attr("stroke", color).attr("stroke-width", 1).attr("stroke-opacity", 0.4);
      const aDot = auto.append("circle").attr("r", 6).attr("fill", color)
        .style("filter", `drop-shadow(0 0 10px ${color})`);
      const aDotInner = auto.append("circle").attr("r", 2.5).attr("fill", PAPER);

      let lastP = -1;
      const tick = () => {
        const p = Math.max(0, Math.min(1, phaseRef.current ?? 0));
        if (p !== lastP) {
          lastP = p;
          const idx = Math.round(p * (fitData.length - 1));
          const pt = fitData[idx];
          const px = x(pt.phase);
          const py = y(pt.velocity);
          aLine.attr("x1", px).attr("x2", px);
          aDot.attr("cx", px).attr("cy", py);
          aDotInner.attr("cx", px).attr("cy", py);
        }
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    svg.append("text").attr("x", width / 2).attr("y", height - 6).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("ORBITAL PHASE");
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height / 2)).attr("y", 14)
      .attr("text-anchor", "middle").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("RADIAL VELOCITY · m/s");
    svg.append("text").attr("x", margin.left).attr("y", 22)
      .attr("fill", PAPER).attr("font-family", "var(--font-sans), system-ui")
      .attr("font-size", "12px").attr("font-weight", "500").text(label);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [fitData, observedData, label, color, phaseRef]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
