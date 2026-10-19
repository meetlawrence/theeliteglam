import { NextResponse } from "next/server";

interface CountriesNowCountry {
  name?: string;
  code?: string;
  dial_code?: string;
}

interface CountryOption {
  name: string;
  code: string;
  flag: string;
  callingCodes: string[];
}

function getFlagEmoji(countryCode: string) {
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((character) => 0x1f1e6 + character.charCodeAt(0) - 65),
  );
}

export async function GET() {
  try {
    const response = await fetch("https://countriesnow.space/api/v0.1/countries/codes", {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`Country provider returned HTTP ${response.status}.`);
    }

    const result: unknown = await response.json();
    if (
      !result ||
      typeof result !== "object" ||
      !("error" in result) ||
      result.error !== false ||
      !("data" in result) ||
      !Array.isArray(result.data)
    ) {
      throw new Error("Country provider returned an invalid response.");
    }

    const countries = (result.data as CountriesNowCountry[])
      .flatMap((country): CountryOption[] => {
        const name = country.name?.trim();
        const code = country.code?.trim().toUpperCase();
        const callingCode = country.dial_code?.replace(/\s+/g, "");

        if (
          !name ||
          !code ||
          !/^[A-Z]{2}$/.test(code) ||
          !callingCode ||
          !/^\+\d+$/.test(callingCode)
        ) {
          return [];
        }

        return [{
          name,
          code,
          flag: getFlagEmoji(code),
          callingCodes: [callingCode],
        }];
      })
      .sort((left, right) => left.name.localeCompare(right.name));

    if (countries.length < 100) {
      throw new Error("Country provider returned an incomplete country list.");
    }

    return NextResponse.json(
      { success: true, data: countries },
      { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    console.error("Failed to load country and calling-code list:", error);
    return NextResponse.json(
      { success: false, message: "Country and calling-code options are temporarily unavailable." },
      { status: 502 },
    );
  }
}
