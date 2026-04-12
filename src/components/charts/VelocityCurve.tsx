"use client";

import { useRef, useEffect } from "react";
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
}

export default function VelocityCurve({
  fitData,
  observedData,
  label = "Radial Velocity Curve",
  color = "#6366f1",
  className = "",
}: VelocityCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || fitData.length === 0) return;

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

    const allVelocities = [
      ...fitData.map((d) => d.velocity),
      ...(observedData || []).map((d) => d.velocity),
    ];
    const vMax = Math.max(...allVelocities.map(Math.abs)) * 1.2;

    const x = d3.scaleLinear().domain([0, 1]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([-vMax, vMax]).range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .selectAll("line")
      .data(y.ticks(6))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.05);

    // Zero line
    g.append("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.15)
      .attr("stroke-dasharray", "4,4");

    // Blue/red shift regions
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", innerWidth)
      .attr("height", y(0))
      .attr("fill", "#60a5fa")
      .attr("fill-opacity", 0.03);

    g.append("rect")
      .attr("x", 0)
      .attr("y", y(0))
      .attr("width", innerWidth)
      .attr("height", innerHeight - y(0))
      .attr("fill", "#f87171")
      .attr("fill-opacity", 0.03);

    // Shift labels
    g.append("text")
      .attr("x", innerWidth - 5)
      .attr("y", 15)
      .attr("text-anchor", "end")
      .attr("fill", "#60a5fa")
      .attr("font-size", "9px")
      .attr("opacity", 0.5)
      .text("Approaching (blueshift)");

    g.append("text")
      .attr("x", innerWidth - 5)
      .attr("y", innerHeight - 5)
      .attr("text-anchor", "end")
      .attr("fill", "#f87171")
      .attr("font-size", "9px")
      .attr("opacity", 0.5)
      .text("Receding (redshift)");

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0).tickFormat(d3.format(".1f")))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    g.append("g")
      .call(d3.axisLeft(y).ticks(6).tickSize(0))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    // Fit line
    const line = d3
      .line<RVPoint>()
      .x((d) => x(d.phase))
      .y((d) => y(d.velocity))
      .curve(d3.curveBasis);

    const path = g
      .append("path")
      .datum(fitData)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2);

    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Observed data points with error bars
    if (observedData) {
      const obs = g
        .selectAll(".obs")
        .data(observedData)
        .join("g")
        .attr("class", "obs")
        .attr("opacity", 0);

      obs
        .transition()
        .delay((_, i) => 1500 + i * 50)
        .attr("opacity", 1);

      // Error bars
      obs
        .filter((d) => d.error != null)
        .append("line")
        .attr("x1", (d) => x(d.phase))
        .attr("x2", (d) => x(d.phase))
        .attr("y1", (d) => y(d.velocity - (d.error || 0)))
        .attr("y2", (d) => y(d.velocity + (d.error || 0)))
        .attr("stroke", color)
        .attr("stroke-opacity", 0.3)
        .attr("stroke-width", 1);

      // Points
      obs
        .append("circle")
        .attr("cx", (d) => x(d.phase))
        .attr("cy", (d) => y(d.velocity))
        .attr("r", 3.5)
        .attr("fill", color)
        .attr("stroke", "#030014")
        .attr("stroke-width", 1.5);
    }

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Orbital Phase");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Radial Velocity (m/s)");

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 18)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text(label);
  }, [fitData, observedData, label, color]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
