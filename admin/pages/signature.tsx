import { useRouter } from "next/router";

export default function SignaturePage() {
  const router = useRouter();
  return <div>Signature Page for {router.query.id}</div>;
}
