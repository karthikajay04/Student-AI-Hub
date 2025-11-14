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
        "The heavy lifting on the backend is done; the system logic is solid and ready to power our workflows. I've pivoted to the client-side implementation now, and we are already seeing the visual elements of the UI coming together.",
      name: "Namit Jagadeesh",
      designation: "Team Leader",
      src: namitImg,
    },
    {
      quote:
        "'ve finalized the core Standard Operating Procedures (SOPs) and process maps—the framework that will drive our workflow. With those internal standards secure, I've moved on to creating the user-facing guides and templates, which are now taking shape",
      name: "Abhishek S Thayyil",
      designation: "Documenter",
      src: abhishekImg,
    },
    {
      quote:
        "I've completed the application scaffolding and routing structure—the foundation for the user journey. With the skeleton in place, I'm now focused on building out the views and interactions, and the interface is coming together nicely.",
      name: "Mahammad Mashood",
      designation: "Front-End Engineer",
      src: mashoodImg,
    },
    
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
