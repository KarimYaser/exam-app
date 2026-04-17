import Image from "next/image";

interface DiplomaCardProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
}

export default function DiplomaCard({
  title,
  description,
  image,
  onClick,
}: DiplomaCardProps) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden aspect-video cursor-pointer group transition-all duration-300 ease-in-out rounded-lg"
    >
      <Image
        unoptimized /* solves the issue of the image not loading */
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 90vw,400px"
        className="object-cover"
      />
      {/* Overlay anchored to the bottom */}
      <div className="absolute overflow-hidden transition-all duration-500 ease-in-out left-2 right-2 bottom-2 bg-[#155DFC]/80 max-h-[72px] group-hover:max-h-[80%] group-hover:overflow-auto">
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-white font-bold text-sm leading-snug font-mono">
            {title}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
