interface GameTitleProps {
  className?: string;
}

export default function GameTitle({ className = "" }: GameTitleProps) {
  return (
    <h1
      className={`font-heading text-4xl sm:text-5xl font-semibold text-white tracking-tight text-center whitespace-nowrap ${className}`}
    >
      MANUFACTURING <span className="text-safety-yellow">OPERATIONS QUIZ</span>
    </h1>
  );
}
