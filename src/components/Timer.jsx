function Timer({ seconds }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const time = `${minutes}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <section>
      <h2 className="select-none text-9xl font-extralight tracking-tight tabular-nums">
        {time}
      </h2>
    </section>
  );
}

export default Timer;