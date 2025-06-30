"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/data/firebase";
import { Button } from "./ui/MovingBorders";

type ExperienceItem = {
  id: number;
  title: string;
  desc: string;
  thumbnail: string;
};

const Experience = () => {
  const [workExperience, setWorkExperience] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const snapshot = await getDocs(collection(db, "workExperience"));
        const data = snapshot.docs.map((doc) => ({
          id: Number(doc.id),
          ...doc.data(),
        })) as ExperienceItem[];
        setWorkExperience(data);
      } catch (error) {
        console.error("Failed to fetch experience data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  return (
    <section id="experience">
      <div className="py-20 w-full relative transition-opacity duration-700 ease-in-out">
        <h1 className="heading text-center">
          My <span className="text-purple">work experience</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div
            className={`w-full mt-12 grid gap-10 transition-opacity duration-500 opacity-100 ${
              workExperience.length === 1
                ? "place-items-center"
                : "lg:grid-cols-4 grid-cols-1"
            }`}
          >
            {workExperience.map((card) => (
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
                    alt={card.thumbnail}
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
