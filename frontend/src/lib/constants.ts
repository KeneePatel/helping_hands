export type LinkType = {
  name: String;
  ref: string;
};

export const INITIAL_LINKS: Array<LinkType> = [
  {
    name: "Explore",
    ref: "/item_search",
  },
  {
    name: "Add Item",
    ref: "/item",
  },
];

export const GYMOWNER_LINKS: Array<LinkType> = [
  {
    name: "Add Gym",
    ref: "/item",
  },
];


export const FOOTER_LINKS: Array<LinkType> = [
  // {
  //   name: "About us",
  //   ref: "#",
  // },
  {
    name: "Contact us",
    ref: "/contact",
  },
  {
    name: "FAQ",
    ref: "/faq",
  },
  // {
  //   name: "Terms of Service",
  //   ref: "#",
  // },
];

type FAQType = {
  question: string;
  answer: string;
};

export const FAQ_CONTENT: Array<FAQType> = [
  {
    question: "What is Gym Portal?",

    answer:
      "Gym Portal is a platform that connects fitness enthusiasts with gyms and fitness trainers.",
  },

  {
    question: "How do I sign up?",

    answer:
      "You can sign up by clicking on the 'Sign Up' button on the top right corner and filling out the registration form.",
  },

  {
    question: "What are the benefits of using Gym Portal?",

    answer:
      "Gym Portal simplifies the process of finding the right gym by providing comprehensive information about gyms and their amenities. It enables users to compare choices, make sound decisions, and discover exclusive membership plans tailored to their needs.",
  },

  {
    question: "How does Gym Portal help fitness enthusiasts?",

    answer:
      "Gym Portal empowers fitness enthusiasts by offering a centralized platform to explore various gyms and fitness trainers. It allows users to discover new fitness opportunities, access exclusive deals, and connect with like-minded individuals to enhance their fitness journey.",
  },

  {
    question: "What are the key features of Gym Portal?",

    answer:
      "Gym Portal offers a gym search system based on location, services, amenities, and user reviews, enabling users to find the perfect gym effortlessly. It provides detailed gym profiles, alternative membership options, and flexible passes for users to choose from. Additionally, Gym Portal facilitates seamless interaction between consumers and gym owners, allowing direct communication for inquiries and memberships.",
  },

  {
    question: "How does Gym Portal benefit gym owners?",

    answer:
      "Gym Portal serves as a powerful marketing tool for gym owners, allowing them to showcase their facilities, services, and unique offerings to a targeted audience of fitness enthusiasts. By joining Gym Portal, gym owners can attract new members, increase visibility, and effectively manage their business interests.",
  },

  {
    question: "What sets Gym Portal apart from other fitness platforms?",

    answer:
      "Gym Portal stands out for its user-friendly interface, extensive database of gyms and fitness facilities, and comprehensive search features. Unlike other fitness platforms, Gym Portal offers flexible membership options, detailed gym profiles, and direct communication channels between users and gym owners, providing a seamless and personalized fitness experience.",
  },

  {
    question:
      "Can I use Gym Portal to book fitness classes or personal training sessions?",

    answer:
      "Yes, Gym Portal allows users to book fitness classes, personal training sessions, and other services offered by participating gyms and fitness trainers. Simply browse through the available options, select your preferred class or session, and book it directly through the platform.",
  },

  {
    question: "Is Gym Portal available on mobile devices?",

    answer:
      "Yes, Gym Portal is fully optimized for mobile devices, allowing users to access the platform anytime, anywhere. Whether you're using a smartphone or tablet, you can easily search for gyms, book classes, and stay updated on the latest fitness trends on the go.",
  },
];
