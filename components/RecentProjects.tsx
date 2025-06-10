"use client";

import { FaGithub } from "react-icons/fa";
import { GoLinkExternal } from "react-icons/go";
import { useFirestoreData } from "@/data/useFirestoreData";
import { PinContainer } from "./ui/Pin";

const RecentProjects = () => {
  const { data: projects, loading } = useFirestoreData("projects");

  return (
    <div className="py-20 relative transition-opacity duration-700 ease-in-out">
      <h1 className="heading text-center">
        My recent <span className="text-purple">projects</span>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10 transition-opacity duration-500 opacity-100">
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
                  style={{
                    color: "#BEC1DD",
                    margin: "1vh 0",
                  }}
                >
                  {item.des}
                </p>

                <div className="flex items-center justify-center gap-10 mt-7 mb-3">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
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
                      style={{
                        transform: `translateX(-${10 * index + 2}px)`,
                      }}
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
  );
};

export default RecentProjects;
