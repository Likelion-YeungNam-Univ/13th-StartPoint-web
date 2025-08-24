import React from "react";
import Githublogo from "./assets/Githublogo.svg";
import SPOlogo from "./assets/SPO_Logo_Footer.svg";

const Footer = () => {
  return (
    <footer className="w-full h-[165px] bg-[#1D2C44] flex px-8 py-7">
      <div className="flex-1 flex items-center ml-58">
        <img src={SPOlogo} alt="SPOlogo" className="w-41 h-41" />
      </div>

      <div className="flex-1 flex flex-col items-end justify-end mr-60">
        <a
          href="https://github.com/orgs/Likelion-YeungNam-Univ/teams/13th-devism"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2"
        >
          <button className="w-10 h-10 bg-[#CDE8FF4D] rounded-full flex items-center justify-center">
            <img src={Githublogo} alt="Githublogo" className="w-5 h-5" />
          </button>
        </a>
        <span className="text-[#CDE8FF] text-[16px]">
          © 2025 SPO. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
