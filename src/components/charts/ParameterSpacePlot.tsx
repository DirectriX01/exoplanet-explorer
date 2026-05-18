"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import type { Exoplanet } from "@/lib/types";

const methodColor: Record<string, string> = {
  Transit: "#f59e0b",
  "Radial Velocity": "#6366f1",
  Imaging: "#ec4899",
  Microlensing: "#10b981",
  Astrometry: "#8b5cf6",
};

// Familiar reference worlds. Period in days, radius in Earth radii.
const solarReference: { name: string; period: number; radius: number }[] = [
  { name: "Mercury", period: 88, radius: 0.38 },
  { name: "Earth", period: 365, radius: 1 },
  { name: "Mars", period: 687, radius: 0.53 },
  { name: "Jupiter", period: 4333, radius: 11.2 },
  { name: "Neptune", period: 60182, radius: 3.88 },
];

const PAPER = "#f4ecdc";
const MIST = "rgba(244, 236, 220, 0.55)";
const HAIRLINE = "rgba(244, 236, 220, 0.08)";
const RULE = "rgba(244, 236, 220, 0.2)";

export default function ParameterSpacePlot({
  planets,
}: {
  planets: Exoplanet[];
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current.parentElement;
    const width = container?.clientWidth || 800;
    const height = Math.max(420, Math.min(560, width * 0.55));
    const margin = { top: 36, right: 30, bottom: 56, left: 64 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Only include planets with both period and radius
    const data = planets.filter(
      (p) => p.orbitalPeriodDays != null && p.radiusEarth != null
    );
    if (data.length === 0) return;

    // Combined data for scale domain (planets + solar references) so Earth
    // shows up in frame even if exoplanet catalog skews to giants.
    const allPeriods = [
      ...data.map((p) => p.orbitalPeriodDays!),
      ...solarReference.map((r) => r.period),
    ];
    const allRadii = [
      ...data.map((p) => p.radiusEarth!),
      ...solarReference.map((r) => r.radius),
    ];

    const x = d3
      .scaleLog()
      .domain([
        Math.max(0.1, d3.min(allPeriods) ?? 1),
        (d3.max(allPeriods) ?? 1000) * 1.2,
      ])
      .range([0, innerWidth])
      .nice();
    const y = d3
      .scaleLog()
      .domain([
        Math.max(0.3, d3.min(allRadii) ?? 1),
        (d3.max(allRadii) ?? 10) * 1.2,
      ])
      .range([innerHeight, 0])
      .nice();

    // Background grid (log)
    g.append("g")
      .selectAll("line.grid-x")
      .data(x.ticks(6))
      .join("line")
      .attr("class", "grid-x")
      .attr("x1", (d) => x(d))
      .attr("x2", (d) => x(d))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", HAIRLINE)
      .attr("stroke-dasharray", "1 3");
    g.append("g")
      .selectAll("line.grid-y")
      .data(y.ticks(6))
      .join("line")
      .attr("class", "grid-y")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => y(d))
      .attr("y2", (d) => y(d))
      .attr("stroke", HAIRLINE)
      .attr("stroke-dasharray", "1 3");

    // Axes
    const xAxis = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .tickValues([1, 10, 100, 1000, 10000, 100000])
          .tickFormat((d) => {
            const n = +d;
            if (n >= 365) return `${(n / 365).toFixed(0)} y`;
            return `${n} d`;
          })
          .tickSize(0)
          .tickPadding(10)
      );
    xAxis
      .selectAll("text")
      .attr("fill", MIST)
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px");
    xAxis.select(".domain").attr("stroke", RULE);

    const yAxis = g
      .append("g")
      .call(
        d3
          .axisLeft(y)
          .tickValues([0.5, 1, 2, 5, 10, 20])
          .tickFormat((d) => `${+d} R⊕`)
          .tickSize(0)
          .tickPadding(10)
      );
    yAxis
      .selectAll("text")
      .attr("fill", MIST)
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px");
    yAxis.select(".domain").attr("stroke", RULE);

    // Axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 8)
      .attr("text-anchor", "middle")
      .attr("fill", MIST)
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px")
      .attr("letter-spacing", "0.14em")
      .text("ORBITAL PERIOD · LOG SCALE");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 16)
      .attr("text-anchor", "middle")
      .attr("fill", MIST)
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px")
      .attr("letter-spacing", "0.14em")
      .text("PLANET RADIUS · LOG SCALE");

    // Solar system reference markers — sit behind, soft ring + label
    const ref = g.append("g").attr("class", "ref");
    ref
      .selectAll("g.ref-marker")
      .data(solarReference)
      .join((enter) => {
        const grp = enter.append("g").attr("class", "ref-marker");
        grp
          .append("circle")
          .attr("cx", (d) => x(d.period))
          .attr("cy", (d) => y(d.radius))
          .attr("r", 9)
          .attr("fill", "none")
          .attr("stroke", PAPER)
          .attr("stroke-opacity", 0.22)
          .attr("stroke-dasharray", "2 2");
        grp
          .append("text")
          .attr("x", (d) => x(d.period) + 12)
          .attr("y", (d) => y(d.radius) + 3)
          .attr("fill", "rgba(244, 236, 220, 0.42)")
          .attr("font-family", "var(--font-mono), monospace")
          .attr("font-size", "9px")
          .attr("letter-spacing", "0.1em")
          .text((d) => d.name.toUpperCase());
        return grp;
      });

    // Tooltip
    const tooltip = g
      .append("g")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("pointer-events", "none");
    const tBg = tooltip
      .append("rect")
      .attr("rx", 4)
      .attr("fill", "#07060d")
      .attr("stroke", PAPER)
      .attr("stroke-opacity", 0.25);
    const tName = tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 16)
      .attr("fill", PAPER)
      .attr("font-family", "var(--font-sans), system-ui")
      .attr("font-size", "12px")
      .attr("font-weight", "500");
    const tMeta = tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 32)
      .attr("fill", MIST)
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "10px");
    const tHint = tooltip
      .append("text")
      .attr("x", 10)
      .attr("y", 46)
      .attr("fill", "#ff6b3d")
      .attr("font-family", "var(--font-mono), monospace")
      .attr("font-size", "9px")
      .attr("letter-spacing", "0.18em")
      .text("CLICK TO OPEN");

    function showTip(d: Exoplanet, px: number, py: number) {
      tName.text(d.name);
      const distLY = d.distanceParsecs ? Math.round(d.distanceParsecs * 3.26) : null;
      const periodTxt =
        d.orbitalPeriodDays! < 1
          ? `${(d.orbitalPeriodDays! * 24).toFixed(1)} h`
          : d.orbitalPeriodDays! < 365
            ? `${d.orbitalPeriodDays!.toFixed(1)} d`
            : `${(d.orbitalPeriodDays! / 365).toFixed(1)} y`;
      tMeta.text(
        `${d.radiusEarth!.toFixed(2)} R⊕ · ${periodTxt}${distLY ? ` · ${distLY} ly` : ""}`
      );
      // Size box to longest text
      const nb = (tName.node() as SVGTextElement).getBBox();
      const mb = (tMeta.node() as SVGTextElement).getBBox();
      const w = Math.max(nb.width, mb.width, 110) + 20;
      const h = 56;
      tBg.attr("width", w).attr("height", h);
      const xPos = Math.max(0, Math.min(innerWidth - w, px + 12));
      const yPos = Math.max(0, Math.min(innerHeight - h, py - h - 8));
      tooltip
        .style("opacity", 1)
        .attr("transform", `translate(${xPos}, ${yPos})`);
    }
    function hideTip() {
      tooltip.style("opacity", 0);
    }

    // Planet points
    g.append("g")
      .selectAll("circle.planet")
      .data(data)
      .join("circle")
      .attr("class", "planet")
      .attr("cx", (d) => x(d.orbitalPeriodDays!))
      .attr("cy", (d) => y(d.radiusEarth!))
      .attr("r", 0)
      .attr("fill", (d) => methodColor[d.discoveryMethod] ?? "#f4ecdc")
      .attr("fill-opacity", 0.32)
      .attr("stroke", (d) => methodColor[d.discoveryMethod] ?? "#f4ecdc")
      .attr("stroke-width", 1.6)
      .attr("stroke-opacity", 0.9)
      .style("cursor", "pointer")
      .style("transition", "r 180ms")
      .on("pointerenter", function (e, d) {
        d3.select(this).attr("r", 9).attr("fill-opacity", 0.65);
        const [px, py] = d3.pointer(e, g.node());
        showTip(d, px, py);
      })
      .on("pointermove", function (e, d) {
        const [px, py] = d3.pointer(e, g.node());
        showTip(d, px, py);
      })
      .on("pointerleave", function () {
        d3.select(this).attr("r", 6).attr("fill-opacity", 0.32);
        hideTip();
      })
      .on("click", function (_, d) {
        router.push(`/catalog/${d.slug}`);
      })
      .transition()
      .duration(900)
      .delay((_, i) => i * 18)
      .ease(d3.easeCubicOut)
      .attr("r", 6);

    // Legend in the top-right corner
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right - 130},${margin.top - 4})`);
    Object.entries(methodColor).forEach(([method, color], i) => {
      const row = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 16})`);
      row
        .append("circle")
        .attr("r", 4)
        .attr("fill", color)
        .attr("fill-opacity", 0.4)
        .attr("stroke", color);
      row
        .append("text")
        .attr("x", 10)
        .attr("y", 4)
        .attr("fill", MIST)
        .attr("font-family", "var(--font-mono), monospace")
        .attr("font-size", "9px")
        .attr("letter-spacing", "0.14em")
        .text(method.toUpperCase());
    });
  }, [planets, router]);

  return (
    <div className="w-full">
      <svg ref={svgRef} className="w-full" preserveAspectRatio="xMidYMid meet" />
    </div>
  );
}
