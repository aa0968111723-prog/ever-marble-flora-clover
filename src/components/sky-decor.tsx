const SCENE_SRC = "/scene.jpg";

export function SkyDecor() {
  return (
    <div className="scene" aria-hidden="true">
      <img className="scene-img" src={SCENE_SRC} alt="" />
      <div className="scene-veil" />
      <div className="scene-grain" />
    </div>
  );
}

export function SceneHero() {
  return (
    <figure className="scene-hero">
      <img
        src={SCENE_SRC}
        alt="淡江禪學社木廊：同學與龜龜看著淡水風景"
        width={1587}
        height={2245}
        decoding="async"
        fetchPriority="high"
      />
      <div className="scene-hero-shade" />
      <figcaption className="scene-hero-cap">龜龜在木廊上等你</figcaption>
    </figure>
  );
}

export function SceneRibbon() {
  return (
    <div className="scene-ribbon" aria-hidden="true">
      <img src={SCENE_SRC} alt="" width={1587} height={2245} decoding="async" />
    </div>
  );
}
