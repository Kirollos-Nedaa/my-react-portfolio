import { FaLocationArrow } from "react-icons/fa6";
import { SiteConfig } from "@/types";
import MagicButton from "./MagicButton";

// Static social icons — managed via admin if needed in future
const socialMedia = [
  { id: 1, img: "/git.svg", link: "https://github.com/Kirollos-Nedaa" },
  { id: 2, img: "/wha.svg", link: "https://wa.me/201094959678" },
  { id: 3, img: "/link.svg", link: "https://www.linkedin.com/in/kirollos-nedaa/" },
];

const DEFAULTS = {
  email: "kirollosnedaa@gmail.com",
  githubUrl: "https://github.com/Kirollos-Nedaa",
  linkedinUrl: "https://www.linkedin.com/in/kirollos-nedaa/",
  whatsappLink: "https://wa.me/201094959678",
};

const Footer = ({ config }: { config: SiteConfig | null }) => {
  const email = config?.email ?? DEFAULTS.email;

  const socials = [
    { id: 1, img: "/git.svg", link: config?.githubUrl ?? DEFAULTS.githubUrl },
    { id: 2, img: "/wha.svg", link: config?.whatsappLink ?? DEFAULTS.whatsappLink },
    { id: 3, img: "/link.svg", link: config?.linkedinUrl ?? DEFAULTS.linkedinUrl },
  ];

  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <img src="/footer-grid.svg" alt="grid" className="w-full h-full opacity-50" />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Reach out to me today and let&apos;s discuss how I can help you
          achieve your goals.
        </p>
        <a href={`mailto:${email}`}>
          <MagicButton
            title="Let's get in touch"
            icon={<FaLocationArrow />}
            position="right"
          />
        </a>
      </div>

      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2025 Kirollos Nedaa
        </p>
        <div className="flex items-center mt-5 md:gap-3 gap-6">
          {socials.map((info) => (
            <a
              href={info.link}
              key={info.id}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <img src={info.img} alt="social" width={20} height={20} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
