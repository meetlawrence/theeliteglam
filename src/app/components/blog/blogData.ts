export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  gallery?: string[];
  author?: string;
  content: string[];
}

export const BLOG_CATEGORIES = [
  "All",
  "Pageant Updates",
  "Winner Stories",
  "Fashion & Style",
] as const;

export const FEATURED_POST: BlogPost = {
  id: "1",
  slug: "miss-eliteglam-nigeria-wins-miss-continental-world-2026",
  title: "Miss EliteGlam Nigeria Wins Miss Continental World 2026 & Queen of Africa",
  excerpt:
    "Osele Iruomachukwu Chinazaekpere, Miss EliteGlam Nigeria 2025/2026, celebrates a double triumph in Thailand, winning Miss Continental World 2026 and Queen of Africa.",
  category: "Winner Stories",
  date: "October 24, 2026",
  readTime: "4 min read",
  author: "Editorial Team",
  image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914553/oma.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  gallery: [
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914559/oma10.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914557/oma2.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914551/grand.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914551/oma8.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914554/oma1.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914551/grand1.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
  ],
  content: [
    "A proud moment for Nigeria. A defining milestone for EliteGlam.",
    "Osele Iruomachukwu Chinazaekpere, Miss EliteGlam Nigeria 2025/2026, has won the Miss Continental World 2026 crown in Thailand, alongside the Queen of Africa title.",
    "Twenty-five years after Agbani Darego’s historic Miss World victory in 2001, Osele’s triumph adds another proud chapter to Nigeria’s international pageant story. Her achievement celebrates Nigerian talent and the power of creating opportunities for a new generation of queens to shine on the world stage.",
    "This victory marks an exciting chapter in Osele’s journey from national titleholder to international queen, placing Nigeria and The EliteGlam Pageant Nigeria in the global spotlight.",
    "For EliteGlam, this achievement reflects the purpose behind our platform: discovering talent, nurturing ambition, and creating opportunities for Nigerian representatives to shine beyond our borders.",
    "We celebrate Osele’s accomplishment and everyone whose support helped make this journey possible. As she begins her international reign, we look forward to the opportunities ahead for her to represent Nigeria, inspire others, and make a meaningful impact.",
    "From Nigeria to the world—where beauty meets purpose."
  ]
};

export const BLOG_POSTS: BlogPost[] = [
  FEATURED_POST,
  {
    id: "2",
    slug: "official-registration-opens-eliteglam-2027",
    title: "Official Registration Now Open for The EliteGlam 2027",
    excerpt:
      "Applications are officially open for aspiring delegates nationwide. Step onto the platform where beauty meets purpose and leadership.",
    category: "Pageant Updates",
    date: "November 1, 2026",
    readTime: "3 min read",
    author: "Pageant Secretariat",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914551/grand.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
    gallery: [
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914553/oma3.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914551/grand1.webp"
    ],
    content: [
      "The search for Nigeria's next iconic ambassadors has officially begun. The EliteGlam Pageant Nigeria is now accepting registrations for the 2027 edition.",
      "Designed to nurture ambition, foster leadership, and champion cultural heritage, EliteGlam provides delegates with unmatched international exposure, professional poise seminars, and transformational career platforms.",
      "Aspiring delegates are invited to submit their applications through the official portal. Take the step from national aspiring talent to global ambassador."
    ]
  },
  {
    id: "3",
    slug: "mister-eliteglam-nigeria-earns-3rd-runner-up-king-of-africa",
    title: "Mister EliteGlam Nigeria Earns 3rd Runner-Up & King of Africa Titles",
    excerpt:
      "Unwana Sambo, Mister EliteGlam Nigeria 2025/2026, makes Nigeria proud with a 3rd Runner-Up finish and the King of Africa title in Thailand.",
    category: "Winner Stories",
    date: "October 23, 2026",
    readTime: "3 min read",
    author: "Editorial Team",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914559/sambo8.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    gallery: [
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914557/sambo2.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914558/sambo1.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914560/sambo4.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914545/arrival4.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    ],
    content: [
      "Nigeria’s presence on the international stage received another reason to celebrate as Unwana Sambo, Mister EliteGlam Nigeria 2025/2026, secured 3rd Runner-Up at Mister Continental World 2026 in Thailand.",
      "Alongside his placement, Unwana earned the King of Africa title, adding continental recognition to his international achievement.",
      "His success marks an important milestone in his reign and in EliteGlam’s mission to create a platform through which Nigerian talent can reach international audiences.",
      "Representing one’s country carries both honour and responsibility. We are proud to celebrate Unwana’s achievement and the work that brought him to this moment.",
      "The EliteGlam Pageant Nigeria congratulates our king and thanks everyone who supported his journey.",
      "A national ambassador. A continental king. A proud moment for Nigeria."
    ]
  },
  {
    id: "4",
    slug: "eliteglam-nigeria-duo-wins-best-national-costume-2026",
    title: "EliteGlam Nigeria Duo Wins Best National Costume at Continental World 2026",
    excerpt:
      "Nigeria’s representatives, Osele Iruomachukwu Chinazaekpere and Unwana Sambo, celebrate Best National Costume honours at Mister and Miss Continental World 2026 in Thailand.",
    category: "Fashion & Style",
    date: "October 22, 2026",
    readTime: "3 min read",
    author: "Pageant Secretariat",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914560/sambo6.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
    gallery: [
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792918434/oma14.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914558/sambo5.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80", 
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914560/oma15.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914559/sambo6.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    ],
    content: [
      "Nigerian culture took its place in the international spotlight as The EliteGlam Pageant Nigeria’s representatives won Best National Costume honours at Mister and Miss Continental World 2026 in Thailand.",
      "Representing Nigeria were Osele Iruomachukwu Chinazaekpere, Miss EliteGlam Nigeria 2025/2026, and Unwana Sambo, Mister EliteGlam Nigeria 2025/2026.",
      "The recognition holds special meaning for EliteGlam. The national costume presentation offers an opportunity to share identity, heritage, and creative expression with an international audience.",
      "This achievement celebrates our representatives and the creative work behind their presentations. We extend our appreciation to everyone who contributed to bringing Nigeria’s cultural expression to the stage.",
      "As we celebrate these honours, we remain committed to giving Nigerian creativity a platform beyond our borders.",
      "Our heritage, proudly represented. Our creativity, internationally celebrated."
    ]
  },
  {
    id: "5",
    slug: "eliteglam-nigeria-duo-celebrates-best-physique-honours-2026",
    title: "EliteGlam Nigeria Duo Celebrates Best Physique Honours at Continental World 2026",
    excerpt:
      "Osele Iruomachukwu Chinazaekpere and Unwana Sambo add Best Physique honours to Nigeria’s achievements at Mister and Miss Continental World 2026.",
    category: "Pageant Updates",
    date: "October 21, 2026",
    readTime: "3 min read",
    author: "Editorial Team",
    image: "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914555/oma9.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    gallery: [
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914558/sambo3.jpg?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914545/oma5.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914556/oma11.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914558/sambo.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914561/sambo10.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914549/oma7.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
      "https://res.cloudinary.com/fnrrqppt/image/upload/v1792914560/sambo7.webp?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=900&q=80",
    ],
    content: [
      "The celebrations continued for Team Nigeria as The EliteGlam Pageant Nigeria’s duo earned Best Physique honours at Mister and Miss Continental World 2026 in Thailand.",
      "Osele Iruomachukwu Chinazaekpere, Miss EliteGlam Nigeria 2025/2026, and Unwana Sambo, Mister EliteGlam Nigeria 2025/2026, represented the organisation at the international competition, adding this recognition to an exciting outing for Nigeria.",
      "At EliteGlam, we encourage our representatives to approach preparation with confidence, discipline, and care for their wellbeing. We celebrate this achievement within our wider commitment to recognising individuality and embracing diverse expressions of beauty.",
      "Congratulations to our queen and king on another proud milestone. Our appreciation also goes to the team and supporters who stood behind them throughout their international journey.",
      "Two representatives. One proud nation. A shared moment of celebration."
    ]
  }
];