function PrimaryButton({ running, onClick, mode }) {
  return (
    <button
      onClick={onClick}
      className={`
        mt-12
        rounded-xl
        px-8
        py-3
        text-lg
        transition
        ${
          mode === "focus"
            ? "bg-emerald-700 hover:bg-emerald-600"
            : "bg-emerald-700/90 hover:bg-emerald-600"
        }
      `}
    >
      {running ? "Pause" : "Start"}
    </button>
  );
}

export default PrimaryButton;