"use client";

import { FaGithub } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { Project } from "@/types";
import { PinContainer } from "./ui/Pin";

const RecentProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <section id="projects">
      <div className="py-20 relative">
        <h1 className="heading text-center">
          My recent <span className="text-purple">projects</span>
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-white-100 mt-10 py-10">
            Projects will appear here once added via the admin panel.
          </p>
        ) : (
          <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
            {projects.map((item) => (
              <div
                className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
                key={item.id}
              >
                <PinContainer>
                  <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                    <div
                      className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                      style={{ backgroundColor: "#13162D" }}
                    >
                      <img src="/bg.png" alt="bgimg" />
                    </div>
                    <img
                      src={item.img}
                      alt="cover"
                      className="z-10 absolute bottom-0"
                    />
                  </div>

                  <h1 className="font-bold lg:text-2xl md:text-xl text-base line-clamp-1">
                    {item.title}
                  </h1>

                  <p
                    className="lg:text-xl lg:font-normal font-light text-sm line-clamp-2"
                    style={{ color: "#BEC1DD", margin: "1vh 0" }}
                  >
                    {item.des}
                  </p>

                  <div className="flex items-center justify-center gap-10 mt-7 mb-3">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-center items-center lg:text-xl md:text-xs text-sm"
                      >
                        Live Demo
                        <GoLinkExternal className="ms-3" />
                      </a>
                    )}
                    {item.repo && (
                      <a
                        href={item.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <p className="flex lg:text-xl md:text-xs text-sm text-purple">
                          Check Github Repo
                        </p>
                        <FaGithub className="ms-3" color="#CBACF9" />
                      </a>
                    )}
                  </div>

                  <div className="flex justify-center items-center">
                    {item.iconLists?.map((icon: string, index: number) => (
                      <div
                        key={index}
                        className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                        style={{ transform: `translateX(-${10 * index + 2}px)` }}
                      >
                        <img src={icon} alt="icon" className="p-2" />
                      </div>
                    ))}
                  </div>
                </PinContainer>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentProjects;
