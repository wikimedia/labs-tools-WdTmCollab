'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: 'actor' | 'production';
  count?: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface CollaborationNetworkProps {
  actorId: string;
  collaborators: any[];
}

export default function CollaborationNetwork({ actorId, collaborators }: CollaborationNetworkProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!collaborators.length || !svgRef.current) return;

    // Transform data for D3
    const nodes: Node[] = [
      { id: actorId, name: 'Main Actor', type: 'actor' },
      ...collaborators.map(c => ({
        id: c.id,
        name: c.name,
        type: 'actor' as 'actor',
        count: c.collaborationCount
      }))
    ];

    const links: Link[] = collaborators.map(c => ({
      source: actorId,
      target: c.id,
      value: c.collaborationCount
    }));

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up the simulation
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create SVG elements
    const svg = d3.select(svgRef.current);

    // Add links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.value));

    // Add nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', (d) => (d.count ? Math.sqrt(d.count) * 3 + 5 : 10))
      .attr('fill', (d) => d.id === actorId ? '#ff6b6b' : '#4dabf7')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text((d) => d.name)
      .attr('font-size', 12)
      .attr('dx', 15)
      .attr('dy', 4);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      label
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [actorId, collaborators]);

  return (
    <div className="w-full h-full border rounded-lg overflow-hidden bg-white">
      <svg ref={svgRef} width="100%" height="100%"></svg>
    </div>
  );
}