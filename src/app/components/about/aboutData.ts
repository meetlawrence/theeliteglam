import { createElement } from "react";
import { Eye, Heart, Sparkles, Star } from "lucide-react";

export const BANNER_IMG = "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914554/oma1.webp";

export const BANNER_VIDEO = "https://res.cloudinary.com/fnrrqppt/video/upload/v1792911328/logo1.webm";

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
    q: "Who is eligible to participate in The EliteGlam Pageant?",
    a: "The EliteGlam Pageant is open to male and female contestants aged 18-40 from any part of Nigeria or the Nigerian diaspora. We welcome all tribes, backgrounds, and body types.",
  },
  {
    q: "How do I apply for the pageant?",
    a: "Applications open on November, 2026 via our official website. You will be required to submit a profile, portfolio, and a personal statement. Virtual auditions follow in Februrary 2027.",
  },
  {
    q: "What are the prizes for winners?",
    a: "Prize pool worth ₦12million. Winners will receive an exciting prize pool, valued at ₦12,000,000, featuring brand endorsements packages, modelling contract, and two years ambassadorship with The EliteGlam, alongside other prizes and opportunities to elevate their careers.",
  },
  {
    q: "Where will the Grand Finale be held?",
    a: "The host city, venue and date will be announced to the registered contestants and the public subsequently.",
  },
  {
    q: "How can my brand become a sponsor?",
    a: "We offer a range of partnership tiers from Title Sponsor to Gift Partners. Please use the 'Partner With Us' button on the homepage or email us directly at info@theeliteglam.com.",
  },
  {
    q: "Is The EliteGlam affiliated with international pageant organisations?",
    a: "Yes. The EliteGlam is endorsed by and maintains partnerships with leading international pageant bodies including; Miss Continental World, Miss Friendship International, Mister Continental World, Mister Friendship International, Mister Grand International, and Mr. Universe.",
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
    name: "Osele Iromachukwu",
    title: "Miss EliteGlam 2025 (Winner)",
    state: "Miss Continental World Nigeria",
    age: "28",
    occupation: "Medical Scientist",
    advocacy: "Pulse Global",
    quote: "Caring for people, especially the vulnerable, is a responsibility I carry with pride. My advocacy is my voice for those who cannot speak for themselves.",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914556/oma13.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
  
  {
    name: "Umana Sambo",
    title: "Mister EliteGlam 2025 (Winner)",
    state: "Mister Continental World Nigeria",
    age: "35",
    occupation: "Department of Tourism Officer",
    advocacy: "Youth Tech Empowerment",
    quote: "Beauty is the courage to stand for something greater than yourself. I carry that with every step.",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1793599370/WhatsApp_Image_2026-11-02_at_2.13.14_AM.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
];

export const RUNNERS_UP = [
  
  {
    name: "Emmanuel Oliver",
    title: "Mr.Universe 2026",
    state: "",
    occupation: "Civil Engineer & Footwear Artisan",
    image: "maiden/oliver.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
  {
    name: "Benard Williams",
    title: "Mister Grand International 2026",
    state: "",
    occupation: "Medical Laboratory Scientist",
    image: "maiden/bernard.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  },
];
