export type Endorsement = {
  brand: string;
  desc: string;
  image: string;
};

export type Sponsor = {
  brand: string;
  desc: string;
  image: string;
};

export const ENDORSEMENTS: Endorsement[] = [
  {
    brand: "Mister Continental World",
    desc: "",
    image:
      "franchise/mister-continental.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    brand: "Miss Continental World",
    desc: "",
    image:
      "franchise/miss-continental.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

  {
    brand: "Mister Universe",
    desc: "",
    image:
      "franchise/mister-universe.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
  {
    brand: "Mr Grand International",
    desc: "",
    image:
      "franchise/Mister-grand.png?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },
];

export const SPONSORS: Sponsor[] = [
  {
    brand: "Em'Kay",
    desc: "The official sponsor for the Elite Glam pageant.",
    image: "sponsors/emkay.jpg?crop=entropy&cs=tinysrgb&fit=min&fm=jpg&w=800&q=80",
  },
  {
    brand: "RELiQ",
    desc: "The official technical and support partner for the Elite Glam pageant.",
    image: "sponsors/reliq.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
  },

];
