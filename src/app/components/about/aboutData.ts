import { createElement } from "react";
import { Eye, Heart, Sparkles, Star } from "lucide-react";

export const BANNER_IMG = "/banners/img1.jpg";

export const BANNER_VIDEO = "/banners/logo1.webm";

export const CEO_IMG =
  "images/oku.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80";

export const MAIDEN_IMGS = [
  "/maiden/1.webp",
  "/maiden/2.webp",
  "/maiden/3.webp",
];

export const VALUES = [
  {
    icon: createElement(Star, { size: 22 }),
    title: "Excellence",
    body: "We uphold the highest standards in every aspect of our organization, competition, and production.",
  },
  {
    icon: createElement(Heart, { size: 22 }),
    title: "Inclusivity",
    body: "The EliteGlam belongs to everyone who carries grace, purpose, and ambition.",
  },
  {
    icon: createElement(Eye, { size: 22 }),
    title: "Authenticity",
    body: "We celebrate genuine stories, real talent, and beauty that cannot be manufactured.",
  },
  {
    icon: createElement(Sparkles, { size: 22 }),
    title: "Impact",
    body: "Beyond the crown, we create opportunities for advocacy, leadership, and community transformation.",
  },
];

export const FAQS = [
  {
    q: "Who is eligible to participate in The Elite Glam?",
    a: "The Elite Glam is open to male and female contestants aged 18–35 from any part of Nigeria or the Nigerian diaspora. We welcome all tribes, backgrounds, and body types.",
  },
  {
    q: "How do I apply for the pageant?",
    a: "Applications open on October 1, 2026 via our official website. You will be required to submit a profile, portfolio, and a personal statement. Virtual auditions follow in December 2026.",
  },
  {
    q: "What are the prizes for winners?",
    a: "Each of the two winners (male and female) receives a cash prize of ₦2,000,000, a brand endorsement package, a modelling contract, and an ambassador role with The Elite Glam for one year.",
  },
  {
    q: "Where will the Grand Finale be held?",
    a: "The Grand Finale of Season 2 will be held in Lagos, Nigeria in May 2027. The exact venue and date will be announced to registered contestants and the public closer to the event.",
  },
  {
    q: "How can my brand become a sponsor?",
    a: "We offer a range of partnership tiers from Title Sponsor to Gift Partners. Please use the 'Partner With Us' button on the homepage or email us directly at info@theeliteglam.com.",
  },
  {
    q: "Is The Elite Glam affiliated with international pageant organisations?",
    a: "Yes. The Elite Glam is endorsed by and maintains partnerships with leading international pageant bodies including Miss Universe, Miss World, Mister Universe, and Mister World organisations.",
  },
];

export const MISSION_VISION_CARDS = [
  {
    tag: "Our Mission",
    heading: "To Crown Purpose,\nNot Just Beauty",
    body: "The EliteGlam exists to identify and celebrate individuals who demonstrate that beauty is inseparable from intelligence, character, leadership, and a commitment to positive change. We create a platform where every voice matters, every story deserves to be heard, and every contestant has the opportunity to make a lasting impact.",
  },
  {
    tag: "Our Vision",
    heading: "A Global Standard,\nBorn in Africa",
    body: "Our vision is to establish The EliteGlam as Africa’s leading pageant platform, setting a new benchmark for excellence while showcasing the richness, talent, and ambition of the African continent to the world.",
  },
];

export const WINNERS = [
  {
    name: "Oma Osele",
    title: "Miss Elite Glam 2025",
    state: "",
    age: "28",
    occupation: "Medical Scientist",
    advocacy: "Pulse Global",
    quote: "Caring for people...",
    image: "images/img1.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
  {
    name: "Umana Sambo",
    title: "Mister Elite Glam 2025",
    state: "",
    age: "35",
    occupation: "Department of Tourism Officer",
    advocacy: "Youth Tech Empowerment",
    quote: "Beauty is the courage to stand for something greater than yourself. I carry that with every step.",
    image: "images/?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
];

export const RUNNERS_UP = [
  
  {
    name: "Emmanuel Oliver",
    title: "Mr.Universe",
    state: "",
    occupation: "Civil Engineer & Footwear Artisan",
    image: "maiden/oliver.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
  {
    name: "Bernard Williams",
    title: "Mister Grand",
    state: "",
    occupation: "Medical Laboratory Scientist",
    image: "maiden/bernard.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
];
