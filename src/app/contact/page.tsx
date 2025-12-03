"use client";

import { useState } from "react";
import Image from "next/image";

const ContactPage = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Validation
      if (!fullName || !email || !message) {
        setStatus("Please fill in all fields.");
        setTimeout(() => setStatus(null), 5000);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setStatus("Please enter a valid email address.");
        setTimeout(() => setStatus(null), 5000);
        return;
      }

      // send data to backend API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, message }),
      });

      if (res.ok) {
        setStatus(
          "Your message has been sent successfully! Expect feedback soon."
        );
        setFullName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus(
          "Something went wrong. Please try again or contact me through my socials."
        );
      }

      setTimeout(() => setStatus(null), 5000);
    } catch (error) {
      console.error(error);
      setStatus(
        "Something went wrong. Please try again or contact me through my socials."
      );
      setTimeout(() => setStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="space-y-16 my-40 mb-20 px-5 sm:px-32 relative scroll-mt-10 md:scroll-mt-32"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/dots-large.svg"
          alt="Background pattern"
          width={80}
          height={80}
          className="absolute bottom-60 sm:-bottom-16 -left-12 w-36 sm:w-60"
        />
        <Image
          src="/assets/pattern-big.svg"
          alt="Background pattern"
          width={80}
          height={80}
          className="absolute -top-14 -right-10 w-20 sm:w-32 opacity-40"
        />
        <Image
          src="/assets/ellipse-large.png"
          alt="Background pattern"
          width={80}
          height={80}
          className="-z-10 absolute -bottom-32 -right-20 w-[270px]"
        />
      </div>

      <div>
        <h2 className="font-semibold text-[24px] lg:text-[32px] flex items-center mb-6">
          <span className="text-my-primary">#</span>contact-me{" "}
          <span className="ml-6">
            <Image
              src="/assets/line.png"
              alt="line"
              width={32}
              height={1}
              className="w-32 sm:w-60 h-[0.5px]"
            />
          </span>
        </h2>

        <div className="flex flex-col lg:flex-row justify-between gap-20 mt-20">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 gap-4 px-4 sm:px-8 py-8 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm shadow-[inset_1px_0.5px_2px_rgba(255,255,255,0.9)]"
          >
            <div className="flex flex-col w-[100%]">
              <label
                htmlFor="fullName"
                className="flex items-center gap-2 font-medium text-[14px] mb-2"
              >
                <span className="w-3 h-3 bg-my-primary inline-block"></span>
                Fullname:
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-my-primary/50 rounded-md focus:outline-1 focus:outline-my-primary/70 px-3 py-2 w-[100%] text-bg-dark font-normal h-8"
              />
            </div>

            <div className="flex flex-col w-[100%]">
              <label
                htmlFor="email"
                className="flex items-center gap-2 font-medium text-[14px] mb-2"
              >
                <span className="w-3 h-3 bg-my-primary inline-block"></span>
                Email:
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-my-primary/50 rounded-md focus:outline-1 focus:outline-my-primary/70 px-3 py-2 w-[100%] text-bg-dark font-normal h-8"
              />
            </div>

            <div className="flex flex-col w-[100%]">
              <label
                htmlFor="message"
                className="flex items-center gap-2 font-medium text-[14px] mb-2"
              >
                <span className="w-3 h-3 bg-my-primary inline-block"></span>
                Message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border border-my-primary/50 rounded-md focus:outline-1 focus:outline-my-primary/70 px-3 py-2 w-[100%] text-bg-dark font-normal h-24 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`self-start mt-7 px-6 py-2 text-sm font-bold text-white bg-my-primary border border-white/20 rounded-lg shadow-md transition-all hover:shadow-[0_0_10px_#C778DD,0_0_30px_#C778DD] focus:outline-none focus:ring-2 focus:ring-[#C778DD]/50 w-[100%] ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <p className="text-sm mt-3 text-my-primary/80 mx-auto text-center w-full">
                {status}
              </p>
            )}
          </form>

          <div className="flex-1 flex flex-col items-center justify-between text-center text-[14px]">
            <Image
              src="/animations/cartoon.png"
              alt="cartoon"
              width={200}
              height={200}
              className="w-[240px] h-[250px] md:h-[350px]"
            />
            <p>Thank you for visiting my portfolio!!!</p>
          </div>
        </div>

        {/* socials */}
        <div className="flex justify-center sm:hidden w-full">
          <div className="flex gap-2 justify-between sm:gap-3 mt-10 w-[70%]">
            <a href="https://github.com/FlameGreat-1" target="_blank">
              <Image
                src="/assets/github-icon.svg"
                alt="GitHub"
                width={35}
                height={35}
                className="sm:w-[45px] hover:scale-110 transition-all"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/flamegreat/"
              target="_blank"
            >
              <Image
                src="/assets/linkedIn-icon.svg"
                alt="LinkedIn"
                width={35}
                height={35}
                className="sm:w-[45px] hover:scale-110 transition-all"
              />
            </a>
            <a href="mailto:softverse.com@gmail.com" target="_blank">
              <Image
                src="/assets/gmail-icon.svg"
                alt="Gmail"
                width={35}
                height={35}
                className="sm:w-[45px] hover:scale-110 transition-all"
              />
            </a>
            <a href="https://wa.me/+2348136872013" target="_blank">
              <Image
                src="/assets/whatsapp-icon.svg"
                alt="WhatsApp"
                width={35}
                height={35}
                className="sm:w-[45px] hover:scale-110 transition-all"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
