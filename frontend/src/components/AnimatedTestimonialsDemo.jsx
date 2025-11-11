import { AnimatedTestimonials } from "../components/animated-testimonials";

import karthikImg from "../assets/images/karthik.png";
import mashoodImg from "../assets/images/mashood.png";
import abhishekImg from "../assets/images/abhishek.png";
import namitImg from "../assets/images/namit.png";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "I've finished engineering the entire backend, which is the engine that will transform our workflow. With that foundation secure, I've now moved on to the frontend and have the initial user interface taking shape.",
      name: "Karthik Ajay",
      designation: "Full Stack Devloper",
      src: karthikImg,
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Namit Jagadeesh",
      designation: "Team Leader",
      src: namitImg,
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Abhishek S Thayyil",
      designation: "Documenter",
      src: abhishekImg,
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "Mahammad Mashood",
      designation: "Front-End Engineer",
      src: mashoodImg,
    },
    
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
