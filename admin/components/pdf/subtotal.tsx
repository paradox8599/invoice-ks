import Currency from "./currency";

export default function SubTotal({
  service,
}: {
  service: { totalCents: number; excludeGST: boolean };
}) {
  return (
    <div className="total">
      <style>{".total { .amount { padding: 1rem; } }"}</style>
      <div style={{ textAlign: "end" }}>
        <p>
          <span>Sub Total:</span>
          <span className="amount">
            <Currency amount={service.totalCents} cents />
          </span>
        </p>
        <p>
          <span>GST(10%):</span>
          <span className="amount">
            <Currency
              amount={service.totalCents * (service.excludeGST ? 0 : 0.1)}
              cents
            />
          </span>
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            style={{
              borderTop: "1px solid black",
              paddingLeft: "4rem",
              paddingTop: "1rem",
              fontWeight: "bold",
            }}
          >
            <span>Total:</span>

            <span className="amount">
              <Currency
                amount={service.totalCents * (service.excludeGST ? 1 : 1.1)}
                cents
              />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
