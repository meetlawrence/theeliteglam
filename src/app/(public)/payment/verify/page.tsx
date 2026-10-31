import { connection } from "next/server";
import VerifyPaymentClient from "./VerifyPaymentClient";

export default async function VerifyPaymentPage() {
  await connection();

  return <VerifyPaymentClient />;
}
