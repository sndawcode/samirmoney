import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  QuadraticBezierCurve3,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  Timer,
  Vector3,
  WebGLRenderer,
} from "three";

/**
 * "Un seul écosystème" (home S1): a glowing core, one orbiting node per solution, filaments carrying light
 * packets to the core, and a field of dust. Decorative only — framework-free so it loads after first paint.
 */

export type Quality = "high" | "medium" | "low";

const QUALITY = {
  high: { dpr: 2, dust: 1400, packetsPerLink: 4, segments: 64, antialias: true },
  medium: { dpr: 1.5, dust: 800, packetsPerLink: 3, segments: 48, antialias: true },
  low: { dpr: 1, dust: 350, packetsPerLink: 2, segments: 32, antialias: false },
} as const;

const WHITE = new Color("#ffffff");
const MINT = new Color("#d6fbea");

// The scene sits on the hero's #3CB088 gradient (client, 17 Oct 2026): brand green would melt into it, so
// structure is drawn in white and pale mint, at restrained opacities.
const PALETTE = {
  shell: { color: WHITE, opacity: 0.16 }, // slow wireframe shell
  halo: { color: MINT, opacity: 0.22 }, // soft light behind the globe
  node: WHITE,
  nodeGlow: { color: MINT, opacity: 0.4 },
  link: MINT,
  packet: WHITE,
  orbit: 0.12, // orbit rings
} as const;

const CAMERA_Z = 8;
const ROOT_SPIN = 0.025; // rad/s — slow, fluid rotation of the whole system
// Intro: the system scales up from 86 % over 1.8 s once the scene starts (skipped with reduced motion).
const INTRO = { from: 0.86, seconds: 1.8 };
// Reflection ring under the globe: anchors it in space.
const REFLECTION = { y: -1.45, scale: 3.4, opacity: 0.14 };
const SCROLL_PULLBACK = 3.5;
const POINTER_TILT = 0.28;
const LINK_OPACITY = { idle: 0.4, focused: 0.95, dimmed: 0.12 };

type Orbit = {
  radius: number;
  tiltX: number;
  tiltZ: number;
  speed: number;
  phase: number;
  lift: number;
};

// One orbit per solution, tuned by hand so the nodes never cross in front of the core at the same time.
const ORBITS: readonly Orbit[] = [
  { radius: 2.2, tiltX: 0.35, tiltZ: 0.1, speed: 0.12, phase: 0.0, lift: 0.9 },
  { radius: 2.7, tiltX: -0.25, tiltZ: 0.3, speed: 0.09, phase: 1.1, lift: -0.7 },
  { radius: 2.0, tiltX: 0.6, tiltZ: -0.25, speed: 0.15, phase: 2.2, lift: 0.6 },
  { radius: 3.0, tiltX: 0.15, tiltZ: -0.4, speed: 0.075, phase: 3.3, lift: -0.9 },
  { radius: 2.45, tiltX: -0.55, tiltZ: -0.1, speed: 0.105, phase: 4.3, lift: 0.8 },
  { radius: 2.85, tiltX: 0.45, tiltZ: 0.35, speed: 0.08, phase: 5.3, lift: -0.6 },
];

export type Layout = {
  /** Where the core sits on screen, as fractions of the canvas (0–1). */
  coreX: number;
  coreY: number;
  /** Larger = smaller scene. */
  distance: number;
  /** Badge size multiplier (smaller on phones, where the orbit passes near the headline). */
  badgeScale: number;
};

/** Artwork that orbits close around the globe (payment-method badges). */
export type Badge = { src: string; aspect: number };

// Badge ring: just outside the wireframe shell, inside the solutions' orbits.
const BADGE_ORBIT: Orbit = {
  radius: 1.55,
  tiltX: 0.32,
  tiltZ: -0.18,
  speed: 0.2,
  phase: 0,
  lift: 0,
};
const BADGE_HEIGHT = 0.4;
const BADGE_FADE_IN_SPEED = 2.5;
// Draw order: glow and lines (0) → centre logo (1) → badges (2). Badges in front of the globe cover the logo;
// badges behind it are hidden by the depth occluder, so the logo shows.
const RENDER_ORDER = { logo: 1, badge: 2 } as const;
// Centre logo: a little smaller than the glowing shell so its rim still frames it; breathes gently.
const LOGO_SIZE = 1.0;
const LOGO_BREATH = 0.025;
// Depth fade: badges dim from fully opaque in front of the globe to faint behind it (view-space units).
const BADGE_DEPTH_FADE = { behind: -1.1, front: 0.35, minOpacity: 0.12 };

export type EcosystemOptions = {
  canvas: HTMLCanvasElement;
  quality: Quality;
  /** false = reduced motion: one still frame, re-rendered only on resize or focus. */
  animate: boolean;
  nodeIds: readonly string[];
  badges?: readonly Badge[];
  /** Image shown at the centre of the globe (the Samir Money mark). */
  coreLogo?: string;
};

type Packet = { link: number; t: number; speed: number };

function glowTexture(): CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable for the glow texture");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export class EcosystemScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(40, 1, 0.1, 100);
  private readonly root = new Group();
  private readonly world = new Group();
  private readonly timer = new Timer();
  private readonly settings: (typeof QUALITY)[Quality];
  private readonly animate: boolean;
  private readonly nodeIds: readonly string[];
  private readonly disposables: { dispose: () => void }[] = [];

  private readonly wire: Mesh;
  private readonly nodes: Group[] = [];
  private readonly links: {
    line: Line;
    geometry: BufferGeometry;
    material: LineBasicMaterial;
    curve: QuadraticBezierCurve3;
  }[] = [];
  private readonly packets: Packet[] = [];
  private readonly packetGeometry = new BufferGeometry();
  private readonly dust: Points;
  private readonly badges: {
    sprite: Sprite;
    material: SpriteMaterial;
    aspect: number;
    loaded: boolean;
    visibility: number;
  }[] = [];
  private logo: {
    sprite: Sprite;
    material: SpriteMaterial;
    loaded: boolean;
    visibility: number;
  } | null = null;
  private readonly scratchView = new Vector3();
  private readonly coreView = new Vector3();

  private size = { width: 1, height: 1 };
  private layout: Layout = { coreX: 0.5, coreY: 0.5, distance: CAMERA_Z, badgeScale: 1 };
  private pointer = { x: 0, y: 0 };
  private tilt = { x: 0, y: 0 };
  private scroll = 0;
  private focused: number | null = null;
  private elapsed = 7; // a pleasing still frame for reduced motion
  private intro = 0; // 0 → 1 over INTRO.seconds; stays 1 with reduced motion
  private frame = 0;
  private running = false;
  // Scratch vectors reused every frame (no per-frame allocations on phones).
  private readonly origin = new Vector3();
  private readonly scratchMid = new Vector3();
  private readonly scratchPoint = new Vector3();

  constructor({ canvas, quality, animate, nodeIds, badges = [], coreLogo }: EcosystemOptions) {
    this.settings = QUALITY[quality];
    this.animate = animate;
    this.nodeIds = nodeIds;
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: this.settings.antialias,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.settings.dpr));

    const glow = glowTexture();
    this.disposables.push(glow);

    // Core: the brand mark (see addCoreLogo) inside a slow wireframe shell and a soft halo. No solid shell
    // around the mark: on the green hero any rim reads as an outline.
    const wireGeometry = new IcosahedronGeometry(0.9, 1);
    const wireMaterial = new MeshBasicMaterial({
      color: PALETTE.shell.color,
      wireframe: true,
      transparent: true,
      opacity: PALETTE.shell.opacity,
      blending: AdditiveBlending,
      depthWrite: false,
    });
    this.wire = new Mesh(wireGeometry, wireMaterial);
    const halo = new Sprite(
      new SpriteMaterial({
        map: glow,
        color: PALETTE.halo.color,
        transparent: true,
        opacity: PALETTE.halo.opacity,
        blending: AdditiveBlending,
        depthWrite: false,
        depthTest: false, // the globe's glow: never hidden by the depth-only occluder
      }),
    );
    halo.scale.setScalar(4.2);
    this.world.add(halo, this.wire);
    this.disposables.push(wireGeometry, wireMaterial, halo.material);

    // Orbit rings and nodes.
    const nodeGeometry = new SphereGeometry(0.042, 16, 16);
    const nodeMaterial = new MeshBasicMaterial({ color: PALETTE.node });
    this.disposables.push(nodeGeometry, nodeMaterial);
    ORBITS.slice(0, nodeIds.length).forEach((orbit) => {
      const ring = this.orbitRing(orbit);
      this.world.add(ring);

      const node = new Group();
      const dot = new Mesh(nodeGeometry, nodeMaterial);
      const nodeGlow = new Sprite(
        new SpriteMaterial({
          map: glow,
          color: PALETTE.nodeGlow.color,
          transparent: true,
          opacity: PALETTE.nodeGlow.opacity,
          blending: AdditiveBlending,
          depthWrite: false,
        }),
      );
      nodeGlow.scale.setScalar(0.42);
      this.disposables.push(nodeGlow.material);
      node.add(nodeGlow, dot);
      this.nodes.push(node);
      this.world.add(node);

      const curve = new QuadraticBezierCurve3(new Vector3(), new Vector3(), new Vector3());
      const geometry = new BufferGeometry();
      geometry.setAttribute(
        "position",
        new BufferAttribute(new Float32Array((this.settings.segments + 1) * 3), 3),
      );
      const material = new LineBasicMaterial({
        color: PALETTE.link,
        transparent: true,
        opacity: LINK_OPACITY.idle,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const line = new Line(geometry, material);
      this.links.push({ line, geometry, material, curve });
      this.world.add(line);
      this.disposables.push(geometry, material);
    });

    // Packets travelling node → core.
    this.links.forEach((_, link) => {
      for (let i = 0; i < this.settings.packetsPerLink; i++) {
        this.packets.push({
          link,
          t: i / this.settings.packetsPerLink,
          speed: 0.18 + ((link * 7 + i * 3) % 5) * 0.03,
        });
      }
    });
    this.packetGeometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(this.packets.length * 3), 3),
    );
    const packetMaterial = new PointsMaterial({
      map: glow,
      color: PALETTE.packet,
      size: 0.3,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.world.add(new Points(this.packetGeometry, packetMaterial));
    this.disposables.push(this.packetGeometry, packetMaterial);

    // Dust: a deterministic shell of faint particles (seeded, so every visit looks the same).
    const dustGeometry = new BufferGeometry();
    const dustPositions = new Float32Array(this.settings.dust * 3);
    let seed = 7;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < this.settings.dust; i++) {
      const r = 3.5 + random() * 6;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      dustPositions.set(
        [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.6,
          r * Math.sin(phi) * Math.sin(theta),
        ],
        i * 3,
      );
    }
    dustGeometry.setAttribute("position", new BufferAttribute(dustPositions, 3));
    const dustMaterial = new PointsMaterial({
      map: glow,
      color: WHITE,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    this.dust = new Points(dustGeometry, dustMaterial);
    this.disposables.push(dustGeometry, dustMaterial);

    // Depth-only sphere inside the glow: badges passing behind the globe are hidden by it, not drawn over it.
    const occluderGeometry = new SphereGeometry(0.6, 32, 32);
    const occluderMaterial = new MeshBasicMaterial({ colorWrite: false });
    const occluder = new Mesh(occluderGeometry, occluderMaterial);
    occluder.renderOrder = -1;
    this.world.add(occluder);
    this.disposables.push(occluderGeometry, occluderMaterial);

    if (coreLogo) this.addCoreLogo(coreLogo);
    this.addBadges(badges);

    const reflection = new Mesh(
      new PlaneGeometry(1, 1),
      new MeshBasicMaterial({
        map: glow,
        color: WHITE,
        transparent: true,
        opacity: REFLECTION.opacity,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.y = REFLECTION.y;
    reflection.scale.set(REFLECTION.scale, REFLECTION.scale * 0.55, 1);
    this.world.add(reflection);
    this.disposables.push(reflection.geometry, reflection.material as MeshBasicMaterial);

    this.root.add(this.world, this.dust);
    this.scene.add(this.root);
    this.camera.position.set(0, 0, CAMERA_Z);
  }

  /** The brand mark at the heart of the globe: always facing the viewer, faded in once loaded. */
  private addCoreLogo(src: string): void {
    const material = new SpriteMaterial({
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    });
    const sprite = new Sprite(material);
    sprite.renderOrder = RENDER_ORDER.logo;
    sprite.scale.setScalar(LOGO_SIZE);
    this.logo = { sprite, material, loaded: false, visibility: 0 };
    this.world.add(sprite);
    this.disposables.push(material);
    new TextureLoader().load(
      src,
      (texture) => {
        texture.colorSpace = SRGBColorSpace;
        texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
        material.map = texture;
        material.needsUpdate = true;
        this.disposables.push(texture);
        if (this.logo) this.logo.loaded = true;
        if (!this.running && this.logo) {
          this.logo.visibility = 1;
          this.renderFrame(0);
        }
      },
      undefined,
      () => {
        sprite.visible = false;
      },
    );
  }

  /** Loads each badge texture; badges fade in as they arrive, the scene never waits for them. */
  private addBadges(badges: readonly Badge[]): void {
    const loader = new TextureLoader();
    badges.forEach((badge) => {
      const material = new SpriteMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const sprite = new Sprite(material);
      sprite.renderOrder = RENDER_ORDER.badge;
      sprite.scale.set(BADGE_HEIGHT * badge.aspect, BADGE_HEIGHT, 1);
      const entry = { sprite, material, aspect: badge.aspect, loaded: false, visibility: 0 };
      this.badges.push(entry);
      this.world.add(sprite);
      this.disposables.push(material);
      loader.load(
        badge.src,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.min(4, this.renderer.capabilities.getMaxAnisotropy());
          material.map = texture;
          material.needsUpdate = true;
          entry.loaded = true;
          this.disposables.push(texture);
          if (!this.running) {
            entry.visibility = 1;
            this.renderFrame(0);
          }
        },
        undefined,
        () => {
          // A missing badge simply never appears; the rest of the scene is unaffected.
          sprite.visible = false;
        },
      );
    });
  }

  /** Compiles every shader without blocking the main thread (KHR_parallel_shader_compile where available). */
  async warmUp(): Promise<void> {
    await this.renderer.compileAsync(this.scene, this.camera);
  }

  /** Thin elliptical ring showing a node's orbit. */
  private orbitRing(orbit: Orbit): LineLoop {
    const steps = 96;
    const positions = new Float32Array(steps * 3);
    for (let i = 0; i < steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      positions.set(this.orbitPoint(orbit, a).toArray(), i * 3);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const material = new LineBasicMaterial({
      color: WHITE,
      transparent: true,
      opacity: PALETTE.orbit,
      depthWrite: false,
    });
    this.disposables.push(geometry, material);
    return new LineLoop(geometry, material);
  }

  private orbitPoint(orbit: Orbit, angle: number, target = new Vector3()): Vector3 {
    const x = Math.cos(angle) * orbit.radius;
    const z = Math.sin(angle) * orbit.radius;
    // Tilt the circle around X then Z.
    const y1 = -z * Math.sin(orbit.tiltX);
    const z1 = z * Math.cos(orbit.tiltX);
    return target.set(
      x * Math.cos(orbit.tiltZ) - y1 * Math.sin(orbit.tiltZ),
      x * Math.sin(orbit.tiltZ) + y1 * Math.cos(orbit.tiltZ),
      z1,
    );
  }

  resize(width: number, height: number, layout: Layout): void {
    this.size = { width: Math.max(1, width), height: Math.max(1, height) };
    this.layout = layout;
    this.renderer.setSize(this.size.width, this.size.height, false);
    this.camera.aspect = this.size.width / this.size.height;
    // Shift the projection so the core sits at (coreX, coreY) without moving the camera.
    this.camera.setViewOffset(
      this.size.width,
      this.size.height,
      (0.5 - layout.coreX) * this.size.width,
      (0.5 - layout.coreY) * this.size.height,
      this.size.width,
      this.size.height,
    );
    this.camera.updateProjectionMatrix();
    for (const badge of this.badges) {
      badge.sprite.scale.set(
        BADGE_HEIGHT * badge.aspect * layout.badgeScale,
        BADGE_HEIGHT * layout.badgeScale,
        1,
      );
    }
    if (!this.running) this.renderFrame(0);
  }

  /** Pointer position, -1…1 on both axes. */
  setPointer(x: number, y: number): void {
    this.pointer = { x, y };
  }

  /** 0 = hero in view, 1 = scrolled past. */
  setScroll(progress: number): void {
    this.scroll = Math.min(1, Math.max(0, progress));
    if (!this.running) this.renderFrame(0);
  }

  /** Highlights a solution's node and filament; null restores the idle state. */
  focus(id: string | null): void {
    const index = id === null ? -1 : this.nodeIds.indexOf(id);
    this.focused = index >= 0 ? index : null;
    if (!this.running) this.renderFrame(0);
  }

  start(): void {
    if (!this.animate || this.running) {
      this.renderFrame(0);
      return;
    }
    this.running = true;
    this.timer.reset();
    const loop = (timestamp: number) => {
      if (!this.running) return;
      this.timer.update(timestamp);
      this.renderFrame(Math.min(this.timer.getDelta(), 0.05));
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private renderFrame(delta: number): void {
    this.elapsed += delta;
    const t = this.elapsed;
    this.intro = this.animate ? Math.min(1, this.intro + delta / INTRO.seconds) : 1;
    const eased = 1 - Math.pow(1 - this.intro, 3);
    this.root.scale.setScalar(INTRO.from + (1 - INTRO.from) * eased);
    const focus = this.focused;

    // Pointer tilt, eased.
    this.tilt.x += (this.pointer.y * POINTER_TILT - this.tilt.x) * Math.min(1, delta * 3 || 1);
    this.tilt.y += (this.pointer.x * POINTER_TILT - this.tilt.y) * Math.min(1, delta * 3 || 1);
    this.root.rotation.set(0.18 + this.tilt.x, t * ROOT_SPIN + this.tilt.y, 0);
    this.dust.rotation.y = -t * 0.01;

    // Scroll: the camera pulls back as the hero leaves the viewport.
    this.camera.position.z = this.layout.distance + this.scroll * SCROLL_PULLBACK;

    this.wire.rotation.set(t * 0.12, t * 0.18, 0);

    if (this.logo) {
      if (this.logo.loaded)
        this.logo.visibility = Math.min(
          1,
          this.logo.visibility + (delta * BADGE_FADE_IN_SPEED || 1),
        );
      this.logo.material.opacity = this.logo.visibility;
      this.logo.sprite.scale.setScalar(LOGO_SIZE * (1 + LOGO_BREATH * Math.sin(t * 1.6)));
    }

    this.nodes.forEach((node, i) => {
      const orbit = ORBITS[i];
      this.orbitPoint(orbit, orbit.phase + t * orbit.speed, node.position);
      const isFocused = focus === i;
      const scale = isFocused ? 1.9 : 1;
      node.scale.setScalar(node.scale.x + (scale - node.scale.x) * Math.min(1, delta * 8 || 1));

      // Filament: node → core, bowed outward so the lines read as arcs.
      const link = this.links[i];
      const mid = this.scratchMid.copy(node.position).multiplyScalar(0.5);
      mid.y += orbit.lift;
      link.curve.v0.copy(node.position);
      link.curve.v1.copy(mid);
      link.curve.v2.copy(this.origin);
      const positions = link.geometry.getAttribute("position") as BufferAttribute;
      const p = this.scratchPoint;
      for (let s = 0; s <= this.settings.segments; s++) {
        link.curve.getPoint(s / this.settings.segments, p);
        positions.setXYZ(s, p.x, p.y, p.z);
      }
      positions.needsUpdate = true;
      const target =
        focus === null ? LINK_OPACITY.idle : isFocused ? LINK_OPACITY.focused : LINK_OPACITY.dimmed;
      link.material.opacity += (target - link.material.opacity) * Math.min(1, delta * 6 || 1);
    });

    // Badges: evenly spaced on their ring, dimming as they pass behind the globe.
    if (this.badges.length > 0) {
      this.root.updateMatrixWorld();
      this.camera.updateMatrixWorld();
      this.coreView
        .setFromMatrixPosition(this.world.matrixWorld)
        .applyMatrix4(this.camera.matrixWorldInverse);
      const step = (Math.PI * 2) / this.badges.length;
      this.badges.forEach((badge, i) => {
        this.orbitPoint(BADGE_ORBIT, i * step + t * BADGE_ORBIT.speed, badge.sprite.position);
        if (badge.loaded)
          badge.visibility = Math.min(1, badge.visibility + (delta * BADGE_FADE_IN_SPEED || 1));
        this.scratchView
          .copy(badge.sprite.position)
          .applyMatrix4(this.world.matrixWorld)
          .applyMatrix4(this.camera.matrixWorldInverse);
        const depth = this.scratchView.z - this.coreView.z; // > 0: in front of the globe
        const k = Math.min(
          1,
          Math.max(
            0,
            (depth - BADGE_DEPTH_FADE.behind) / (BADGE_DEPTH_FADE.front - BADGE_DEPTH_FADE.behind),
          ),
        );
        const smooth = k * k * (3 - 2 * k);
        badge.material.opacity =
          badge.visibility *
          (BADGE_DEPTH_FADE.minOpacity + (1 - BADGE_DEPTH_FADE.minOpacity) * smooth);
      });
    }

    const packetPositions = this.packetGeometry.getAttribute("position") as BufferAttribute;
    const p = this.scratchPoint;
    this.packets.forEach((packet, i) => {
      const boost = focus === packet.link ? 2.2 : 1;
      packet.t = (packet.t + delta * packet.speed * boost) % 1;
      this.links[packet.link].curve.getPoint(packet.t, p);
      packetPositions.setXYZ(i, p.x, p.y, p.z);
    });
    packetPositions.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.stop();
    for (const item of this.disposables) item.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
