"use client";

import { useRef, useEffect, useMemo } from "react";
import * as d3 from "d3";

interface MicrolensingCurveProps {
  className?: string;
}

export default function MicrolensingCurve({
  className = "",
}: MicrolensingCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate synthetic microlensing curve
  const data = useMemo(() => {
    const points: { time: number; magnification: number }[] = [];
    for (let t = -40; t <= 40; t += 0.5) {
      // Paczynski curve: A(u) = (u^2 + 2) / (u * sqrt(u^2 + 4))
      const u0 = 0.3; // minimum impact parameter
      const tE = 15; // Einstein crossing time
      const u = Math.sqrt(u0 * u0 + (t / tE) * (t / tE));
      let mag = (u * u + 2) / (u * Math.sqrt(u * u + 4));

      // Add planetary anomaly spike near t=5
      const planetT = 5;
      const planetWidth = 1.5;
      const planetAmp = 1.5;
      const dist = Math.abs(t - planetT);
      if (dist < planetWidth * 3) {
        mag += planetAmp * Math.exp(-0.5 * (dist / planetWidth) ** 2);
      }

      // Add noise
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
    const height = 280;
    const margin = { top: 30, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([-40, 40]).range([0, innerWidth]);
    const yMax = d3.max(data, (d) => d.magnification) || 5;
    const y = d3
      .scaleLinear()
      .domain([0.9, yMax * 1.1])
      .range([innerHeight, 0]);

    // Grid
    g.selectAll(".grid-line")
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
      .call(d3.axisBottom(x).ticks(8).tickSize(0))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickFormat(d3.format(".1f")))
      .attr("color", "#64748b")
      .attr("font-size", "10px")
      .select(".domain")
      .attr("stroke", "#1e293b");

    // Highlight planetary anomaly region
    g.append("rect")
      .attr("x", x(2))
      .attr("y", 0)
      .attr("width", x(8) - x(2))
      .attr("height", innerHeight)
      .attr("fill", "#10b981")
      .attr("fill-opacity", 0.04);

    g.append("text")
      .attr("x", x(5))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#10b981")
      .attr("font-size", "9px")
      .attr("opacity", 0.7)
      .text("Planet signal");

    // Area under curve
    const area = d3
      .area<(typeof data)[0]>()
      .x((d) => x(d.time))
      .y0(innerHeight)
      .y1((d) => y(d.magnification))
      .curve(d3.curveBasis);

    g.append("path")
      .datum(data)
      .attr("d", area)
      .attr("fill", "#10b981")
      .attr("fill-opacity", 0.05);

    // Line
    const line = d3
      .line<(typeof data)[0]>()
      .x((d) => x(d.time))
      .y((d) => y(d.magnification))
      .curve(d3.curveBasis);

    const path = g
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 2);

    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeQuadOut)
      .attr("stroke-dashoffset", 0);

    // Labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Time (days)");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .attr("font-size", "11px")
      .text("Magnification");

    svg
      .append("text")
      .attr("x", margin.left)
      .attr("y", 18)
      .attr("fill", "#e2e8f0")
      .attr("font-size", "13px")
      .attr("font-weight", "600")
      .text("Microlensing Event with Planetary Anomaly");
  }, [data]);

  return (
    <div className={`w-full ${className}`}>
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
