"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  time: number;
  flux: number;
}

interface LightCurveProps {
  data: DataPoint[];
  label?: string;
  color?: string;
  className?: string;
}

const PAPER = "#f4ecdc";
const MIST = "rgba(244, 236, 220, 0.55)";
const HAIRLINE = "rgba(244, 236, 220, 0.08)";
const RULE = "rgba(244, 236, 220, 0.18)";

export default function LightCurve({
  data,
  label = "Light Curve",
  color = "#ff6b3d",
  className = "",
}: LightCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

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

    const xExtent = d3.extent(data, (d) => d.time) as [number, number];
    const yMin = d3.min(data, (d) => d.flux) || 0.99;
    const yMax = d3.max(data, (d) => d.flux) || 1.001;
    const yPadding = (yMax - yMin) * 0.18;

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([yMin - yPadding, yMax + yPadding]).range([innerHeight, 0]);

    g.append("g")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0).attr("x2", innerWidth)
      .attr("y1", (d) => y(d)).attr("y2", (d) => y(d))
      .attr("stroke", HAIRLINE).attr("stroke-dasharray", "1 3");

    const xAxis = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(0).tickPadding(10));
    xAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10).tickFormat(d3.format(".4f")));
    yAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    const area = d3.area<DataPoint>().x((d) => x(d.time)).y0(innerHeight).y1((d) => y(d.flux)).curve(d3.curveBasis);
    g.append("path").datum(data).attr("d", area).attr("fill", color).attr("fill-opacity", 0.08);

    const line = d3.line<DataPoint>().x((d) => x(d.time)).y((d) => y(d.flux)).curve(d3.curveBasis);
    const path = g.append("path").datum(data).attr("d", line)
      .attr("fill", "none").attr("stroke", color).attr("stroke-width", 1.75)
      .attr("filter", "drop-shadow(0 0 6px rgba(255,107,61,0.45))");

    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition().duration(1600).ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    g.selectAll("circle.data")
      .data(data).join("circle").attr("class", "data")
      .attr("cx", (d) => x(d.time)).attr("cy", (d) => y(d.flux))
      .attr("r", 1.5).attr("fill", color).attr("fill-opacity", 0)
      .transition().delay((_, i) => (i / data.length) * 1600)
      .attr("fill-opacity", 0.7);

    // ─── CROSSHAIR LAYER ───────────────────────────────
    const crosshair = g.append("g").attr("class", "crosshair").style("opacity", 0);
    const cLine = crosshair.append("line")
      .attr("y1", 0).attr("y2", innerHeight)
      .attr("stroke", color).attr("stroke-width", 1).attr("stroke-dasharray", "2 3").attr("stroke-opacity", 0.65);
    const cDot = crosshair.append("circle")
      .attr("r", 5).attr("fill", color)
      .style("filter", `drop-shadow(0 0 8px ${color})`);
    const cDotInner = crosshair.append("circle")
      .attr("r", 2).attr("fill", PAPER);

    // readout pill — top center-ish, follows the cursor horizontally
    const readout = g.append("g").attr("class", "readout").style("opacity", 0);
    const readoutBg = readout.append("rect")
      .attr("rx", 4).attr("height", 22).attr("fill", "#07060d").attr("stroke", color).attr("stroke-opacity", 0.5);
    const readoutText = readout.append("text")
      .attr("y", 14).attr("x", 8)
      .attr("fill", PAPER).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10.5px");

    const overlay = g.append("rect")
      .attr("width", innerWidth).attr("height", innerHeight)
      .attr("fill", "transparent").style("cursor", "crosshair").style("touch-action", "pan-y");

    const bisect = d3.bisector<DataPoint, number>((d) => d.time).center;

    function show(eventX: number) {
      const xVal = x.invert(eventX);
      const idx = bisect(data, xVal);
      const pt = data[Math.max(0, Math.min(data.length - 1, idx))];
      const px = x(pt.time);
      const py = y(pt.flux);
      crosshair.style("opacity", 1);
      cLine.attr("x1", px).attr("x2", px);
      cDot.attr("cx", px).attr("cy", py);
      cDotInner.attr("cx", px).attr("cy", py);

      const label = `t ${pt.time.toFixed(2)}  ·  flux ${pt.flux.toFixed(5)}`;
      readoutText.text(label);
      const bbox = (readoutText.node() as SVGTextElement).getBBox();
      const w = bbox.width + 16;
      const xPos = Math.max(0, Math.min(innerWidth - w, px - w / 2));
      readout.style("opacity", 1).attr("transform", `translate(${xPos}, ${-26})`);
      readoutBg.attr("width", w);
    }
    function hide() {
      crosshair.style("opacity", 0);
      readout.style("opacity", 0);
    }

    overlay
      .on("pointermove", (e) => {
        const [px] = d3.pointer(e);
        show(px);
      })
      .on("pointerleave", hide)
      .on("touchstart", (e) => {
        const t = (e.touches[0]?.clientX ?? 0) - (svgRef.current!.getBoundingClientRect().left + margin.left);
        show(t);
      }, { passive: true })
      .on("touchmove", (e) => {
        const t = (e.touches[0]?.clientX ?? 0) - (svgRef.current!.getBoundingClientRect().left + margin.left);
        show(t);
      }, { passive: true });

    // Labels
    svg.append("text")
      .attr("x", width / 2).attr("y", height - 6).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em")
      .text("TIME · HOURS FROM MID-TRANSIT");
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2)).attr("y", 14).attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em")
      .text("RELATIVE FLUX");
    svg.append("text")
      .attr("x", margin.left).attr("y", 22)
      .attr("fill", PAPER).attr("font-family", "var(--font-sans), system-ui")
      .attr("font-size", "12px").attr("font-weight", "500")
      .text(label);
  }, [data, label, color]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
