"use client";

import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

const allProjects = [
  {
    title: "Portfolio Website",
    subtitle:
      "A personal portfolio website to showcase my experience and skills.",
    thumbnail: "/images/Portfolio.png",
    stack: "Next.js · TypeScript · Tailwind CSS ",
    liveUrl: "https://softverse.vercel.app",
    githubUrl: "https://github.com/FlameGreat-1/flamo",
  },
  {
    title: "Exoper",
    subtitle:
      "AI Security Guardrails. One Gateway. Every Model. Every AI request passes through EXOPER's zero-trust gateway. Identity verification, policy enforcement, threat detection, and immutable logging across all models, all environments. On-premises or cloud. No vendor lock-in.",
    thumbnail: "/images/exoper.png",
    stack:
      "· Go · Rust · Next.js · TypeScript · Tailwind CSS · PostgreSQL · Docker · Kubernetes · CI/CD",
    liveUrl: "https://exoper.com",
    githubUrl: "https://github.com/FlameGreat-1/exoper",
  },
  {
    title: "Raspaas",
    subtitle:
      "Multitenant HR management System with integrated biometric (REALAND) and face recognition (ZKTeco) devices. Payroll automation, and compliance tracking and RBAC authorization.",
    thumbnail: "/images/raspaas.png",
    stack: "· Python · Django · JavaScript · HTML · CSS, · PostgreSQL · Docker · Celery ",
    liveUrl: "https://raspaas.up.railway.app",
    githubUrl: "https://github.com/FlameGreat-1/Raspaas",
  },
  {
    title: "BuildHive",
    subtitle:
      "Freelance Marketplace Platform connecting clients with skilled freelancers for various projects and services in the constructions and technical industries.",
    thumbnail: "/images/buildhive.png",
    stack: "TypeScript · React.js · Next.js · Tailwind CSS · SQL · Oracle Cloud ",
    liveUrl: "https://buildhive.vercel.app",
    githubUrl: "https://github.com/FlameGreat-1/BuildHive-Frontend",
  },
  {
    title: "Sidesone",
    subtitle:
      "Agency Freelance portfolio connecting clients with skilled freelancers for various projects and services.",
    thumbnail: "/images/sidesone.png",
    stack: "· Typescript · Next.js · Tailwind CSS · MongoDB · AWS ",
    liveUrl: "https://sidesone.no",
    githubUrl: "https://github.com/FlameGreat-1/sideones",
  },
  {
    title: "CosmicForge HealthNet",
    subtitle:
      "AI-powered telemedicine platform that connects patients with healthcare professionals for virtual consultations and medical advice.",
    thumbnail: "/images/cosmicforge.png",
    stack: "· Python FastAPI · TypeScript · Express.js · Node.js · Tailwind CSS · MongoDB ",
    liveUrl: "https://cosmicforge-frontend.vercel.app",
    githubUrl: "https://github.com/FlameGreat-1/Raphex-Backend",
  },
  {
    title: "Honestiq",
    subtitle:
      "Agency Software Solutions portfolio.",
    thumbnail: "/images/honestiq.png",
    stack: "Typescript · Node.js · React.js · Tailwind CSS ",
    liveUrl: "https://honestiq-solutions.vercel.app",
    githubUrl: "https://github.com/FlameGreat-1/honsestiq",
  },
  {
    title: "Basse",
    subtitle:
      "Web3 mentorship platform connecting mentors and mentees in the blockchain space.",
    thumbnail: "/images/basse.png",
    stack: "Next.js · Tailwind CSS · Framer Motion · TypeScript · Solidity · Hardhat · Ethers.js · IPFS ",
    liveUrl: "https://bassse3.vercel.app",
    githubUrl: "https://github.com/FlameGreat-1/Basse",
  },
  {
    title: "NSW CleaningCompany",
    subtitle:
      "Cleaning service website for NSW CleaningCompany offering residential and commercial cleaning solutions.",
    thumbnail: "/images/nsw.png",
    stack: "Python · Django · React.js · Tailwind CSS · PostgreSQL ",
    liveUrl: "https://nswcleaningcompany.com/",
    githubUrl: "https://github.com/FlameGreat-1/ncwcc",
  },
];

const AllProjectsPage = () => {
  const router = useRouter();

  const handleBackClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Navigate to home page
    router.push("/");

    // Try multiple times to find and scroll to the element
    let attempts = 0;
    const maxAttempts = 10;

    const scrollInterval = setInterval(() => {
      const element = document.getElementById("projects");

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(scrollInterval); // Stop trying once successful
      }

      attempts++;
      if (attempts >= maxAttempts) {
        clearInterval(scrollInterval); // Give up after 10 attempts
      }
    }, 100); // Check every 100ms
  };

  return (
    <section className="px-10 sm:px-32 py-20 bg-bg-dark">
      <div className="mb-8">
        <Link
          href="/#projects"
          onClick={handleBackClick}
          className="text-sm text-my-primary underline cursor-pointer"
        >
          &larr; Back
        </Link>
      </div>

      <h2 className="font-semibold text-[20px] text-white lg:text-[32px] flex items-center mb-6">
        <span className="text-my-primary">/</span>more-projects{" "}
        <span className="ml-6">
          <Image
            src="/assets/line.png"
            alt="line"
            width={22}
            height={1}
            className="sm:60 w-32 h-[0.5px]"
          />
        </span>
      </h2>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-16 mt-10 md:mt-20 text-white">
        {allProjects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            subtitle={project.subtitle}
            thumbnail={project.thumbnail}
            stack={project.stack}
            liveUrl={project.liveUrl}
            githubUrl={project.githubUrl}
          />
        ))}
      </div>
      <p className="text-white mt-20">
        check out more on my github{" "}
        <a
          href="https://github.com/FlameGreat-1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-my-primary underline"
        >
          here!
        </a>
      </p>
    </section>
  );
};

export default AllProjectsPage;
