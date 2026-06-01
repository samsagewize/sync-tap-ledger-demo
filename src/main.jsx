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
  {
    name: "Sam Sage",
    role: "Producer",
    split: 35,
    status: "confirmed",
    device: "iPhone 15",
    pro: "BMI",
    ipi: "00342190872",
    publisher: "Sage Signal Music",
    publisherIpi: "00884112019"
  },
  {
    name: "Maya Lux",
    role: "Writer",
    split: 25,
    status: "confirmed",
    device: "Pixel 9",
    pro: "ASCAP",
    ipi: "00630218841",
    publisher: "Self-published",
    publisherIpi: "Not assigned"
  },
  {
    name: "Tone Wells",
    role: "Vocalist",
    split: 25,
    status: "pending",
    device: "Galaxy S25",
    pro: "BMI",
    ipi: "",
    publisher: "",
    publisherIpi: ""
  },
  {
    name: "Iris Vale",
    role: "Engineer",
    split: 15,
    status: "confirmed",
    device: "iPhone 14",
    pro: "ASCAP",
    ipi: "00491822016",
    publisher: "Vale Room Admin",
    publisherIpi: "00774199002"
  }
];

const ledgerBase = [
  { time: "10:08 PM", event: "Room opened", detail: "Sam created a registration room for Midnight Signal" },
  { time: "10:11 PM", event: "Invite accepted", detail: "Maya joined through the studio QR link" },
  { time: "10:18 PM", event: "Rights profile requested", detail: "Tone needs IPI/CAE and publisher info before registration" },
  { time: "10:29 PM", event: "Splits drafted", detail: "Writer ownership totals 100% across four collaborators" },
  { time: "10:34 PM", event: "Proof attached", detail: "Bounce, voice memo, and room timestamp linked to the record" }
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

  const completedProfiles = useMemo(
    () => contributors.filter((person) => hasRegistrationProfile(person)).length,
    [contributors]
  );
  const missingProfiles = contributors.length - completedProfiles;
  const allConfirmed = contributors.every((person) => person.status === "confirmed");
  const registrationReady = totalSplit === 100 && allConfirmed && missingProfiles === 0;

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
      device: tapCount % 2 ? "iPhone" : "Android",
      pro: "Choose PRO",
      ipi: "",
      publisher: "",
      publisherIpi: ""
    };
    setTapCount((count) => count + 1);
    setContributors((people) => [...people, newPerson]);
  }

  function confirmPerson(index) {
    setContributors((people) =>
      people.map((person, personIndex) =>
        personIndex === index
          ? {
              ...person,
              status: "confirmed",
              pro: person.pro === "Choose PRO" ? "BMI" : person.pro,
              ipi: person.ipi || "Needs real IPI",
              publisher: person.publisher || "Needs publisher choice"
            }
          : person
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
          <h1>Tap into the room. Leave ready to register with BMI or ASCAP.</h1>
          <p>
            Sync turns the messy song-registration chase into a shared app room. Invite every
            writer, collect PRO details, verify IPI/CAE and publisher info, approve splits, then
            hand off a clean registration packet.
          </p>
          <div className="hero-actions">
            <a href="#demo" className="primary-action"><Smartphone size={18} /> Try room flow</a>
            <a href="#ledger" className="secondary-action"><History size={18} /> View audit trail</a>
          </div>
        </div>
        <div className="phone-stage" aria-label="Sync mobile registration room preview">
          <div className="tap-ring ring-one" />
          <div className="tap-ring ring-two" />
          <div className="phone-mock">
            <div className="phone-top" />
            <div className="phone-screen">
              <div className="session-card">
                <span className="tiny-label">Registration room</span>
                <strong>Midnight Signal</strong>
                <small>Join and complete your rights profile</small>
              </div>
              <div className="nfc-zone">
                <Nfc size={46} />
              </div>
              <div className="mini-ledger">
                <span><BadgeCheck size={14} /> {completedProfiles} profiles ready</span>
                <span><UsersRound size={14} /> {contributors.length} writers invited</span>
                <span><ShieldCheck size={14} /> {missingProfiles} missing profiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-band" aria-label="Sync value summary">
        <Metric icon={<Fingerprint />} label="Invite room" value="QR + app install" />
        <Metric icon={<WalletCards />} label="Rights profiles" value={`${completedProfiles}/${contributors.length} complete`} />
        <Metric icon={<CircleDollarSign />} label="Splits tracked" value={`${totalSplit}% allocated`} />
        <Metric icon={<FileDown />} label="PRO packet" value={registrationReady ? "Ready" : "Needs review"} />
      </section>

      <section className="workspace" id="demo">
        <div className="panel session-panel">
          <div className="section-heading">
            <span>Registration room</span>
            <h2>Midnight Signal</h2>
          </div>
          <div className="session-grid">
            <InfoItem label="Artist" value="Sam Sage" />
            <InfoItem label="Work type" value="Original song" />
            <InfoItem label="PRO target" value="BMI / ASCAP" />
            <InfoItem label="Status" value={registrationReady ? "Ready to register" : "Collecting info"} />
          </div>
          <div className="registration-checklist" aria-label="Registration readiness">
            <StatusStep done label="Song title and artist" />
            <StatusStep done={totalSplit === 100} label="Writer shares total 100%" />
            <StatusStep done={missingProfiles === 0} label="IPI/CAE and publisher info" />
            <StatusStep done={allConfirmed} label="All contributors approved" />
          </div>
          <div className="tap-console">
            <div>
              <span className="tiny-label">Invite role</span>
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
              Invite phone to room
            </button>
          </div>
        </div>

        <div className="panel qr-panel">
          <div className="qr-card">
            <QrCode size={92} />
          </div>
          <div>
            <span className="tiny-label">Room invite</span>
            <h2>Scan, install, fill your rights profile</h2>
            <p>Each writer lands in the same room and adds legal name, PRO, IPI/CAE, publisher info, and approved split.</p>
            <button className="text-button"><Link size={17} /> Copy room link</button>
          </div>
        </div>
      </section>

      <section className="contributors">
        <div className="section-heading">
          <span>Registration profiles</span>
          <h2>Collect the exact info that slows down BMI and ASCAP registration</h2>
        </div>
        <div className="contributor-grid">
          {contributors.map((person, index) => (
            <article className="contributor-card" key={`${person.name}-${index}`}>
              <div className="avatar">{person.name.slice(0, 2).toUpperCase()}</div>
              <div className="person-details">
                <h3>{person.name}</h3>
                <p>{person.role} · {person.pro} · {person.device}</p>
                <div className="profile-fields">
                  <span className={person.ipi ? "field-chip complete" : "field-chip missing"}>
                    IPI/CAE {person.ipi || "missing"}
                  </span>
                  <span className={person.publisher ? "field-chip complete" : "field-chip missing"}>
                    {person.publisher || "publisher missing"}
                  </span>
                </div>
              </div>
              <div className="split-pill">{person.split}%</div>
              {person.status === "confirmed" && hasRegistrationProfile(person) ? (
                <span className="status confirmed"><BadgeCheck size={15} /> Ready</span>
              ) : (
                <button className="status pending" onClick={() => confirmPerson(index)}>
                  Mark ready
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="ledger-section" id="ledger">
        <div className="section-heading">
          <span>Registration ledger</span>
          <h2>Every invite, profile update, and split approval is visible</h2>
        </div>
        <div className="ledger">
          {[...ledgerBase, {
            time: "Now",
            event: registrationReady ? "PRO packet ready" : "Registration blocked",
            detail: registrationReady
              ? "Sync can generate a BMI/ASCAP-ready work registration packet"
              : "Sync is still waiting on missing rights profile fields or approvals"
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
          <span className="tiny-label">Registration packet</span>
          <h2>One clean handoff for BMI, ASCAP, publishing admins, and collaborators.</h2>
        </div>
        <div className="export-actions">
          <button><WalletCards size={18} /> Writer shares</button>
          <button><Music2 size={18} /> Work metadata</button>
          <button><FileDown size={18} /> PRO packet</button>
        </div>
      </section>

      <footer>
        <Sparkles size={16} />
        Built as a Sync concept demo: invited registration rooms for cleaner BMI and ASCAP song registrations.
      </footer>
    </main>
  );
}

function hasRegistrationProfile(person) {
  return Boolean(person.pro && person.pro !== "Choose PRO" && person.ipi && person.publisher);
}

function StatusStep({ done, label }) {
  return (
    <div className={done ? "status-step done" : "status-step"}>
      <span>{done ? <BadgeCheck size={15} /> : "!"}</span>
      {label}
    </div>
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
