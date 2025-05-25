// PersonGraph.tsx
import ForceGraph2D from 'react-force-graph-2d';

const personRelation = [
  { subject: '卡尔·马克思', relation: '妻子', object: '燕妮·冯·韦斯特法伦', type: '家庭' },
  { subject: '卡尔·马克思', relation: '老友兼同事', object: '弗里德里希·恩格斯', type: '朋友' },
  { subject: '卡尔·马克思', relation: '朋友', object: '威廉·李卜克内西', type: '朋友' },
  { subject: '弗里德里希·恩格斯', relation: '朋友', object: '卡尔·马克思', type: '朋友' },
];

// 1️⃣ 把数据转为 nodes / links 结构
const names = Array.from(new Set(personRelation.flatMap((r) => [r.subject, r.object])));
const data = {
  nodes: names.map((id) => ({ id, name: 'name1' })),
  links: personRelation.map((r) => ({
    source: r.subject,
    target: r.object,
    // linkLabel: r.relation,
    type: r.type,
  })),
};

// 2️⃣ 在组件里渲染
export default function PersonGraph() {
  return (
    <ForceGraph2D
      graphData={data}
      nodeAutoColorBy="id"
      nodeLabel="id"
      linkDirectionalParticles={2} // 关掉即可无交互
      linkDirectionalParticleSpeed={0.005} // 关掉即可无交互
      width={600}
      height={300}
    />
  );
}
