"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

export default function PositionTrace({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  const data = useMemo(() => {
    const points: { ra: number; dec: number }[] = [];
    for (let t = 0; t < Math.PI * 6; t += 0.05) {
      const wobbleRA = Math.sin(t) * 0.4;
      const wobbleDec = Math.cos(t * 1.3) * 0.25;
      const properMotionRA = t * 0.12;
      const properMotionDec = Math.sin(t * 0.08) * 0.3;
      points.push({
        ra: wobbleRA + properMotionRA,
        dec: wobbleDec + properMotionDec,
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
    const height = 280;
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xExtent = d3.extent(data, (d) => d.ra) as [number, number];
    const yExtent = d3.extent(data, (d) => d.dec) as [number, number];

    const x = d3.scaleLinear().domain(xExtent).range([0, innerWidth]).nice();
    const y = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]).nice();

    // Grid
    g.selectAll(".grid-x")
      .data(x.ticks(5))
      .join("line")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.03);

    g.selectAll(".grid-y")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", "#ffffff")
      .attr("stroke-opacity", 0.03);

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(0))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    // Path
    const line = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.ra))
      .y((d) => y(d.dec))
      .curve(d3.curveBasis);

    const path = g
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7);

    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(3000)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);

    // Start and end markers
    g.append("circle")
      .attr("cx", x(data[0].ra))
      .attr("cy", y(data[0].dec))
      .attr("r", 4)
      .attr("fill", "#8b5cf6");

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Right Ascension (mas)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Declination (mas)");

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 18)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text("Stellar Position Wobble");
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
