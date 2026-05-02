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

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(data, (d) => d.time) as [number, number];
    const yMin = d3.min(data, (d) => d.flux) || 0.99;
    const yMax = d3.max(data, (d) => d.flux) || 1.001;
    const yPadding = (yMax - yMin) * 0.18;

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
    const y = d3
      .scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([innerHeight, 0]);

    // Hairline grid
    g.append("g")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0).attr("x2", innerWidth)
      .attr("y1", (d) => y(d)).attr("y2", (d) => y(d))
      .attr("stroke", HAIRLINE)
      .attr("stroke-dasharray", "1 3");

    // Axes — mono, no domain line
    const xAxis = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(0).tickPadding(10));
    xAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10).tickFormat(d3.format(".4f")));
    yAxis.selectAll("text").attr("fill", MIST).attr("font-family", "var(--font-mono), monospace").attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    // Soft ember area under the curve
    const area = d3.area<DataPoint>()
      .x((d) => x(d.time)).y0(innerHeight).y1((d) => y(d.flux))
      .curve(d3.curveBasis);
    g.append("path").datum(data).attr("d", area).attr("fill", color).attr("fill-opacity", 0.08);

    // Signal line
    const line = d3.line<DataPoint>()
      .x((d) => x(d.time)).y((d) => y(d.flux))
      .curve(d3.curveBasis);
    const path = g.append("path").datum(data).attr("d", line)
      .attr("fill", "none").attr("stroke", color).attr("stroke-width", 1.75)
      .attr("filter", "drop-shadow(0 0 6px rgba(255,107,61,0.45))");

    const totalLength = path.node()?.getTotalLength() || 0;
    path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition().duration(1600).ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Data points
    g.selectAll("circle.data")
      .data(data).join("circle").attr("class", "data")
      .attr("cx", (d) => x(d.time)).attr("cy", (d) => y(d.flux))
      .attr("r", 1.5).attr("fill", color).attr("fill-opacity", 0)
      .transition().delay((_, i) => (i / data.length) * 1600)
      .attr("fill-opacity", 0.7);

    // Axis labels — mono, uppercase
    svg.append("text")
      .attr("x", width / 2).attr("y", height - 6)
      .attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em")
      .text("TIME · HOURS FROM MID-TRANSIT");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2)).attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", MIST).attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px").attr("letter-spacing", "0.14em")
      .text("RELATIVE FLUX");

    // Title — sans, paper
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
