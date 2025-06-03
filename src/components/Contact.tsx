"use client";

import React, { useState } from "react";

const topics = [
  "Video Production",
  "Film Direction",
  "Cinematography",
  "Video Editing",
  "Sound Design",
  "Motion Graphics",
  "Color Grading",
];

const Contact = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4">
        <span className="text-neutral-400">Say Hi!</span>
        <span className="text-black dark:text-white">
          {" "}
          and tell me
          <br className="hidden md:inline" /> about your idea
        </span>
      </h1>

      <p className="text-lg text-neutral-500 mb-12 max-w-xl">
        Have a nice works? Reach out and let&#39;s chat.
      </p>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-8 md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Name*
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Hello..."
                  className="w-full bg-transparent border-0 border-b border-neutral-300 focus:outline-none text-lg py-2 placeholder-neutral-400 peer"
                  required
                />
                <div className="absolute left-0 bottom-0 h-[2px] w-full bg-black scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 ease-out origin-left" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email*
              </label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Where can I reply?"
                  className="w-full bg-transparent border-0 border-b border-neutral-300 focus:outline-none text-lg py-2 placeholder-neutral-400 peer"
                  required
                />
                <div className="absolute left-0 bottom-0 h-[2px] w-full bg-black scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 ease-out origin-left" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Company Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Your company or website?"
                className="w-full bg-transparent border-0 border-b border-neutral-300 focus:outline-none text-lg py-2 placeholder-neutral-400 peer"
              />
              <div className="absolute left-0 bottom-0 h-[2px] w-full bg-black scale-x-0 peer-focus:scale-x-100 transition-transform duration-300 ease-out origin-left" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-4">
              What&#39;s in your mind?*
            </label>
            <div className="flex flex-wrap gap-3">
              {topics.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                return (
                  <button
                    type="button"
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    className={`px-5 py-2 rounded-full border border-black text-sm font-medium transition-colors duration-200
                      ${isSelected ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"}
                    `}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="md:col-span-2 mt-8">
          <button
            type="submit"
            className="inline-flex items-center px-8 py-3 rounded-full border border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-lg hover:bg-neutral-700 dark:hover:bg-neutral-200 transition"
          >
            Let's Talk
            <span className="ml-2">&#8594;</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
