"use client";

import { WorkExperience } from "@/types";
import { Button } from "./ui/MovingBorders";

const Experience = ({ items }: { items: WorkExperience[] }) => {
  return (
    <section id="experience">
      <div className="py-20 w-full relative">
        <h1 className="heading text-center">
          My <span className="text-purple">work experience</span>
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-white-100 mt-10 py-10">
            Work experience will appear here once added via the admin panel.
          </p>
        ) : (
          <div
            className={`w-full mt-12 grid gap-10 ${
              items.length === 1
                ? "place-items-center"
                : "lg:grid-cols-4 grid-cols-1"
            }`}
          >
            {items.map((card) => (
              <Button
                key={card.id}
                duration={Math.floor(Math.random() * 10000) + 10000}
                borderRadius="1.75rem"
                style={{
                  background: "rgb(4,7,29)",
                  backgroundColor:
                    "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                  borderRadius: `calc(1.75rem * 0.96)`,
                }}
                className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
              >
                <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                  <img
                    src={card.thumbnail}
                    alt={card.title}
                    className="lg:w-32 md:w-20 w-16"
                  />
                  <div className="lg:ms-5">
                    <h1 className="text-start text-xl md:text-2xl font-bold">
                      {card.title}
                    </h1>
                    <p className="text-start text-white-100 mt-3 font-semibold">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
