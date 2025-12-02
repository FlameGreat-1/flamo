"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import Carousel from "@/components/Carousel";
import { motion, AnimatePresence } from "framer-motion";

const ProjectsPage = () => {
  const [activeTab, setActiveTab] = useState<"projects" | "achievements">(
    "projects"
  );

  const achievements = [
    {
      src: "/images/Loading_1.gif",
      caption: "Leader of the year award",
    },
    {
      src: "/images/Loading_1.gif",
      caption: "B.ENG (chemical engineering) from Federal University of Technology Owerri",
    },
    {
      src: "/images/Loading_1.gif",
      caption: "Full-Stack Engineering Certification from Coursera",
    },
  ];

  return (
    <section
      id="projects"
      className="space-y-16 my-40 px-5 sm:px-32 relative scroll-mt-10 md:scroll-mt-32"
    >
      <Image
        src="/assets/dots-small.svg"
        alt="Background pattern"
        width={80}
        height={80}
        className="absolute top-16 md:right-60 right-10 w-10 sm:w-16"
      />

      <Image
        src="/assets/ellipse-large.png"
        alt="Background pattern"
        width={80}
        height={80}
        className="absolute top-48 -left-40 w-[250px] sm:w-[500px] -z-10"
      />

      <div>
        <h2 className="font-semibold text-[24px] lg:text-[32px] flex items-center mb-6">
          <span className="text-my-primary">#</span>projects/achievements{" "}
          <span className="ml-6">
            <Image
              src="/assets/line.png"
              alt="line"
              width={32}
              height={1}
              className="sm:w-60 w-32 h-[0.5px]"
            />
          </span>
        </h2>

        {/* tabs */}
        <div className="flex justify-between w-full lg:w-[70%] mx-auto my-10 text-[12px] lg:text-[18px] gap-3">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-2 rounded-full transition-all border backdrop-blur-sm
            ${
              activeTab === "projects"
                ? "bg-[#2b2035] border-[#C778DD] shadow-[0_0_20px_#C778DD33]"
                : "border-gray-700/60 hover:border-gray-500"
            }`}
          >
            {`{ Projects }`}
          </button>

          <button
            onClick={() => setActiveTab("achievements")}
            className={`px-6 py-2 rounded-full transition-all border backdrop-blur-sm
            ${
              activeTab === "achievements"
                ? "bg-[#2b2035] border-[#C778DD] shadow-[0_0_20px_#C778DD33]"
                : "border-gray-700/60 hover:border-gray-500"
            }`}
          >
            {`{ Achievements }`}
          </button>
        </div>

        {/* tab content with animation */}
        <div className="w-[90%] mx-auto">
          <AnimatePresence mode="wait" initial={false}>
            {activeTab === "projects" ? (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              >
                <div className="flex flex-nowrap gap-6 justify-between items-start w-full flex-col sm:flex-row">
                  <ProjectCard
                    title="Portfolio Website"
                    subtitle="A personal portfolio website to showcase my projects and skills."
                    thumbnail="/images/Portfolio.png"
                    stack="Next.js · TypeScript · Tailwind CSS "
                    liveUrl="https://softverse.vercel.app/"
                    githubUrl="https://github.com/FlameGreat-1/Softverse"
                  />
                  <ProjectCard
                    title="exoper"
                    subtitle="AI Security Guardrails. One Gateway. Every Model. Every AI request passes through EXOPER's zero-trust gateway. Identity verification, policy enforcement, threat detection, and immutable logging across all models, all environments. On-premises or cloud. No vendor lock-in. Exoper is built for trust, security, governance and compliance..."
                    thumbnail="/images/exoper.png"
                    stack="· Go · Rust · Next.js · React.js · TypeScript · Tailwind CSS · PostgreSQL · Prisma · OPA · OpenTelemetry · Docker · Kubernetes · CI/CD "
                    liveUrl="https://exoper.com"
                    githubUrl="https://github.com/FlameGreat-1/exoper"
                  />
                  <ProjectCard
                    title="Raspaas"
                    subtitle="Multitenant HR management System with integrated biometric (REALAND) and face recognition (ZKTeco) devices. Payroll automation, and compliance tracking and RBAC authorization."
                    thumbnail="/images/raspaas.png"
                    stack="Python · Django · JavaScript · HTML · CSS, · PostgreSQL · Docker · Celery "
                    liveUrl="https://raspaas.up.railway.app"
                    githubUrl="https://github.com/FlameGreat-1/Raspaas"
                  />
                </div>

                <p className="flex justify-end my-10 lg:mr-10">
                  <Link
                    href="/projects/all"
                    className="flex items-center text-sm hover:text-my-primary"
                  >
                    view more
                    <Image
                      src="/assets/view-all-arrow.svg"
                      alt="arrow icon"
                      width={20}
                      height={20}
                      className="inline-block ml-2"
                    />
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-full lg:w-[85%] max-w-4xl">
                  <p className="text-center mx-auto mb-10 font-semibold text-[14px] sm:text-md">
                    Acievements / Certifications
                  </p>
                  <Carousel
                    slides={achievements}
                    autoPlay
                    autoPlayInterval={6000}
                    showIndicators
                    showArrows
                  />
                </div>

                <p className="mt-6 text-[10px] text-center sm:text-sm text-gray-300">
                  Swipe to explore — or use the arrows / dots.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
