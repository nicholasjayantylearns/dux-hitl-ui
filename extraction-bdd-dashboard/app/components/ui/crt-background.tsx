export function CrtBackground() {
  return (
    <>
      <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 3px 100%",
        }}
      ></div>
      <div className="absolute inset-0 z-0 animate-flicker opacity-10"></div>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.9) 100%)",
          mixBlendMode: "overlay",
        }}
      ></div>
    </>
  )
}
