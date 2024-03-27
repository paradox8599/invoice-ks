import css from "styled-jsx/css";
import { VALUES } from "../values";
import Currency from "./currency";

export type ItemData = {
  description: string;
  qty: string;
  unitPrice: string;
  totalCents: number;
};

export default function Items({
  service,
}: {
  service: {
    description: string;
    items: ItemData[];
  };
}) {
  return (
    <div className="items">
      <style>{`
        .items tr {
          break-inside: avoid;
        }
        .items {
          table, th, td {
            border: 1px solid white;
          }
          td {
            text-align: center;
            padding: 0.5rem;
          }
          th {
            padding: 0 0.5rem;
          }
        }
      `}</style>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          borderBottom: "2px solid black",
        }}
      >
        <thead>
          <tr style={{ background: VALUES.colors.bg, color: "white" }}>
            <th>#</th>
            <th style={{ whiteSpace: "pre-line" }}>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {service.items.map((item, i) => (
            <tr
              key={i.toString()}
              style={{ background: i % 2 !== 0 ? "#eee" : "white" }}
            >
              <td>{i + 1}</td>
              <td style={{ textAlign: "start", whiteSpace: "pre-line" }}>
                {item.description}
              </td>
              <td>{item.qty}</td>
              <td>
                <Currency amount={parseFloat(item.unitPrice)} />
              </td>
              <td>
                <Currency amount={item.totalCents} cents />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
