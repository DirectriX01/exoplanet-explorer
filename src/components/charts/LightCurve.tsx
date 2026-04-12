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

export default function LightCurve({
  data,
  label = "Light Curve",
  color = "#f59e0b",
  className = "",
}: LightCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const width = container?.clientWidth || 500;
    const height = 280;
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(data, (d) => d.time) as [number, number];
    const yMin = d3.min(data, (d) => d.flux) || 0.99;
    const yMax = d3.max(data, (d) => d.flux) || 1.001;
    const yPadding = (yMax - yMin) * 0.15;

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
    const y = d3
      .scaleLinear()
      .domain([yMin - yPadding, yMax + yPadding])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .selectAll("line")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.05);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(0))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat(d3.format(".4f")))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    // Area fill
    const area = d3
      .area<DataPoint>()
      .x((d) => x(d.time))
      .y0(innerHeight)
      .y1((d) => y(d.flux))
      .curve(d3.curveBasis);

    g.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", color)
      .attr("fill-opacity", 0.05);

    // Line
    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.time))
      .y((d) => y(d.flux))
      .curve(d3.curveBasis);

    const path = g
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    // Animate line drawing
    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Data points
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.time))
      .attr("cy", (d) => y(d.flux))
      .attr("r", 2)
      .attr("fill", color)
      .attr("fill-opacity", 0)
      .transition()
      .delay((_, i) => (i / data.length) * 1500)
      .attr("fill-opacity", 0.6);

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Time (hours from mid-transit)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Relative Flux");

    // Title
    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 18)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text(label);
  }, [data, label, color]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
