import { PersonRelationFormat } from '@/lib/interface/viewInterface';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { useViewBoardStore } from '@/lib/store/useViewBoardStore';
import { useEffect, useState } from 'react';

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

export function PersonRelationTable() {
  const { board } = useViewBoardStore();
  const [personRelation, setPersonRelation] = useState<PersonRelationFormat[]>([]);

  useEffect(() => {
    setPersonRelation(board?.personRelation ?? []);
  }, [board]);

  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">主体</TableHead>
          <TableHead>关系</TableHead>
          <TableHead>客体</TableHead>
          <TableHead>类型</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {personRelation.map((invoice, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{invoice.subject}</TableCell>
            <TableCell>{invoice.relation}</TableCell>
            <TableCell>{invoice.object}</TableCell>
            <TableCell className="">{invoice.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
