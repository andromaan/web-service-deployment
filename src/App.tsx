import { useMemo, useState } from "react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import "./App.css";

type Platform = "vercel" | "github-pages";

const deployContent: Record<Platform, { title: string; steps: string[] }> = {
  vercel: {
    title: "Deploy on Vercel",
    steps: [
      "Import the repository from GitHub.",
      "Set Build Command: npm run build.",
      "Set Output Directory: dist.",
      "Click Deploy and get a live URL in seconds.",
    ],
  },
  "github-pages": {
    title: "Deploy on GitHub Pages",
    steps: [
      "Use npm run build:gh-pages for base path support.",
      "Publish the dist folder via GitHub Actions.",
      "Enable Pages from Actions in repository settings.",
      "Share the static website URL with your team.",
    ],
  },
};

function App() {
  const [likes, setLikes] = useState(18);
  const [platform, setPlatform] = useState<Platform>("vercel");
  const [copied, setCopied] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage("");

    const S3_BUCKET = import.meta.env.VITE_AWS_BUCKET;
    const REGION = import.meta.env.VITE_AWS_REGION;

    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });

    const arrayBuffer = await file.arrayBuffer();

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: new Uint8Array(arrayBuffer),
      ContentType: file.type,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      setMessage(`✅ Файл "${file.name}" успішно завантажено в S3!`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Помилка завантаження");
    } finally {
      setUploading(false);
    }
  };

  const activeGuide = useMemo(() => deployContent[platform], [platform]);
  const imageRef = "ghcr.io/andromaan/web-service-deployment:latest";

  const handleCopyImageRef = async () => {
    try {
      await navigator.clipboard.writeText(`docker pull ${imageRef}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="page">
      <div className="bg-shape bg-shape-left" aria-hidden="true" />
      <div className="bg-shape bg-shape-right" aria-hidden="true" />

      <section className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">React + Vite Showcase</p>
        <h1 id="hero-title">
          Build once. Launch anywhere. Look great doing it.
        </h1>
        <p className="hero-text">
          This starter now feels like a real product page with motion, depth,
          and interactive blocks so your demo looks impressive on Vercel or
          GitHub Pages.
        </p>

        <div className="hero-actions">
          <button
            className="cta"
            type="button"
            onClick={() => setLikes((value) => value + 1)}
          >
            Send a Like Pulse
          </button>
          <a
            className="ghost"
            href="https://vite.dev/guide/static-deploy"
            target="_blank"
            rel="noreferrer"
          >
            Read Deploy Guide
          </a>
        </div>

        <div className="stats" role="list" aria-label="Project metrics">
          <article className="stat-card" role="listitem">
            <p className="stat-value">{likes}</p>
            <p className="stat-label">Live reactions</p>
          </article>
          <article className="stat-card" role="listitem">
            <p className="stat-value">98</p>
            <p className="stat-label">Lighthouse score</p>
          </article>
          <article className="stat-card" role="listitem">
            <p className="stat-value">2</p>
            <p className="stat-label">One-click platforms</p>
          </article>
        </div>
      </section>

      <section className="panel deploy-panel" aria-labelledby="deploy-title">
        <div className="panel-header">
          <h2 id="deploy-title">Quick deploy mode</h2>
          <div
            className="switch"
            role="tablist"
            aria-label="Deployment platform"
          >
            <button
              type="button"
              role="tab"
              aria-selected={platform === "vercel"}
              className={platform === "vercel" ? "tab active" : "tab"}
              onClick={() => setPlatform("vercel")}
            >
              Vercel
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={platform === "github-pages"}
              className={platform === "github-pages" ? "tab active" : "tab"}
              onClick={() => setPlatform("github-pages")}
            >
              GitHub Pages
            </button>
          </div>
        </div>

        <article
          className="guide"
          role="tabpanel"
          aria-label={activeGuide.title}
        >
          <h3>{activeGuide.title}</h3>
          <ul>
            {activeGuide.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>

          <p className="hint">
            Pro tip: keep build artifacts static so deploys stay fast and
            predictable.
          </p>
        </article>
      </section>

      <section className="panel docker-panel" aria-labelledby="docker-title">
        <div className="docker-head">
          <h2 id="docker-title">Also available as GitHub Docker image</h2>
          <span className="badge">GHCR</span>
        </div>
        <p>
          This project is published to GitHub Container Registry, so you can run
          it as a container without local build steps.
        </p>

        <div className="docker-command-wrap">
          <code className="docker-command">docker pull {imageRef}</code>
          <button
            type="button"
            className="copy-btn"
            onClick={handleCopyImageRef}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </section>

      <section className="feature-grid" aria-label="Features">
        <article className="panel feature-card">
          <h3>Animated visual layer</h3>
          <p>
            Floating gradients and staggered card reveals make the page feel
            alive immediately on load.
          </p>
        </article>
        <article className="panel feature-card">
          <h3>Interactive controls</h3>
          <p>
            Tabs and live counters turn a static template into a demo users can
            click and explore.
          </p>
        </article>
        <article className="panel feature-card">
          <h3>Ready for presentation</h3>
          <p>
            Responsive layout, accessible controls, and clean spacing look
            polished in portfolio links and CI previews.
          </p>
        </article>
      </section>

      <section
        className="panel"
        aria-labelledby="upload-title"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        <h2 id="upload-title">Тест завантаження в S3 (Лабораторна №7)</h2>

        <input
          type="file"
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />

        <br />
        <br />

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          style={{ padding: "12px 24px", fontSize: "16px" }}
        >
          {uploading ? "Завантажується..." : "Завантажити в S3"}
        </button>

        {message && (
          <p style={{ marginTop: "20px", fontSize: "18px" }}>{message}</p>
        )}
      </section>

      <footer className="footer">
        Crafted for deployment demos that should feel memorable, not generic.
      </footer>
    </main>
  );
}

export default App;
