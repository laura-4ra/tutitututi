function SecondaryButton({ onClick, mode }) {
  return (
    <button
      onClick={onClick}
      className={`
        mt-4
        rounded-xl
        border
        border-white/20
        px-6
        py-2
        text-sm
        text-white/70
        transition
        hover:text-white
        ${
          mode === "focus"
            ? "bg-emerald-900 hover:bg-emerald-800"
            : "bg-emerald-800/70 hover:bg-emerald-700/80"
        }
      `}
    >
      Reset
    </button>
  );
}

export default SecondaryButton;