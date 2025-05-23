// 这是该路由的布局组件
export default function WorkBlankLayout({ children }: { children: React.ReactNode }) {
  return <section className="h-screen bg-gray-50">{children}</section>;
}
