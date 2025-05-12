export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-start-1 col-end-3 row-start-2 border-x">
      <div>{children}</div>
    </div>
  );
}
