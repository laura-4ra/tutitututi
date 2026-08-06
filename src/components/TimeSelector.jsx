import { useState } from "react";
import { Timer, Plus, Check } from "lucide-react";

function TimeSelector({ mode, onSelect }) {
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("");

  const times = [45, 60, 70, 90];

  // En descanso no mostramos el selector
  if (mode === "break") {
    return <div className="mt-6 h-[22px]" />;
  }

  return (
    <div className="mt-6 relative">
      <button
        onClick={() => {
          if (showTimeMenu) {
            setShowTimeMenu(false);
            setShowCustomTime(false);
            setCustomMinutes("");
          } else {
            setShowTimeMenu(true);
          }
        }}
        className="text-white/50 hover:text-white transition"
      >
        <Timer size={22} />
      </button>

      {showTimeMenu && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 rounded-xl bg-emerald-900 border border-white/20 p-3">
          {!showCustomTime ? (
            <>
              {times.map((minutes) => (
                <button
                  key={minutes}
                  onClick={() => {
                    onSelect(minutes);
                    setShowTimeMenu(false);
                    setShowCustomTime(false);
                    setCustomMinutes("");
                  }}
                  className="rounded-lg px-4 py-2 whitespace-nowrap transition hover:bg-emerald-800"
                >
                  {minutes} min
                </button>
              ))}

              <button
                onClick={() => setShowCustomTime(true)}
                className="rounded-lg px-4 py-2 transition hover:bg-emerald-800"
              >
                <Plus size={18} />
              </button>
            </>
          ) : (
            <>
              <input
                type="number"
                min="1"
                placeholder="min"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="w-20 rounded-lg bg-emerald-800 px-3 py-2 text-center outline-none"
              />

              <button
                onClick={() => {
                  const minutes = Number(customMinutes);

                  if (minutes > 0) {
                    onSelect(minutes);
                    setShowTimeMenu(false);
                    setShowCustomTime(false);
                    setCustomMinutes("");
                  }
                }}
                className="rounded-lg px-4 py-2 transition hover:bg-emerald-800"
              >
                <Check size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TimeSelector;