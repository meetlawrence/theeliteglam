import { ApplicationForm } from "@/app/components/register/ApplicationForm";
import { contestantTransactionRepo } from "@/back-end/models/contestant-transaction-model";
import { contestantModel } from "@/back-end/models/contestant-model";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ContestantsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ContestantsPage({ searchParams }: ContestantsPageProps) {
  const resolvedParams = await searchParams;
  const referenceParam = resolvedParams.reference ?? resolvedParams.trxref;
  const reference = Array.isArray(referenceParam) ? referenceParam[0] : referenceParam;

  let isValid = false;
  let errorTitle = "Access Restricted";
  let errorMessage = "";

  if (reference) {
    const transaction = await contestantTransactionRepo.findByreference(reference);

    if (!transaction || transaction.status !== "SUCCESS") {
      errorTitle = "Unverified Reference";
      errorMessage = "We could not verify a successful payment for this transaction reference. Access to the contestant application is restricted.";
    } else {
      const existingContestant = await contestantModel.findByreference(reference);

      if (existingContestant) {
        errorTitle = "Reference Already Used";
        errorMessage = "This payment reference has already been used to submit an application. Each reference can only be registered once.";
      } else {
        isValid = true;
      }
    }
  } else {
    errorTitle = "Missing Reference";
    errorMessage = "No payment reference was provided in your request. Please return to the registration page to initiate your entry.";
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5EDD6] flex items-center justify-center p-6">
      {isValid && reference ? (
        <ApplicationForm reference={reference} />
      ) : (
        <div className="max-w-[520px] w-full bg-[#121212] border border-[#C9A84C]/20 p-8 sm:p-10 text-center relative overflow-hidden">
            
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C96B5D]/10 border border-[#C96B5D]/30 flex items-center justify-center shadow-[0_0_30px_rgba(201,107,93,0.15)]">
            <ShieldAlert size={28} className="text-[#C96B5D]" />
          </div>

          <div className="font-['Raleway',sans-serif] text-[0.6rem] tracking-[0.35em] text-[#C96B5D] uppercase mb-2">
            Application Locked
          </div>

          <h1 className="font-['Cinzel',serif] text-[clamp(1.4rem,2.5vw,1.8rem)] text-[#F5EDD6] tracking-[0.04em] mb-4">
            {errorTitle}
          </h1>

          <p className="font-['Raleway',sans-serif] text-[0.85rem] text-[#9A8C6A] leading-[1.7] mb-8">
            {errorMessage}
          </p>

          <div className="pt-6 border-t border-[#C9A84C]/10 flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full py-3.5 px-6 bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-[#080808] font-['Cinzel',serif] text-[0.75rem] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 transition-all hover:brightness-110"
            >
              <ArrowLeft size={14} />
              Return to Registration
            </Link>
            
            <a
              href="mailto:support@theeliteglam.com"
              className="font-['Raleway',sans-serif] text-[0.72rem] text-[#5A5040] hover:text-[#9A8C6A] transition-colors"
            >
              Need assistance? Contact support@theeliteglam.com
            </a>
          </div>
        </div>
      )}
    </main>
  );
}