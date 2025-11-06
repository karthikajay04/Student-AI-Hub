import { AnimatedTestimonials } from "../components/animated-testimonials";

import karthikImg from "../assets/images/karthik.png";
import mashoodImg from "../assets/images/mashood.png";
import abhishekImg from "../assets/images/abhishek.png"

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
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
