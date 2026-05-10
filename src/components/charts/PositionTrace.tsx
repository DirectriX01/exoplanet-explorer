"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

const PAPER = "#f4ecdc";
const MIST = "rgba(244, 236, 220, 0.55)";
const HAIRLINE = "rgba(244, 236, 220, 0.06)";
const RULE = "rgba(244, 236, 220, 0.18)";
const EMBER = "#ff6b3d";

export default function PositionTrace({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    const points: { ra: number; dec: number; t: number }[] = [];
    let i = 0;
    for (let t = 0; t < Math.PI * 6; t += 0.05) {
      const wobbleRA = Math.sin(t) * 0.4;
      const wobbleDec = Math.cos(t * 1.3) * 0.25;
      const properMotionRA = t * 0.12;
      const properMotionDec = Math.sin(t * 0.08) * 0.3;
      points.push({
        ra: wobbleRA + properMotionRA,
        dec: wobbleDec + properMotionDec,
        t: i++,
      });
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

    const xExtent = d3.extent(data, (d) => d.ra) as [number, number];
    const yExtent = d3.extent(data, (d) => d.dec) as [number, number];
    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice();
    const y = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice();

    g.selectAll(".grid-x").data(x.ticks(5)).join("line")
      .attr("x1", (d) => x(d)).attr("x2", (d) => x(d))
      .attr("y1", 0).attr("y2", innerHeight).attr("stroke", HAIRLINE);
    g.selectAll(".grid-y").data(y.ticks(5)).join("line")
      .attr("x1", 0).attr("x2", innerWidth)
      .attr("y1", (d) => y(d)).attr("y2", (d) => y(d)).attr("stroke", HAIRLINE);

    const xAxis = g.append("g").attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickPadding(10));
    xAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g.append("g").call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10));
    yAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    const line = d3.line<(typeof data)[0]>().x((d) => x(d.ra)).y((d) => y(d.dec)).curve(d3.curveBasis);
    const path = g.append("path").datum(data).attr("d", line)
      .attr("fill", "none").attr("stroke", EMBER).attr("stroke-width", 1.5).attr("stroke-opacity", 0.9)
      .attr("filter", `drop-shadow(0 0 5px ${EMBER}55)`);
    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`).attr("stroke-dashoffset", totalLength)
      .transition().duration(3000).ease(d3.easeLinear).attr("stroke-dashoffset", 0);

    g.append("circle").attr("cx", x(data[0].ra)).attr("cy", y(data[0].dec))
      .attr("r", 4).attr("fill", EMBER).attr("stroke", PAPER).attr("stroke-width", 1.2);

    // ─── CROSSHAIR ────────────────────────────────────
    const crosshair = g.append("g").style("opacity", 0);
    const cDot = crosshair.append("circle").attr("r", 5).attr("fill", EMBER).style("filter", `drop-shadow(0 0 8px ${EMBER})`);
    const cDotInner = crosshair.append("circle").attr("r", 2).attr("fill", PAPER);

    const readout = g.append("g").style("opacity", 0);
    const readoutBg = readout.append("rect").attr("rx", 4).attr("height", 22)
      .attr("fill", "#07060d").attr("stroke", EMBER).attr("stroke-opacity", 0.5);
    const readoutText = readout.append("text").attr("y", 14).attr("x", 8)
      .attr("fill", PAPER).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10.5px");

    const overlay = g.append("rect").attr("width", innerWidth).attr("height", innerHeight)
      .attr("fill", "transparent").style("cursor", "crosshair");

    function show(ex: number, ey: number) {
      // Find nearest point in 2D
      let bestIdx = 0;
      let bestD = Infinity;
      for (let i = 0; i < data.length; i++) {
        const dx = x(data[i].ra) - ex;
        const dy = y(data[i].dec) - ey;
        const d = dx * dx + dy * dy;
        if (d < bestD) { bestD = d; bestIdx = i; }
      }
      const pt = data[bestIdx];
      const px = x(pt.ra), py = y(pt.dec);
      crosshair.style("opacity", 1);
      cDot.attr("cx", px).attr("cy", py);
      cDotInner.attr("cx", px).attr("cy", py);
      readoutText.text(`t ${pt.t}  ·  RA ${pt.ra.toFixed(3)}  ·  Dec ${pt.dec.toFixed(3)}`);
      const bbox = (readoutText.node() as SVGTextElement).getBBox();
      const w = bbox.width + 16;
      const xPos = Math.max(0, Math.min(innerWidth - w, px - w / 2));
      const yPos = py < 30 ? py + 12 : py - 30;
      readout.style("opacity", 1).attr("transform", `translate(${xPos}, ${yPos})`);
      readoutBg.attr("width", w);
    }
    overlay.on("pointermove", (e) => {
      const [ex, ey] = d3.pointer(e);
      show(ex, ey);
    }).on("pointerleave", () => { crosshair.style("opacity", 0); readout.style("opacity", 0); });

    svg.append("text").attr("x", width / 2).attr("y", height - 6).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("RIGHT ASCENSION · mas");
    svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height / 2)).attr("y", 14)
      .attr("text-anchor", "middle").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em").text("DECLINATION · mas");
    svg.append("text").attr("x", margin.left).attr("y", 22)
      .attr("fill", PAPER).attr("font-family", "var(--font-sans), system-ui")
      .attr("font-size", "12px").attr("font-weight", "500").text("Stellar position wobble across the sky");
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
