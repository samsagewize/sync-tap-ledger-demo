import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BadgeCheck,
  CircleDollarSign,
  FileDown,
  Download,
  Fingerprint,
  History,
  Link,
  Music2,
  Nfc,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UsersRound,
  WalletCards
} from "lucide-react";
import "./styles.css";

const initialContributors = [
  { name: "Sam Sage", role: "Producer", split: 35, status: "confirmed", device: "iPhone 15" },
  { name: "Maya Lux", role: "Writer", split: 25, status: "confirmed", device: "Pixel 9" },
  { name: "Tone Wells", role: "Vocalist", split: 25, status: "pending", device: "Galaxy S25" },
  { name: "Iris Vale", role: "Engineer", split: 15, status: "confirmed", device: "iPhone 14" }
];

const ledgerBase = [
  { time: "10:08 PM", event: "Session opened", detail: "Midnight Signal record created by Sam Sage" },
  { time: "10:11 PM", event: "Tap accepted", detail: "Maya Lux joined through NFC tap-in" },
  { time: "10:18 PM", event: "Credit added", detail: "Tone Wells added as vocalist and writer" },
  { time: "10:29 PM", event: "Split draft", detail: "Revenue shares total 100% across four collaborators" },
  { time: "10:34 PM", event: "Proof attached", detail: "Voice memo, rough bounce, and studio location linked" }
];

function App() {
  const [contributors, setContributors] = useState(initialContributors);
  const [tapCount, setTapCount] = useState(4);
  const [selectedRole, setSelectedRole] = useState("Songwriter");
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const totalSplit = useMemo(
    () => contributors.reduce((sum, person) => sum + person.split, 0),
    [contributors]
  );

  const allConfirmed = contributors.every((person) => person.status === "confirmed");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    setIsInstalled(Boolean(standalone));

    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallPrompt(event);
    }

    function handleInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  function simulateTap() {
    const newPerson = {
      name: `Guest ${tapCount + 1}`,
      role: selectedRole,
      split: 0,
      status: "pending",
      device: tapCount % 2 ? "iPhone" : "Android"
    };
    setTapCount((count) => count + 1);
    setContributors((people) => [...people, newPerson]);
  }

  function confirmPerson(index) {
    setContributors((people) =>
      people.map((person, personIndex) =>
        personIndex === index ? { ...person, status: "confirmed" } : person
      )
    );
  }

  async function installApp() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === "accepted") {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  }

  return (
    <main className="app-shell">
      <div className="app-install-bar">
        <div>
          <strong>Sync app</strong>
          <span>{isInstalled ? "Installed workspace" : "Installable phone-first demo"}</span>
        </div>
        <button onClick={installApp} disabled={!installPrompt || isInstalled}>
          <Download size={16} />
          {isInstalled ? "Installed" : "Install app"}
        </button>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <div className="brand-mark">
            <span><Nfc size={18} /></span>
            Sync
          </div>
          <h1>Tap in, register the record, leave with the ledger.</h1>
          <p>
            Sync helps musicians capture credits, splits, approvals, and proof while the song is
            still being made. No paperwork pileup, no mystery ownership, no lost contributors.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="primary-action"><Smartphone size={18} /> Try demo flow</a>
            <a href="#ledger" className="secondary-action"><History size={18} /> View ledger</a>
          </div>
        </div>
        <div className="phone-stage" aria-label="Sync mobile session preview">
          <div className="tap-ring ring-one" />
          <div className="tap-ring ring-two" />
          <div className="phone-mock">
            <div className="phone-top" />
            <div className="phone-screen">
              <div className="session-card">
                <span className="tiny-label">Live session</span>
                <strong>Midnight Signal</strong>
                <small>Tap to join credits</small>
              </div>
              <div className="nfc-zone">
                <Nfc size={46} />
              </div>
              <div className="mini-ledger">
                <span><BadgeCheck size={14} /> 3 approved</span>
                <span><UsersRound size={14} /> 4 contributors</span>
                <span><ShieldCheck size={14} /> audit ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-band" aria-label="Sync value summary">
        <Metric icon={<Fingerprint />} label="Tap-in identity" value="NFC + QR fallback" />
        <Metric icon={<CircleDollarSign />} label="Splits tracked" value={`${totalSplit}% allocated`} />
        <Metric icon={<ShieldCheck />} label="Transparency" value="Event-level ledger" />
        <Metric icon={<FileDown />} label="Exports" value="Label-ready packet" />
      </section>

      <section className="workspace" id="demo">
        <div className="panel session-panel">
          <div className="section-heading">
            <span>Demo session</span>
            <h2>Midnight Signal</h2>
          </div>
          <div className="session-grid">
            <InfoItem label="Artist" value="Sam Sage" />
            <InfoItem label="Room" value="North Loop Studio B" />
            <InfoItem label="Record ID" value="SYNC-0626-8841" />
            <InfoItem label="Status" value={allConfirmed ? "Ready to export" : "Awaiting approvals"} />
          </div>
          <div className="tap-console">
            <div>
              <span className="tiny-label">Tap-in role</span>
              <div className="role-picker" role="group" aria-label="Role picker">
                {["Songwriter", "Producer", "Vocalist"].map((role) => (
                  <button
                    key={role}
                    className={role === selectedRole ? "is-active" : ""}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <button className="tap-button" onClick={simulateTap}>
              <Nfc size={20} />
              Simulate phone tap
            </button>
          </div>
        </div>

        <div className="panel qr-panel">
          <div className="qr-card">
            <QrCode size={92} />
          </div>
          <div>
            <span className="tiny-label">Fallback invite</span>
            <h2>Scan if NFC is unavailable</h2>
            <p>Every invite resolves to the same session record, identity prompt, and approval trail.</p>
            <button className="text-button"><Link size={17} /> Copy secure link</button>
          </div>
        </div>
      </section>

      <section className="contributors">
        <div className="section-heading">
          <span>Credits and splits</span>
          <h2>Everyone can see the same record</h2>
        </div>
        <div className="contributor-grid">
          {contributors.map((person, index) => (
            <article className="contributor-card" key={`${person.name}-${index}`}>
              <div className="avatar">{person.name.slice(0, 2).toUpperCase()}</div>
              <div className="person-details">
                <h3>{person.name}</h3>
                <p>{person.role} · {person.device}</p>
              </div>
              <div className="split-pill">{person.split}%</div>
              {person.status === "confirmed" ? (
                <span className="status confirmed"><BadgeCheck size={15} /> Confirmed</span>
              ) : (
                <button className="status pending" onClick={() => confirmPerson(index)}>
                  Confirm
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="ledger-section" id="ledger">
        <div className="section-heading">
          <span>Transparent ledger</span>
          <h2>Every important move is visible</h2>
        </div>
        <div className="ledger">
          {[...ledgerBase, {
            time: "Now",
            event: allConfirmed ? "Record approved" : "Approval pending",
            detail: allConfirmed
              ? "All collaborators confirmed the current session credits"
              : "Waiting on remaining collaborators to approve the record"
          }].map((item) => (
            <div className="ledger-row" key={`${item.time}-${item.event}`}>
              <time>{item.time}</time>
              <div>
                <strong>{item.event}</strong>
                <p>{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="export-band">
        <div>
          <span className="tiny-label">Output packet</span>
          <h2>Ready for distributors, PROs, labels, and lawyers.</h2>
        </div>
        <div className="export-actions">
          <button><WalletCards size={18} /> Split sheet</button>
          <button><Music2 size={18} /> Metadata</button>
          <button><FileDown size={18} /> Export PDF</button>
        </div>
      </section>

      <footer>
        <Sparkles size={16} />
        Built as a Sync concept demo: tap-in registration, no paperwork drag, full ledger visibility.
      </footer>
    </main>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
