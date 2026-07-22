export default async function VerifyPayment({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { reference } = await searchParams;
  return (
    <div>
      {" "}
      Verified payment
      {reference}
    </div>
  );
}
