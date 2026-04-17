import { BookOpenCheck, Brain, RectangleEllipsis } from "lucide-react";
import logo from "../../../../public/assets/lucide/folder-code.svg";
import Image from "next/image";

export default function Hero() {
  return (
    <aside className="hidden md:flex md:w-[42%] flex-col px-12 py-10 bg-[#8ebcf875]">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-auto">
        <Image src={logo} alt="Logo" width={40} height={40} />
        <span className="font-semibold text-blue-600 text-lg">Exam App</span>
      </div>

      {/* Headline */}
      <div className="mt-16 mb-12">
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">
          Empower your learning journey
          <br />
          with our smart exam platform.
        </h1>
      </div>

      {/* Feature list */}
      <ul className="flex flex-col gap-7 mb-auto">
        <li className="flex items-start gap-4">
          <span className="text-blue-600 border border-2 border-blue-600 p-1">
            <Brain size={24} />
          </span>
          <div>
            <p className="font-semibold text-blue-600 text-sm">
              Tailored Diplomas
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose from specialized tracks like Frontend, Backend, and Mobile
              Development.
            </p>
          </div>
        </li>

        <li className="flex items-start gap-4">
          <span className="text-blue-600 border border-2 border-blue-600 p-1">
            <BookOpenCheck size={24} />
          </span>
          <div>
            <p className="font-semibold text-blue-600 text-sm">Focused Exams</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Access topic-specific tests including HTML, CSS, JavaScript, and
              more.
            </p>
          </div>
        </li>

        <li className="flex items-start gap-4">
          <span className="text-blue-600 border border-2 border-blue-600 p-1">
            <RectangleEllipsis size={24} />
          </span>
          <div>
            <p className="font-semibold text-blue-600 text-sm">
              Smart Multi-Step Forms
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose from specialized tracks like Frontend, Backend, and Mobile
              Development.
            </p>
          </div>
        </li>
      </ul>
    </aside>
  );
}
