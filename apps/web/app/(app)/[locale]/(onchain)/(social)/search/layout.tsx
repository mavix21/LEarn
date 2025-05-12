export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-start-1 row-start-1 border-x lg:col-start-2 lg:row-start-2">
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}
