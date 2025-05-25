import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const invoices = [
  {
    name: '马克思',
    age: '无',
    gender: '男性',
    identity: '思想家、革命家',
    relationship: '已婚',
  },
  {
    name: '弗里德里希·恩格斯',
    age: '无',
    gender: '男性',
    identity: '马克思的老友兼同事',
    relationship: '无',
  },
];

export function PersonFeature() {
  return (
    <Table>
      {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">角色</TableHead>
          <TableHead>年龄</TableHead>
          <TableHead>性别</TableHead>
          <TableHead>身份</TableHead>
          <TableHead>关系</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.name}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.age}</TableCell>
            <TableCell>{invoice.gender}</TableCell>
            <TableCell className="">{invoice.identity}</TableCell>
            <TableCell className="">{invoice.relationship}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
