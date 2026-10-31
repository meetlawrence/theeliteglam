export interface CountryCodeItem {
  code: string;
  country: string;
  flag: string;
  label: string;
}

interface CountryApiResponse {
  cca2: string;
  flag?: string;
  idd?: {
    root?: string;
    suffixes?: string[];
  };
  name: {
    common: string;
  };
}

export async function fetchCountryCodes(): Promise<CountryCodeItem[]> {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag",
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch country codes: ${response.status} ${response.statusText}`,
    );
  }

  const countries = (await response.json()) as CountryApiResponse[];

  return countries
    .flatMap((country): CountryCodeItem[] => {
      const root = country.idd?.root ?? "";
      const suffix = country.idd?.suffixes?.[0] ?? "";
      const code = `${root}${suffix}`.trim();

      if (!code) {
        return [];
      }

      const flag = country.flag ?? "";
      return [
        {
          code,
          country: country.cca2,
          flag,
          label: `${flag} ${country.name.common} (${code})`,
        },
      ];
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}
