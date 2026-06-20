import type { ChallengeCardData } from "./challenge-data";

type Props = {
  card: ChallengeCardData;
  isUsed: boolean;
  hintUnlocked: boolean;
  isMobile: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
};

export default function ChallengeCard({
  card,
  isUsed,
  hintUnlocked,
  isMobile,
  isSelected,
  onSelect,
  onDragStart,
}: Props) {
  return (
    <div
      draggable={!isUsed && !isMobile}
      onDragStart={onDragStart}
      onClick={() => {
        if (isMobile && !isUsed) onSelect();
      }}
      className={`relative h-[260px] w-[164px] shrink-0 transition-all duration-300 ${
        isUsed
          ? "scale-95 opacity-25"
          : isMobile
          ? "cursor-pointer active:scale-95"
          : "cursor-grab hover:-translate-y-2 active:cursor-grabbing"
      } ${
        isSelected
          ? "scale-105 drop-shadow-[0_0_22px_rgba(250,204,21,0.8)]"
          : ""
      }`}
    >
      <div
        className={`relative h-full w-full bg-gradient-to-br ${card.gradient} p-[2px] shadow-2xl shadow-black/50`}
        style={{ clipPath: getShape(card.connector) }}
      >
        <div
          className="flex h-full w-full flex-col justify-between bg-[#0d1731]/95 p-4 text-white"
          style={{ clipPath: getShape(card.connector) }}
        >
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-black uppercase tracking-widest">
              {card.domain}
            </span>
            <span className="text-xl">{card.symbol}</span>
          </div>

          <div className="flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-4xl shadow-inner">
              {card.symbol}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-black uppercase leading-none">
              {card.name}
            </h3>
            <p className="mt-2 text-xs text-white/65">{card.meaning}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-1">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/10 px-2 py-1 text-[8px] font-bold text-white/70"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-center">
            <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-yellow-200">
              {card.connector} = {card.connectorMeaning}
            </p>

            {hintUnlocked && (
              <p className="mt-1 text-[8px] leading-tight text-white/55">
                {card.hiddenClue}
              </p>
            )}
          </div>
        </div>

        {isSelected && (
          <div
            className="absolute inset-0 border-4 border-yellow-300/80"
            style={{ clipPath: getShape(card.connector) }}
          />
        )}
      </div>
    </div>
  );
}

function getShape(connector: ChallengeCardData["connector"]) {
  if (connector === "triangle") {
    return "polygon(13% 0%,87% 0%,100% 13%,100% 38%,84% 50%,100% 62%,100% 87%,87% 100%,13% 100%,0% 87%,0% 13%)";
  }

  if (connector === "square") {
    return "polygon(10% 0%,90% 0%,100% 10%,100% 34%,86% 34%,86% 66%,100% 66%,100% 90%,90% 100%,10% 100%,0% 90%,0% 10%)";
  }

  if (connector === "wave") {
    return "polygon(12% 0%,88% 0%,100% 12%,100% 34%,88% 42%,100% 50%,88% 58%,100% 66%,100% 88%,88% 100%,12% 100%,0% 88%,0% 12%)";
  }

  return "polygon(8% 0%,92% 6%,82% 28%,100% 42%,78% 55%,94% 100%,14% 94%,0% 72%,16% 50%,0% 24%)";
}