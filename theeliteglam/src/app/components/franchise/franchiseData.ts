export type Endorsement = {
  brand: string;
  desc: string;
  gender: "male" | "female";
  image: string;
};

export type Sponsor = {
  brand: string;
  desc: string;
  image: string;
};

export const ENDORSEMENTS: Endorsement[] = [
  {
    brand: "Miss Continental World",
    desc: "",
    gender: "female",
    image:
      "franchise/miss-continental.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  { brand: "Miss Friendship International",
    desc: "",
    gender: "female",
    image:
      "franchise/miss-friendship.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  {
    brand: "Mister Continental World",
    desc: "",
    gender: "male",
    image:
      "franchise/mister-continental.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  { brand: "Mister Friendship International",
    desc: "",
    gender: "male",
    image:
      "franchise/mister-friendship.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  {
    brand: "Mister Universe",
    desc: "",
    gender: "male",
    image:
      "franchise/mister-universe.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  {
    brand: "Mister Grand International",
    desc: "",
    gender: "male",
    image:
      "franchise/mister-grand.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  
];

export const SPONSORS: Sponsor[] = [
  {
    brand: "Em'Kay",
    desc: "The official sponsor for the Elite Glam pageant.",
    image: "sponsors/emkay.webp?crop=entropy&cs=tinysrgb&fit=min&fm=jpg&w=800&q=80",
  },
  {
    brand: "meetLawrence",
    desc: "The official technical and support partner for the Elite Glam pageant.",
    image: "sponsors/reliq.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

];
