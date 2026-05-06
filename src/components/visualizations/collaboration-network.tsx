"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  NetworkData,
  CollaborationNode,
} from "@/src/hooks/api/useCollaboration";

// --- Modular D3 Imports ---
import { select, pointer } from "d3-selection";
import { max } from "d3-array";
import { scaleSqrt } from "d3-scale";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3-force";
import { zoom, zoomIdentity } from "d3-zoom";
import { drag } from "d3-drag";

// --- Types ---
// Extend SimulationNodeDatum to ensure compatibility with d3-force internals
interface D3Node extends CollaborationNode, SimulationNodeDatum {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  value: number;
}

interface Props {
  data: NetworkData;
  height?: number;
}

function numericValue(value: unknown, fallback = 1) {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function nodeColor(node: D3Node, focalId?: string) {
  if (node.id === focalId) return "#ef4444";
  return node.type === "production" ? "#f59e0b" : "#3b82f6";
}

export default function CollaborationNetwork({ data, height = 600 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();
  const t = useTranslations("common");

  // Dimensions state
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  // Tooltip state
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    data: D3Node | null;
  }>({ show: false, x: 0, y: 0, data: null });

  // Resize Observer (Handles responsiveness)
  useEffect(() => {
    if (!containerRef.current) return;
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height: h } =
          containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: h || height });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [height]);

  useEffect(() => {
    if (
      !data ||
      !data.nodes.length ||
      !svgRef.current ||
      dimensions.width === 0
    )
      return;

    const { width, height } = dimensions;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove(); // Clean slate

    // --- DATA PREP ---
    const nodes: D3Node[] = data.nodes.map((d) => ({
      ...d,
      image: d.image ?? d.imageUrl ?? null,
      weight: numericValue(d.weight ?? d.sharedWorks ?? d.count),
    }));
    const links: D3Link[] = data.links.map((d) => ({
      ...d,
      value: numericValue(d.value ?? d.weight ?? d.count),
    }));
    const focalId = nodes[0]?.id;

    // Scales
    const maxWeight = max(nodes, (d) => d.weight || 1) || 10;
    const nodeRadiusScale = scaleSqrt().domain([0, maxWeight]).range([12, 30]);

    // --- GROUPS ---
    const g = svg.append("g");
    const defs = svg.append("defs");
    const linkGroup = g.append("g").attr("class", "links");
    const linkLabelGroup = g.append("g").attr("class", "link-labels");
    const nodeGroup = g.append("g").attr("class", "nodes");
    const labelGroup = g.append("g").attr("class", "labels");

    // --- SIMULATION ---
    const simulation = forceSimulation<D3Node, D3Link>(nodes)
      .force(
        "link",
        forceLink<D3Node, D3Link>(links)
          .id((d) => d.id)
          .distance(100),
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<D3Node>()
          .radius((d) => nodeRadiusScale(d.weight || 1) + 10)
          .iterations(2),
      );

    // --- DRAW ELEMENTS ---
    const linkSelection = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const linkLabelSelection = linkLabelGroup
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d) => d.value)
      .attr("font-size", 9)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#334155")
      .attr("paint-order", "stroke")
      .attr("stroke", "#f8fafc")
      .attr("stroke-width", 4)
      .attr("pointer-events", "none");

    defs
      .selectAll("clipPath")
      .data(nodes)
      .join("clipPath")
      .attr("id", (d) => `network-node-clip-${d.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`)
      .append("circle")
      .attr("r", (d) => Math.max(nodeRadiusScale(d.weight || 1) - 2, 1));

    const nodeSelection = nodeGroup
      .selectAll<SVGGElement, D3Node>("g")
      .data(nodes)
      .join("g")
      .attr("class", "network-node")
      .attr("cursor", "pointer")
      .attr("tabindex", 0) // Make focusable
      .attr("role", "button") // Semantics
      .attr(
        "aria-label",
        (d) => `${d.name}, ${d.type}, ${t("collaborations")}: ${d.weight}`,
      )
      .on("keydown", (event, d) => {
        // Enable keyboard navigation (Enter or Space)
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(
            d.type === "actor" ? `/actors/${d.id}` : `/productions/${d.id}`,
          );
        }
      });

    nodeSelection
      .append("circle")
      .attr("class", "node-fill")
      .attr("r", (d) => nodeRadiusScale(d.weight || 1))
      .attr("fill", (d) => nodeColor(d, focalId));

    nodeSelection
      .filter((d) => !!d.image)
      .append("image")
      .attr("href", (d) => d.image ?? "")
      .attr("xlink:href", (d) => d.image ?? "")
      .attr("clip-path", (d) => `url(#network-node-clip-${d.id.replace(/[^a-zA-Z0-9_-]/g, "-")})`)
      .attr("x", (d) => -nodeRadiusScale(d.weight || 1) + 2)
      .attr("y", (d) => -nodeRadiusScale(d.weight || 1) + 2)
      .attr("width", (d) => Math.max((nodeRadiusScale(d.weight || 1) - 2) * 2, 1))
      .attr("height", (d) => Math.max((nodeRadiusScale(d.weight || 1) - 2) * 2, 1))
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("pointer-events", "none");

    nodeSelection
      .filter((d) => !d.image)
      .append("text")
      .text((d) => d.name.charAt(0).toUpperCase())
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", (d) => Math.max(nodeRadiusScale(d.weight || 1), 12))
      .attr("font-family", "sans-serif")
      .attr("font-weight", 700)
      .attr("fill", "#fff")
      .attr("pointer-events", "none");

    nodeSelection
      .append("circle")
      .attr("class", "node-border")
      .attr("r", (d) => nodeRadiusScale(d.weight || 1))
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    const weightBadgeSelection = nodeSelection.append("g").attr("class", "weight-badge");

    weightBadgeSelection
      .append("circle")
      .attr("cx", (d) => nodeRadiusScale(d.weight || 1) * 0.72)
      .attr("cy", (d) => -nodeRadiusScale(d.weight || 1) * 0.72)
      .attr("r", 9)
      .attr("fill", "#0f172a")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    weightBadgeSelection
      .append("text")
      .text((d) => d.weight ?? 1)
      .attr("x", (d) => nodeRadiusScale(d.weight || 1) * 0.72)
      .attr("y", (d) => -nodeRadiusScale(d.weight || 1) * 0.72)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 8)
      .attr("font-family", "sans-serif")
      .attr("font-weight", 700)
      .attr("fill", "#fff")
      .attr("pointer-events", "none");

    const labelSelection = labelGroup
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.name)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("dy", (d) => nodeRadiusScale(d.weight || 1) + 12)
      .attr("fill", "#1e293b")
      .attr("pointer-events", "none")
      .style("stroke", "white")
      .style("stroke-width", 3)
      .style("paint-order", "stroke");

    // --- ZOOM BEHAVIOR ---
    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        const { transform } = event;
        g.attr("transform", transform.toString());

        // Hide labels when zoomed out
        const k = transform.k;
        labelSelection.attr("display", (d) => {
          if (d.id === focalId) return "block";
          const importance = (d.weight || 1) / maxWeight;
          if (k < 0.4) return importance > 0.5 ? "block" : "none";
          if (k < 0.8) return importance > 0.2 ? "block" : "none";
          return "block";
        });
        linkLabelSelection.attr("display", k < 0.55 ? "none" : "block");
      });

    svg.call(zoomBehavior).on("dblclick.zoom", null);

    // --- ZOOM TO FIT ---
    const zoomToFit = () => {
      setTimeout(() => {
        const bounds = g.node()?.getBBox();
        if (!bounds || bounds.width === 0 || bounds.height === 0) return;

        const parent = svg.node()?.parentElement;
        const fullWidth = parent?.clientWidth || width;
        const fullHeight = parent?.clientHeight || height;

        const midX = bounds.x + bounds.width / 2;
        const midY = bounds.y + bounds.height / 2;

        const scale =
          0.85 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight);
        const translate = [
          fullWidth / 2 - scale * midX,
          fullHeight / 2 - scale * midY,
        ];

        svg
          .transition()
          .duration(750)
          .call(
            zoomBehavior.transform as any,
            zoomIdentity.translate(translate[0], translate[1]).scale(scale),
          );
      }, 300);
    };

    const dragBehavior = drag<SVGGElement, D3Node>()
      .on("start", (e, d) => {
        if (!e.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (e, d) => {
        d.fx = e.x;
        d.fy = e.y;
      })
      .on("end", (e, d) => {
        if (!e.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    // Apply drag to the correctly typed selection
    nodeSelection.call(dragBehavior);

    nodeSelection
      .on("click", (e, d) => {
        e.stopPropagation();
        router.push(
          d.type === "actor" ? `/actors/${d.id}` : `/productions/${d.id}`,
        );
      })
      .on("mouseover", (event, d) => {
        linkSelection
          .attr("stroke", (l) =>
            l.source === d || l.target === d ? "#ef4444" : "#e2e8f0",
          )
          .attr("stroke-opacity", (l) =>
            l.source === d || l.target === d ? 1 : 0.1,
          );

        select(event.currentTarget)
          .select<SVGCircleElement>(".node-border")
          .attr("stroke", "#1f2937")
          .attr("stroke-width", 3);
        labelSelection
          .filter((n) => n === d)
          .attr("display", "block")
          .style("font-weight", "bold");

        const [x, y] = pointer(event, document.body);
        setTooltip({ show: true, x, y, data: d });
      })
      .on("mouseout", (event, d) => {
        linkSelection.attr("stroke", "#cbd5e1").attr("stroke-opacity", 0.6);
        select(event.currentTarget)
          .select<SVGCircleElement>(".node-border")
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
        labelSelection.filter((n) => n === d).style("font-weight", "normal");
        setTooltip((prev) => ({ ...prev, show: false }));
      });

    // --- TICK ---
    simulation.on("tick", () => {
      linkSelection
        .attr("x1", (d) => (d.source as D3Node).x!)
        .attr("y1", (d) => (d.source as D3Node).y!)
        .attr("x2", (d) => (d.target as D3Node).x!)
        .attr("y2", (d) => (d.target as D3Node).y!);

      linkLabelSelection
        .attr("x", (d) => ((d.source as D3Node).x! + (d.target as D3Node).x!) / 2)
        .attr("y", (d) => ((d.source as D3Node).y! + (d.target as D3Node).y!) / 2);

      nodeSelection.attr("transform", (d) => `translate(${d.x},${d.y})`);
      labelSelection.attr("x", (d) => d.x!).attr("y", (d) => d.y!);
    });

    zoomToFit();

    return () => {
      simulation.stop();
    };
  }, [data, dimensions, router]);

  const handleExport = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "network_export.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] rounded-xl bg-slate-50 overflow-hidden shadow-sm"
    >
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleExport}
          className="bg-secondary px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-sm font-medium hover:bg-secondary/50 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t("exportSvg")}
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-secondary/95 p-4 rounded-xl shadow-md border border-gray-200 text-xs pointer-events-none backdrop-blur-sm w-48">
        <div className="font-bold text-foreground mb-3 text-sm">
          {t("legend")}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-border shadow-sm"></span>
            <span>{t("focalActor")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/500 border border-border shadow-sm"></span>
            <span>{t("collaborator")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-border shadow-sm"></span>
            <span>{t("production")}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border text-muted-foreground italic">
          {t("zoomInstructions")}
        </div>
      </div>

      <svg
        ref={svgRef}
        className="w-full h-full touch-none block"
        width="100%"
        height="100%"
        role="graphics-document"
        aria-label="Force directed graph showing actor collaborations"
      >
        <title>{t("collaborationNetworkGraph")}</title>
      </svg>

      {tooltip.show && tooltip.data && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-15px] text-sm"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold">{tooltip.data.name}</div>
          <div className="text-xs text-gray-400">
            {tooltip.data.type === "actor" ? t("actor") : t("production")}
          </div>
          <div className="mt-1 pt-1 border-t border-gray-700 font-mono text-xs">
            {t("collaborations")}: {tooltip.data.weight}
          </div>
          <div className="mt-2">
            {tooltip.data.image ? (
              <img
                src={tooltip.data.image}
                alt={tooltip.data.name}
                className="mt-2 w-16 h-16 object-cover rounded"
              />
            ) : (
              <div className="mt-2 w-16 h-16 bg-gray-700 rounded flex items-center justify-center text-xs">
                {t("noImage")}
              </div>
            )}
          </div>
          <div className="text-muted-foreground text-xs mt-1 capitalize">
            {tooltip.data.type}
          </div>
        </div>
      )}
    </div>
  );
}
