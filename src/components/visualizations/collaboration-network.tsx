"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3";
import { NetworkData, CollaborationNode } from "@/src/hooks/api/useCollaboration";

// --- Types ---
interface D3Node extends CollaborationNode {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  value: number;
}

interface Props {
  data: NetworkData;
  height?: number;
}

export default function CollaborationNetwork({ data, height = 600 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

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
        const { width, height: h } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: h || height });
      }
    };
    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [height]);

  useEffect(() => {
    if (!data || !data.nodes.length || !svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clean slate

    // --- DATA PREP ---
    const nodes: D3Node[] = data.nodes.map(d => ({ ...d }));
    const links: D3Link[] = data.links.map(d => ({ ...d }));

    // Scales
    const maxWeight = d3.max(nodes, d => d.weight || 1) || 10;
    const nodeRadiusScale = d3.scaleSqrt()
      .domain([0, maxWeight])
      .range([4, 25]);

    // --- GROUPS ---
    const g = svg.append("g");
    const linkGroup = g.append("g").attr("class", "links");
    const nodeGroup = g.append("g").attr("class", "nodes");
    const labelGroup = g.append("g").attr("class", "labels");

    // --- SIMULATION ---
    const simulation = d3.forceSimulation<D3Node, D3Link>(nodes)
      .force("link", d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => nodeRadiusScale(d.weight || 1) + 10).iterations(2));

    // --- DRAW ELEMENTS ---
    const link = linkGroup.selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#cbd5e1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", d => Math.sqrt(d.value));

    //  Explicitly type the selection so it matches the DragBehavior
    const node = nodeGroup.selectAll<SVGCircleElement, D3Node>("circle")
      .data(nodes)
      .join("circle")
      .attr("r", d => nodeRadiusScale(d.weight || 1))
      .attr("fill", d => {
        if (d.id === nodes[0].id) return "#ef4444";
        return d.type === "production" ? "#f59e0b" : "#3b82f6";
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .attr("cursor", "pointer")
      .attr("tabindex", 0) // Make focusable
      .attr("role", "button") // Semantics
      .attr("aria-label", d => `${d.name}, ${d.type}`) // Screen reader label
      .on("keydown", (event, d) => {
        // Enable keyboard navigation (Enter or Space)
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(d.type === "actor" ? `/actors/${d.id}` : `/productions/${d.id}`);
        }
      });

    const label = labelGroup.selectAll("text")
      .data(nodes)
      .join("text")
      .text(d => d.name)
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle")
      .attr("dy", d => nodeRadiusScale(d.weight || 1) + 12)
      .attr("fill", "#1e293b")
      .attr("pointer-events", "none")
      .style("stroke", "white")
      .style("stroke-width", 3)
      .style("paint-order", "stroke");

    // --- ZOOM BEHAVIOR ---
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event) => {
        const { transform } = event;
        g.attr("transform", transform);

        //  Hide labels when zoomed out
        const k = transform.k;
        label.attr("display", (d) => {
          if (d.id === nodes[0].id) return "block";
          const importance = (d.weight || 1) / maxWeight;
          if (k < 0.4) return importance > 0.5 ? "block" : "none";
          if (k < 0.8) return importance > 0.2 ? "block" : "none";
          return "block";
        });
      });

    svg.call(zoom).on("dblclick.zoom", null);

    // --- ZOOM TO FIT ---
    // Calculates bounding box after simulation settles slightly
    const zoomToFit = () => {
      setTimeout(() => {
        const bounds = g.node()?.getBBox();
        if (!bounds || bounds.width === 0 || bounds.height === 0) return;

        const parent = svg.node()?.parentElement;
        const fullWidth = parent?.clientWidth || width;
        const fullHeight = parent?.clientHeight || height;

        const midX = bounds.x + bounds.width / 2;
        const midY = bounds.y + bounds.height / 2;

        const scale = 0.85 / Math.max(bounds.width / fullWidth, bounds.height / fullHeight);
        const translate = [
          fullWidth / 2 - scale * midX,
          fullHeight / 2 - scale * midY
        ];

        svg.transition()
          .duration(750)
          .call(
            zoom.transform as any,
            d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
          );
      }, 300);
    };

    // --- INTERACTIONS ---

    // Drag Behavior typed correctly for SVGCircleElement
    const drag = d3.drag<SVGCircleElement, D3Node>()
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
    node.call(drag);

    node
      .on("click", (e, d) => {
        e.stopPropagation();
        router.push(d.type === "actor" ? `/actors/${d.id}` : `/productions/${d.id}`);
      })
      .on("mouseover", (event, d) => {
        link.attr("stroke", l => (l.source === d || l.target === d) ? "#ef4444" : "#e2e8f0")
          .attr("stroke-opacity", l => (l.source === d || l.target === d) ? 1 : 0.1);

        d3.select(event.currentTarget).attr("stroke", "#1f2937").attr("stroke-width", 3);
        label.filter(n => n === d).attr("display", "block").style("font-weight", "bold");

        const [x, y] = d3.pointer(event, document.body);
        setTooltip({ show: true, x, y, data: d });
      })
      .on("mouseout", (event, d) => {
        link.attr("stroke", "#cbd5e1").attr("stroke-opacity", 0.6);
        d3.select(event.currentTarget).attr("stroke", "#fff").attr("stroke-width", 2);
        label.filter(n => n === d).style("font-weight", "normal");
        setTooltip(prev => ({ ...prev, show: false }));
      });

    // --- TICK ---
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as D3Node).x!)
        .attr("y1", d => (d.source as D3Node).y!)
        .attr("x2", d => (d.target as D3Node).x!)
        .attr("y2", d => (d.target as D3Node).y!);

      node.attr("cx", d => d.x!).attr("cy", d => d.y!);
      label.attr("x", d => d.x!).attr("y", d => d.y!);
    });

    zoomToFit();

    return () => { simulation.stop(); };
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
    <div ref={containerRef} className="relative w-full h-full min-h-[500px]  rounded-xl bg-slate-50 overflow-hidden shadow-sm">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleExport}
          className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Export SVG
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-white/95 p-4 rounded-xl shadow-md border border-gray-200 text-xs pointer-events-none backdrop-blur-sm w-48">
        <div className="font-bold text-gray-900 mb-3 text-sm">Legend</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></span><span>Focal Actor</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></span><span>Collaborator</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm"></span><span>Production</span></div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 text-gray-600 italic">
          Scroll to zoom. Labels hide automatically based on zoom level.
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
        <title>Collaboration Network Graph</title>
      </svg>

      {tooltip.show && tooltip.data && (
        <div
          className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-15px] text-sm"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-bold">{tooltip.data.name}</div>
          <div className="text-gray-400 text-xs mt-1 capitalize">{tooltip.data.type}</div>
          <div className="mt-1 pt-1 border-t border-gray-700 font-mono text-xs">Strength: {tooltip.data.weight}</div>
        </div>
      )}
    </div>
  );
}