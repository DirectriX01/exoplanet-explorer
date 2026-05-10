"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

interface MicrolensingCurveProps {
  className?: string;
}

const PAPER = "#f4ecdc";
const MIST = "rgba(244, 236, 220, 0.55)";
const HAIRLINE = "rgba(244, 236, 220, 0.08)";
const RULE = "rgba(244, 236, 220, 0.18)";
const EMBER = "#ff6b3d";

export default function MicrolensingCurve({ className = "" }: MicrolensingCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    const points: { time: number; magnification: number }[] = [];
    for (let t = -40; t <= 40; t += 0.5) {
      const u0 = 0.3;
      const tE = 15;
      const u = Math.sqrt(u0 * u0 + (t / tE) * (t / tE));
      let mag = (u * u + 2) / (u * Math.sqrt(u * u + 4));
      const planetT = 5;
      const planetWidth = 1.5;
      const planetAmp = 1.5;
      const dist = Math.abs(t - planetT);
      if (dist < planetWidth * 3) {
        mag += planetAmp * Math.exp(-0.5 * (dist / planetWidth) ** 2);
      }
      mag += (Math.random() - 0.5) * 0.03;
      points.push({ time: t, magnification: mag });
    }
    return points;
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
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

    const x = d3.scaleLinear().domain([-40, 40]).range([0, innerWidth]);
    const yMax = d3.max(data, (d) => d.magnification) || 5;
    const y = d3.scaleLinear().domain([0.9, yMax * 1.1]).range([innerHeight, 0]);

    g.selectAll(".grid-line").data(y.ticks(5)).join("line")
      .attr("x1", 0).attr("x2", innerWidth).attr("y1", (d) => y(d)).attr("y2", (d) => y(d))
      .attr("stroke", HAIRLINE).attr("stroke-dasharray", "1 3");

    const xAxis = g.append("g").attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(8).tickSize(0).tickPadding(10));
    xAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10).tickFormat(d3.format(".1f")));
    yAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    // Planet anomaly highlight
    g.append("rect").attr("x", x(2)).attr("y", 0).attr("width", x(8) - x(2)).attr("height", innerHeight)
      .attr("fill", EMBER).attr("fill-opacity", 0.06);
    g.append("text").attr("x", x(5)).attr("y", 13).attr("text-anchor", "middle")
      .attr("fill", EMBER).attr("font-family", "var(--font-mono), monospace").attr("font-size", "9px")
      .attr("letter-spacing", "0.1em").attr("opacity", 0.85).text("PLANET SIGNAL");

    const area = d3.area<(typeof data)[0]>().x((d) => x(d.time)).y0(innerHeight).y1((d) => y(d.magnification)).curve(d3.curveBasis);
    g.append("path").datum(data).attr("d", area).attr("fill", EMBER).attr("fill-opacity", 0.08);

    const line = d3.line<(typeof data)[0]>().x((d) => x(d.time)).y((d) => y(d.magnification)).curve(d3.curveBasis);
    const path = g.append("path").datum(data).attr("d", line)
      .attr("fill", "none").attr("stroke", EMBER).attr("stroke-width", 1.75)
      .attr("filter", `drop-shadow(0 0 6px ${EMBER}55)`);
    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
      .transition().duration(2000).ease(d3.easeQuadOut).attr("stroke-dashoffset", 0);

    // ─── CROSSHAIR ────────────────────────────────────
    const crosshair = g.append("g").style("opacity", 0);
    const cLine = crosshair.append("line").attr("y1", 0).attr("y2", innerHeight)
      .attr("stroke", EMBER).attr("stroke-width", 1).attr("stroke-dasharray", "2 3").attr("stroke-opacity", 0.65);
    const cDot = crosshair.append("circle").attr("r", 5).attr("fill", EMBER).style("filter", `drop-shadow(0 0 8px ${EMBER})`);
    const cDotInner = crosshair.append("circle").attr("r", 2).attr("fill", PAPER);

    const readout = g.append("g").style("opacity", 0);
    const readoutBg = readout.append("rect").attr("rx", 4).attr("height", 22)
      .attr("fill", "#07060d").attr("stroke", EMBER).attr("stroke-opacity", 0.5);
    const readoutText = readout.append("text").attr("y", 14).attr("x", 8)
      .attr("fill", PAPER).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10.5px");

    const overlay = g.append("rect").attr("width", innerWidth).attr("height", innerHeight)
      .attr("fill", "transparent").style("cursor", "crosshair");
    const bisect = d3.bisector<(typeof data)[0], number>((d) => d.time).center;
    function show(ex: number) {
      const xVal = x.invert(ex);
      const pt = data[Math.max(0, Math.min(data.length - 1, bisect(data, xVal)))];
      const px = x(pt.time), py = y(pt.magnification);
      crosshair.style("opacity", 1);
      cLine.attr("x1", px).attr("x2", px);
      cDot.attr("cx", px).attr("cy", py);
      cDotInner.attr("cx", px).attr("cy", py);
      readoutText.text(`t ${pt.time.toFixed(1)} d  ·  A ${pt.magnification.toFixed(2)}×`);
      const bbox = (readoutText.node() as SVGTextElement).getBBox();
      const w = bbox.width + 16;
      const xPos = Math.max(0, Math.min(innerWidth - w, px - w / 2));
      readout.style("opacity", 1).attr("transform", `translate(${xPos}, ${-26})`);
      readoutBg.attr("width", w);
    }
    overlay.on("pointermove", (e) => show(d3.pointer(e)[0]))
      .on("pointerleave", () => { crosshair.style("opacity", 0); readout.style("opacity", 0); });

    svg.append("text").attr("x", width / 2).attr("y", height - 6).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("TIME · DAYS");
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height / 2)).attr("y", 14).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("MAGNIFICATION");
    svg.append("text").attr("x", margin.left).attr("y", 22)
      .attr("fill", PAPER).attr("font-family", "var(--font-sans), system-ui")
      .attr("font-size", "12px").attr("font-weight", "500").text("Microlensing event with planet anomaly");
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
