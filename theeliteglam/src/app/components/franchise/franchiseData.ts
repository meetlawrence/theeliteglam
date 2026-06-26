export type Endorsement = {
  brand: string;
  initials: string;
  image: string;
};

export type Sponsor = {
  name: string;
  desc: string;
  logo: string;
};

export const ENDORSEMENTS: Endorsement[] = [
  {
    brand: "Mister Universe",
    initials: "MrU",
    image:
      "https://images.unsplash.com/photo-1541554685626-8016b713c293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    brand: "Miss Continental World",
    initials: "MCW",
    image:
      "https://images.unsplash.com/photo-1706564373290-3870ef23993f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    brand: "Mister Continental World",
    initials: "MrCW",
    image:
      "https://images.unsplash.com/photo-1546572797-e8c933a75a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    brand: "Grand International",
    initials: "GI",
    image:
      "https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
];

export const SPONSORS: Sponsor[] = [
  {
    name: "Em'Kay",
    desc: "The official sponsor for the Elite Glam pageant.",
    logo: "EK",
  },
  {
    name: "meetLawrence Global Solutions",
    desc: "The official technical and support partner for the Elite Glam pageant.",
    logo: "mLGS",
  }, 
];
