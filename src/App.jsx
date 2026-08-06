import { useEffect, useRef, useState } from "react";
import Timer from "./components/Timer";
import PrimaryButton from "./components/PrimaryButton";
import SecondaryButton from "./components/SecondaryButton";
import TimeSelector from "./components/TimeSelector";
import { Car, Sparkles, Wind, Wand } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "./supabase";


function App() {
  
  const { id: roomId } = useParams();

  console.log("Sala:", roomId);

  const [running, setRunning] = useState(false);

  const [focusDuration, setFocusDuration] = useState(60);
  const [breakDuration] = useState(10);

  const [seconds, setSeconds] = useState(60 * 60);
  const [mode, setMode] = useState("focus");

  const audioRef = useRef(new Audio("/sounds/glow.wav"));

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

useEffect(() => {
  if (!roomId) return;

  async function cargarSala() {
    let { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (!data) {
      const { data: nuevaSala, error } = await supabase
        .from("rooms")
        .insert({
          id: roomId,
          mode: "focus",
          duration: 60,
          running: false,
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return;
      }

      data = nuevaSala;
    }

    setRunning(data.running);
    setMode(data.mode);
    setFocusDuration(data.duration);

    console.log("DATOS DE LA SALA:", data);

    if (data.running && data.started_at) {
      const inicio = new Date(data.started_at).getTime();
      const ahora = Date.now();

      const transcurridos = Math.floor((ahora - inicio) / 1000);

      const total =
        data.mode === "focus"
          ? data.duration * 60
          : breakDuration * 60;

      setSeconds(Math.max(total - transcurridos, 0));
    } else {
      if (data.mode === "focus") {
        setSeconds(data.duration * 60);
      } else {
        setSeconds(breakDuration * 60);
      }
    }
  }

  cargarSala();

  const channel = supabase
    .channel(`room-${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        console.log("Cambio recibido:", payload.new);

        setRunning(payload.new.running);
        setMode(payload.new.mode);
        setFocusDuration(payload.new.duration);

       if (payload.new.running && payload.new.started_at) {
        const inicio = new Date(payload.new.started_at).getTime();
        const ahora = Date.now();

        const transcurridos = Math.floor((ahora - inicio) / 1000);

        const total =
          payload.new.mode === "focus"
            ? payload.new.duration * 60
            : breakDuration * 60;

        setSeconds(Math.max(total - transcurridos, 0));
      } else {
        if (payload.new.mode === "focus") {
          setSeconds(payload.new.duration * 60);
        } else {
          setSeconds(breakDuration * 60);
        }
      }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [roomId]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          setRunning(false);

          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});

          if (Notification.permission === "granted") {
            new Notification(
              mode === "focus"
                ? "Focus terminado"
                : "Tutitututi terminado",
              {
                body:
                  mode === "focus"
                    ? "🧚🏻‍♀️✨ Es hora de un tutitututi."
                    : "🚗💨 Vuelta al Focus.",
              }
            );
          }

          if (mode === "focus") {
            setMode("break");
            return breakDuration * 60;
          } else {
            setMode("focus");
            return focusDuration * 60;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, mode, focusDuration, breakDuration]);

  async function toggleRunning() {
  if (!roomId) {
    setRunning(!running);
    return;
  }

  const nuevoEstado = !running;

  const update = {
    running: nuevoEstado,
  };

  if (nuevoEstado) {
    update.started_at = new Date().toISOString();
  } else {
    update.started_at = null;
  }

  console.log(update);

  const { error } = await supabase
    .from("rooms")
    .update(update)
    .eq("id", roomId);

  if (error) {
    console.error(error);
    return;
  }

  setRunning(nuevoEstado);
}

  function resetTimer() {
    setSeconds(
      mode === "focus"
        ? focusDuration * 60
        : breakDuration * 60
    );

    setRunning(false);
  }

  function skipBreak() {
    setMode("focus");
    setSeconds(focusDuration * 60);
    setRunning(false);
  }

  function changeDuration(minutes) {
    setFocusDuration(minutes);

    if (mode === "focus") {
      setSeconds(minutes * 60);
      setRunning(false);
    }
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-6 text-white transition-colors duration-700 ${
        mode === "focus"
          ? "bg-emerald-950"
          : "bg-emerald-600/75"
      }`}
    >
      <p className="mb-4 flex items-center gap-3 text-sm tracking-widest text-white/50">
        {mode === "focus" ? (
          <>
            FOCUS
            <span className="flex items-center gap-0.5">
              <Wind size={16} className="scale-x-[-1]" />
              <Car size={20} />
            </span>
          </>
        ) : (
          <>
            TUTITUTUTI
            <span className="flex items-center gap-0.5">
              <Wand size={20} />
              <Sparkles size={16} />
            </span>
          </>
        )}
      </p>

      <Timer seconds={seconds} />

      <PrimaryButton
        running={running}
        onClick={toggleRunning}
        mode={mode}
      />

      <SecondaryButton
        onClick={resetTimer}
        mode={mode}
      />

      {mode === "break" && (
        <button
          onClick={skipBreak}
          className="
            mt-3
            text-sm
            text-white/35
            hover:text-white/60
            transition
          "
        >
          Se nos ha vuelto a pasar...
        </button>
      )}

      <TimeSelector
        mode={mode}
        onSelect={changeDuration}
      />
    </div>
  );
}

export default App;