export function Title({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "1.2rem",
        margin: "10px,0,10px,0",
        fontWeight: "600",
      }}
    >
      {children}
    </p>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "5px,0,5px,0" }}>{children}</p>;
}
