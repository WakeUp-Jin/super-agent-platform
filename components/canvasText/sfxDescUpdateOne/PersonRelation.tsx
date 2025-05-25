'use client';
import React, { useEffect, useRef } from 'react';
import { Graph as G6Graph } from '@antv/g6';

const personRelation = [
  {
    subject: '卡尔·马克思',
    relation: '妻子',
    object: '燕妮·冯·韦斯特法伦',
    type: '家庭',
  },
  {
    subject: '卡尔·马克思',
    relation: '老友兼同事',
    object: '弗里德里希·恩格斯',
    type: '朋友',
  },
  {
    subject: '卡尔·马克思',
    relation: '朋友',
    object: '威廉·李卜克内西',
    type: '朋友',
  },
  {
    subject: '弗里德里希·恩格斯',
    relation: '朋友',
    object: '卡尔·马克思',
    type: '朋友',
  },
];

// 提取唯一的节点
const nodesSet = new Set();
personRelation.forEach((item) => {
  nodesSet.add(item.subject);
  nodesSet.add(item.object);
});

const nodes = Array.from(nodesSet).map((name) => ({
  id: name,
  label: name,
  //   type: name,
  size: 30,
  style: { labelText: name },
}));

// ① 预处理：把同一对节点的多重关系合并成一个 label
const seen = new Map<string, Set<string>>();

const edges = personRelation.reduce<any[]>((arr, item) => {
  const pair = [item.subject, item.object].sort().join('--');
  const set = seen.get(pair) ?? new Set<string>();
  set.add(item.relation);
  seen.set(pair, set);

  if (set.size === 1) {
    // 首次出现，先占坑
    arr.push({
      id: pair,
      source: item.subject,
      target: item.object,
      style: {},
    });
  }
  return arr;
}, []);

// ② 填 label：把所有关系拼成"朋友 / 老友 / ..."
edges.forEach((e) => {
  const rels = Array.from(seen.get(e.id)!);
  e.style = {
    labelText: rels[0],
    labelPlacement: 'center',
  };
});

const PersonRelation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 初始化图表
    const graph = new G6Graph({
      container: containerRef.current,
      width: 500,
      // autoFit: 'view',
      // autoResize: true,
      layout: {
        type: 'd3-force',
        /* 1. 排斥力（manyBody）——值越负，推力越大 */
        manyBody: { strength: -100 }, // :contentReference[oaicite:0]{index=0}
        /* 2. 弹簧力（link）——边越长，拉力越大 */
        link: { distance: 130, strength: 0.5 }, // :contentReference[oaicite:1]{index=1}
        /* 3. 避免节点重叠（基于节点直径做碰撞） */
        nodeSize: 40,
        velocityDecay: 0.2, // 摩擦小，惯性足
        // preventOverlap: true, // 同名布尔开关
        // /* 4. 迭代衰减 —— 越小越"持久晃荡"，越大越快停 */
        // alphaDecay: 0.03,
        // alphaMin: 0.001,
        // 配置中心力 - 保持图形在画布中心
        center: {
          strength: 0.05,
        },
      },
      node: {
        type: 'circle',
        style: {
          size: (d: any) => d.size,
        },
      },
      data: {
        nodes,
        edges,
      },
      behaviors: [
        'drag-canvas', // 使用默认配置启用画布拖拽
        // 'zoom-canvas', // 使用默认配置启用画布缩放
        'drag-element-force',
        {
          type: 'zoom-canvas',
          key: 'wheel-zoom',
          trigger: ['Control'], // ← 仅 Ctrl+滚轮 才缩放
          sensitivity: 1.2, // 灵敏度可随意调
          zoomRange: [0.3, 4], // 最小 30%，最大 400%
        },
      ],
    } as any);

    graph.render();

    // 将图表实例保存到 ref
    graphRef.current = graph;
  }, []);

  return <div className="h-[300px]" ref={containerRef} />;
};

export default PersonRelation;
