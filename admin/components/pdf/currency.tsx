export default function Currency({
  amount,
  cents = false,
}: {
  amount: number;
  cents?: boolean;
}) {
  return (
    <>
      {(amount / (cents ? 100 : 1)).toLocaleString("en-US", {
        style: "currency",
        currency: "AUD",
      })}
    </>
  );
}
