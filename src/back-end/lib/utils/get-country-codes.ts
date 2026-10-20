// src/lib/getCountryCodes.ts
export interface CountryCodeItem {
  code: string;
  country: string;
  flag: string;
  label: string;
}

export async function fetchCountryCodes(): Promise<CountryCodeItem[]> {
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag");
    const data = await res.json();

    const formatted: CountryCodeItem[] = data
      .map((country: any) => {
        const root = country.idd?.root || "";
        const suffix = country.idd?.suffixes?.[0] || "";
        const code = `${root}${suffix}`.trim();

        if (!code) return null;

        return {
          code,
          country: country.cca2,
          flag: country.flag || "",
          label: `${country.flag || ""} ${country.name.common} (${code})`,
        };
      })
      .filter((item: CountryCodeItem | null): item is CountryCodeItem => item !== null)
      .sort((a: CountryCodeItem, b: CountryCodeItem) => a.label.localeCompare(b.label));

    return formatted;
  } catch (error) {
    console.error("Failed to fetch country codes:", error);
    return [];
  }
}