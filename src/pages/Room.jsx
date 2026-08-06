import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Room() {
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      // 1. Buscar la sala
      let { data } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      // 2. Si no existe, crearla
      if (!data) {
        await supabase
          .from("rooms")
          .insert({
            id,
            mode: "focus",
            duration: 60,
            running: false,
          });

        // 3. Volver a leerla
        const result = await supabase
          .from("rooms")
          .select("*")
          .eq("id", id)
          .single();

        data = result.data;
      }

      setRoom(data);
      setLoading(false);
    }

    loadRoom();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-950 text-white">
        Cargando sala...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-950 text-white">
      <h1 className="text-4xl font-bold">
        Sala: {room.id}
      </h1>

      <p className="mt-4">
        Modo: {room.mode}
      </p>

      <p>
        Duración: {room.duration}
      </p>
    </div>
  );
}

export default Room;