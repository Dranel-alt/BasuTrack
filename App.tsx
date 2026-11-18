import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Page = "home" | "schedule" | "track" | "report" | "about" | "admin-login" | "admin";
type WasteType = "Biodegradable" | "Recyclable" | "Residual";
type CollectionStatus = "Scheduled" | "Ongoing" | "Completed" | "Delayed";
type ReportStatus = "Pending" | "Acknowledged" | "Resolved";

type Schedule = {
  id: string;
  date: string;
  time: string;
  waste: WasteType;
  status: CollectionStatus;
  note: string;
  updatedAt: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  type: "Update" | "Reminder" | "Delay";
  createdAt: string;
};

type MissedReport = {
  id: string;
  location: string;
  date: string;
  waste: WasteType;
  description: string;
  status: ReportStatus;
  submittedAt: string;
};

type IconName =
  | "home"
  | "calendar"
  | "truck"
  | "flag"
  | "info"
  | "bell"
  | "clock"
  | "check"
  | "alert"
  | "leaf"
  | "recycle"
  | "trash"
  | "arrow"
  | "menu"
  | "close"
  | "pin"
  | "settings"
  | "plus"
  | "edit"
  | "logout"
  | "phone"
  | "filter"
  | "megaphone"
  | "shield";

const iconPaths: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v11h14V10M9 21v-7h6v7" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v11H3Z" />
      <path d="M14 10h4l3 3v4h-7Z" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  flag: (
    <>
      <path d="M5 21V4" />
      <path d="M5 5h11l-2 4 2 4H5" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  alert: (
    <>
      <path d="M10.3 3.7 2.4 18a2 2 0 0 0 1.8 3h15.6a2 2 0 0 0 1.8-3L13.7 3.7a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A8 8 0 0 1 19 4c0 8-3.5 14-8 16Z" />
      <path d="M4 21c2-5 6-9 12-12" />
    </>
  ),
  recycle: (
    <>
      <path d="m7 19-3-5 3-5M4 14h6" />
      <path d="m17 5 3 5-3 5M20 10h-6" />
      <path d="m9 5 3-2 3 2M12 3v6" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v5M14 11v5" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  pin: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 14.5a7 7 0 0 0 0-5l2-1.5-2-3.5-2.4 1A7 7 0 0 0 12 3L11.7.5h-4L7.4 3A7 7 0 0 0 3 5.5L.6 4.5l-2 3.5 2 1.5a7 7 0 0 0 0 5l-2 1.5 2 3.5 2.4-1A7 7 0 0 0 7.4 21l.3 2.5h4L12 21a7 7 0 0 0 4.6-2.5l2.4 1 2-3.5Z" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M14 3h7v18h-7" />
    </>
  ),
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M10 18h4" />
    </>
  ),
  filter: <path d="M4 5h16M7 12h10M10 19h4" />,
  megaphone: (
    <>
      <path d="m3 11 16-5v12L3 13Z" />
      <path d="m11.5 15.5 1.5 5H8l-1.5-6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return isoDate(date);
};
const nowLabel = () =>
  new Date().toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" });

const initialSchedules: Schedule[] = [
  {
    id: "SCH-001",
    date: addDays(1),
    time: "07:00",
    waste: "Biodegradable",
    status: "Scheduled",
    note: "Place securely tied waste outside before collection time.",
    updatedAt: nowLabel(),
  },
  {
    id: "SCH-002",
    date: addDays(3),
    time: "08:00",
    waste: "Recyclable",
    status: "Scheduled",
    note: "Clean and dry accepted recyclables before disposal.",
    updatedAt: nowLabel(),
  },
  {
    id: "SCH-003",
    date: addDays(5),
    time: "07:30",
    waste: "Residual",
    status: "Scheduled",
    note: "Keep residual waste separate from recyclable materials.",
    updatedAt: nowLabel(),
  },
  {
    id: "SCH-004",
    date: addDays(-2),
    time: "07:00",
    waste: "Biodegradable",
    status: "Completed",
    note: "Demonstration collection record.",
    updatedAt: nowLabel(),
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Demo schedule now available",
    message:
      "Review the sample collection schedule for Lapasan. These dates are not yet verified official schedules.",
    type: "Update",
    createdAt: nowLabel(),
  },
  {
    id: "ANN-002",
    title: "Prepare waste before pickup",
    message:
      "Please separate biodegradable, recyclable, and residual waste before the scheduled collection time.",
    type: "Reminder",
    createdAt: nowLabel(),
  },
];

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue] as const;
}

function formatDate(date: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-PH",
    options || { weekday: "long", month: "long", day: "numeric", year: "numeric" },
  );
}

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="BasuTrack home">
      <span>
        <Icon name="truck" size={22} />
      </span>
      <div>
        <strong>
          Basu<span>Track</span>
        </strong>
        <small>Lapasan Collection Monitor</small>
      </div>
    </button>
  );
}

const navItems: { page: Page; label: string; icon: IconName }[] = [
  { page: "home", label: "Home", icon: "home" },
  { page: "schedule", label: "Collection Schedule", icon: "calendar" },
  { page: "track", label: "Track Collection", icon: "truck" },
  { page: "report", label: "Report a Problem", icon: "flag" },
  { page: "about", label: "About BasuTrack", icon: "info" },
];

function Header({ page, go, unread }: { page: Page; go: (page: Page) => void; unread: number }) {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState(false);
  return (
    <header className="main-header">
      <div className="header-inner">
        <Logo onClick={() => go("home")} />
        <nav className={open ? "main-nav open" : "main-nav"}>
          {navItems.map((item) => (
            <button
              className={page === item.page ? "active" : ""}
              key={item.page}
              onClick={() => {
                go(item.page);
                setOpen(false);
              }}
            >
              <Icon name={item.icon} size={17} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="header-tools">
          <button
            className="notification-button"
            onClick={() => setNotifs(!notifs)}
            aria-label="Notifications"
          >
            <Icon name="bell" />
            {unread > 0 && <i>{unread}</i>}
          </button>
          <button className="admin-link" onClick={() => go("admin-login")}>
            <Icon name="shield" size={16} /> Admin
          </button>
          <button
            className="nav-toggle"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
        {notifs && (
          <div className="notification-popover">
            <div>
              <strong>Notifications</strong>
              <button onClick={() => setNotifs(false)}>
                <Icon name="close" size={16} />
              </button>
            </div>
            <article>
              <span className="notif-icon">
                <Icon name="calendar" size={16} />
              </span>
              <p>
                <strong>Upcoming collection</strong>
                <small>Check the next demonstration collection schedule.</small>
              </p>
            </article>
            <article>
              <span className="notif-icon blue">
                <Icon name="phone" size={16} />
              </span>
              <p>
                <strong>SMS simulation ready</strong>
                <small>Prototype SMS previews are clearly marked as simulated.</small>
              </p>
            </article>
          </div>
        )}
      </div>
    </header>
  );
}

function DemoBanner() {
  return (
    <div className="demo-banner">
      <span>DEMO DATA</span>
      <p>
        Schedules and collection updates are prototype information for Lapasan only and are not
        verified official barangay schedules.
      </p>
    </div>
  );
}

function Layout({
  page,
  go,
  unread,
  children,
}: {
  page: Page;
  go: (page: Page) => void;
  unread: number;
  children: ReactNode;
}) {
  return (
    <div className="site-shell">
      <Header page={page} go={go} unread={unread} />
      <main className="main-content">{children}</main>
      <footer className="main-footer">
        <div>
          <Logo onClick={() => go("home")} />
          <p>
            A schedule and status prototype exclusively for residents of Lapasan, Cagayan de Oro
            City.
          </p>
        </div>
        <div>
          <strong>Quick links</strong>
          {navItems.slice(1).map((item) => (
            <button onClick={() => go(item.page)} key={item.page}>
              {item.label}
            </button>
          ))}
        </div>
        <div>
          <strong>Prototype notice</strong>
          <p>
            No live GPS tracking or actual SMS delivery is currently provided. Verify schedules with
            barangay personnel.
          </p>
        </div>
      </footer>
      <nav className="mobile-nav">
        {navItems.slice(0, 4).map((item) => (
          <button
            className={page === item.page ? "active" : ""}
            onClick={() => go(item.page)}
            key={item.page}
          >
            <Icon name={item.icon} />
            <span>{item.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function Countdown({ schedule }: { schedule?: Schedule }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  if (!schedule)
    return (
      <div className="countdown">
        <div>
          <strong>—</strong>
          <span>Days</span>
        </div>
        <div>
          <strong>—</strong>
          <span>Hours</span>
        </div>
        <div>
          <strong>—</strong>
          <span>Minutes</span>
        </div>
      </div>
    );
  const target = new Date(`${schedule.date}T${schedule.time}:00`).getTime();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return (
    <div className="countdown">
      <div>
        <strong>{String(days).padStart(2, "0")}</strong>
        <span>Days</span>
      </div>
      <b>:</b>
      <div>
        <strong>{String(hours).padStart(2, "0")}</strong>
        <span>Hours</span>
      </div>
      <b>:</b>
      <div>
        <strong>{String(minutes).padStart(2, "0")}</strong>
        <span>Minutes</span>
      </div>
      <b>:</b>
      <div>
        <strong>{String(seconds).padStart(2, "0")}</strong>
        <span>Seconds</span>
      </div>
    </div>
  );
}

function WasteBadge({ type }: { type: WasteType }) {
  const icon: IconName =
    type === "Biodegradable" ? "leaf" : type === "Recyclable" ? "recycle" : "trash";
  return (
    <span className={`waste-badge ${type.toLowerCase()}`}>
      <Icon name={icon} size={14} />
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: CollectionStatus | ReportStatus }) {
  return (
    <span className={`status-badge ${status.toLowerCase().replace(" ", "-")}`}>
      <i />
      {status}
    </span>
  );
}

function Home({
  schedules,
  announcements,
  go,
  smsEnabled,
  setSmsEnabled,
}: {
  schedules: Schedule[];
  announcements: Announcement[];
  go: (p: Page) => void;
  smsEnabled: boolean;
  setSmsEnabled: (v: boolean) => void;
}) {
  const next = useMemo(
    () =>
      [...schedules]
        .filter((s) => new Date(`${s.date}T${s.time}`) >= new Date() && s.status !== "Completed")
        .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0],
    [schedules],
  );
  const latest = [...announcements].reverse().slice(0, 3);
  return (
    <>
      <section className="welcome-strip">
        <div>
          <span className="location-label">
            <Icon name="pin" size={14} /> Lapasan, Cagayan de Oro City
          </span>
          <h1>Know when to take the trash out.</h1>
          <p>
            Your next collection schedule and latest updates—available as soon as you open
            BasuTrack.
          </p>
        </div>
        <div className="today-card">
          <span>Today</span>
          <strong>{new Date().toLocaleDateString("en-PH", { weekday: "long" })}</strong>
          <p>
            {new Date().toLocaleDateString("en-PH", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </section>
      <DemoBanner />
      <section className="next-collection-card">
        <div className="next-main">
          <div className="section-label">
            <span>
              <Icon name="calendar" size={16} />
            </span>
            Next collection
          </div>
          {next ? (
            <>
              <div className="next-date">
                <div>
                  <strong>{new Date(`${next.date}T00:00`).getDate()}</strong>
                  <span>
                    {new Date(`${next.date}T00:00`)
                      .toLocaleDateString("en-PH", { month: "short" })
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2>
                    {formatDate(next.date, { weekday: "long", month: "long", day: "numeric" })}
                  </h2>
                  <p>
                    <Icon name="clock" size={17} />
                    {new Date(`2000-01-01T${next.time}`).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
              <div className="next-meta">
                <div>
                  <span>Waste category</span>
                  <WasteBadge type={next.waste} />
                </div>
                <div>
                  <span>Collection status</span>
                  <StatusBadge status={next.status} />
                </div>
                <div>
                  <span>Coverage</span>
                  <strong>
                    <Icon name="pin" size={15} /> Lapasan only
                  </strong>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-inline">
              <Icon name="calendar" />
              <h2>No upcoming schedule</h2>
              <p>Wait for an administrator update.</p>
            </div>
          )}
        </div>
        <aside className="countdown-side">
          <span>Collection begins in</span>
          <Countdown schedule={next} />
          <p>
            <Icon name="info" size={14} /> Countdown is based on the demonstration schedule.
          </p>
          <button onClick={() => go("schedule")}>
            View full schedule <Icon name="arrow" size={16} />
          </button>
        </aside>
      </section>
      <div className="home-grid">
        <section className="content-card tracker-summary">
          <div className="card-heading">
            <div>
              <span>COLLECTION TRACKER</span>
              <h2>Current progress</h2>
            </div>
            <button onClick={() => go("track")}>
              View tracker <Icon name="arrow" size={15} />
            </button>
          </div>
          <div className="tracker-road">
            {(["Scheduled", "Ongoing", "Completed"] as CollectionStatus[]).map((status, i) => (
              <div
                className={
                  next?.status === status || (next?.status === "Delayed" && i === 0) ? "active" : ""
                }
                key={status}
              >
                <span>
                  {i === 2 ? (
                    <Icon name="check" />
                  ) : i === 1 ? (
                    <Icon name="truck" />
                  ) : (
                    <Icon name="calendar" />
                  )}
                </span>
                <strong>{status}</strong>
              </div>
            ))}
          </div>
          <div className="last-update">
            <Icon name="clock" size={16} />
            <span>Most recent status update</span>
            <strong>{next?.updatedAt || "No update yet"}</strong>
          </div>
        </section>
        <section className="content-card announcements-card">
          <div className="card-heading">
            <div>
              <span>LATEST NEWS</span>
              <h2>Announcements</h2>
            </div>
            <span className="new-count">{latest.length} updates</span>
          </div>
          <div className="announcement-list">
            {latest.map((item) => (
              <article key={item.id}>
                <span className={`announcement-icon ${item.type.toLowerCase()}`}>
                  <Icon
                    name={
                      item.type === "Delay"
                        ? "alert"
                        : item.type === "Reminder"
                          ? "bell"
                          : "megaphone"
                    }
                    size={17}
                  />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                  <small>{item.createdAt}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
      <section className="reminder-card">
        <div className="reminder-icon">
          <Icon name="phone" size={25} />
        </div>
        <div>
          <span>PROTOTYPE REMINDERS</span>
          <h2>Simulated SMS reminders</h2>
          <p>
            Preview how future text reminders may work. Enabling this does not send an actual SMS.
          </p>
        </div>
        <label className="switch-wrap">
          <span>{smsEnabled ? "Simulation on" : "Simulation off"}</span>
          <button
            className={smsEnabled ? "switch on" : "switch"}
            onClick={() => setSmsEnabled(!smsEnabled)}
            aria-label="Toggle SMS simulation"
          >
            <i />
          </button>
        </label>
        {smsEnabled && (
          <div className="sms-preview">
            <strong>SIMULATED SMS · NOT SENT</strong>
            <p>
              BasuTrack: Reminder—your next demo {next?.waste.toLowerCase() || "waste"} collection
              in Lapasan is{" "}
              {next
                ? formatDate(next.date, { month: "short", day: "numeric" })
                : "not yet scheduled"}
              .
            </p>
          </div>
        )}
      </section>
    </>
  );
}

function PageHeader({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function SchedulePage({ schedules }: { schedules: Schedule[] }) {
  const [dateFilter, setDateFilter] = useState("");
  const [wasteFilter, setWasteFilter] = useState("All");
  const filtered = [...schedules]
    .filter(
      (s) =>
        (!dateFilter || s.date === dateFilter) &&
        (wasteFilter === "All" || s.waste === wasteFilter),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <>
      <PageHeader
        eyebrow="Lapasan collection calendar"
        title="Collection Schedule"
        text="Review demonstration collection dates, accepted waste categories, and current status."
      />
      <DemoBanner />
      <section className="filter-bar">
        <div>
          <Icon name="filter" size={17} />
          <strong>Filter schedule</strong>
        </div>
        <label>
          Date
          <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
        </label>
        <label>
          Waste category
          <select value={wasteFilter} onChange={(e) => setWasteFilter(e.target.value)}>
            <option>All</option>
            <option>Biodegradable</option>
            <option>Recyclable</option>
            <option>Residual</option>
          </select>
        </label>
        <button
          onClick={() => {
            setDateFilter("");
            setWasteFilter("All");
          }}
        >
          Clear filters
        </button>
      </section>
      <section className="schedule-table-card">
        <div className="schedule-table-head">
          <h2>Weekly schedule</h2>
          <span>
            {filtered.length} collection{filtered.length === 1 ? "" : "s"}
          </span>
        </div>
        <div className="schedule-list">
          {filtered.length ? (
            filtered.map((s) => (
              <article key={s.id}>
                <div className="schedule-date">
                  <strong>{new Date(`${s.date}T00:00`).getDate()}</strong>
                  <span>
                    {new Date(`${s.date}T00:00`)
                      .toLocaleDateString("en-PH", { month: "short" })
                      .toUpperCase()}
                  </span>
                </div>
                <div className="schedule-day">
                  <strong>{formatDate(s.date, { weekday: "long" })}</strong>
                  <span>
                    {formatDate(s.date, { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="schedule-time">
                  <Icon name="clock" size={16} />
                  <span>Collection time</span>
                  <strong>
                    {new Date(`2000-01-01T${s.time}`).toLocaleTimeString("en-PH", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
                <WasteBadge type={s.waste} />
                <StatusBadge status={s.status} />
                <div className="schedule-note">
                  <Icon name="info" size={15} />
                  <span>{s.note}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <Icon name="calendar" size={32} />
              <h3>No schedules match</h3>
              <p>Try clearing or changing your filters.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

const trackerSteps: CollectionStatus[] = ["Scheduled", "Ongoing", "Completed"];
function TrackPage({ schedules }: { schedules: Schedule[] }) {
  const [selected, setSelected] = useState(schedules[0]?.id || "");
  const schedule = schedules.find((s) => s.id === selected) || schedules[0];
  const index = schedule?.status === "Completed" ? 2 : schedule?.status === "Ongoing" ? 1 : 0;
  return (
    <>
      <PageHeader
        eyebrow="Manually updated status"
        title="Track Collection"
        text="Check the latest collection progress reported by the BasuTrack demonstration administrator."
      />
      <div className="gps-notice">
        <Icon name="info" />
        <div>
          <strong>This is not live GPS tracking.</strong>
          <p>
            Statuses are manually updated by the administrator and include the latest update date
            and time.
          </p>
        </div>
      </div>
      <div className="track-layout">
        <aside className="collection-selector">
          <h2>Choose a collection</h2>
          {schedules.map((s) => (
            <button
              className={s.id === schedule?.id ? "active" : ""}
              onClick={() => setSelected(s.id)}
              key={s.id}
            >
              <span className={`waste-dot ${s.waste.toLowerCase()}`} />
              <div>
                <strong>
                  {formatDate(s.date, { month: "short", day: "numeric" })} · {s.waste}
                </strong>
                <small>
                  {s.time} · {s.id}
                </small>
              </div>
              <StatusBadge status={s.status} />
            </button>
          ))}
        </aside>
        {schedule && (
          <section className="tracking-detail">
            <div className="tracking-title">
              <div>
                <span>COLLECTION ID {schedule.id}</span>
                <h2>{schedule.waste} collection</h2>
                <p>
                  <Icon name="calendar" size={16} />
                  {formatDate(schedule.date)} at{" "}
                  {new Date(`2000-01-01T${schedule.time}`).toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <StatusBadge status={schedule.status} />
            </div>
            {schedule.status === "Delayed" && (
              <div className="delay-alert">
                <Icon name="alert" />
                <div>
                  <strong>Collection delayed</strong>
                  <p>Please wait for a new schedule announcement from the administrator.</p>
                </div>
              </div>
            )}
            <div className="progress-line">
              {trackerSteps.map((step, i) => (
                <div
                  className={`${i <= index && schedule.status !== "Delayed" ? "complete" : ""} ${i === index ? "current" : ""}`}
                  key={step}
                >
                  <span>
                    {i < index ? (
                      <Icon name="check" size={18} />
                    ) : i === 1 ? (
                      <Icon name="truck" size={20} />
                    ) : i === 2 ? (
                      <Icon name="check" size={20} />
                    ) : (
                      <Icon name="calendar" size={20} />
                    )}
                  </span>
                  <strong>{step}</strong>
                  <small>
                    {i < index ? "Finished" : i === index ? "Current status" : "Waiting"}
                  </small>
                </div>
              ))}
            </div>
            <div className="update-stamp">
              <span>
                <Icon name="clock" size={18} />
              </span>
              <div>
                <small>MOST RECENT STATUS UPDATE</small>
                <strong>{schedule.updatedAt}</strong>
                <p>Updated manually by demo administrator</p>
              </div>
            </div>
            <div className="tracking-note">
              <strong>Collection note</strong>
              <p>{schedule.note}</p>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function ReportPage({ onSubmit }: { onSubmit: (report: MissedReport) => void }) {
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    location: "",
    date: "",
    waste: "Biodegradable" as WasteType,
    description: "",
  });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = `MIS-${Date.now().toString().slice(-6)}`;
    onSubmit({ id, ...form, status: "Pending", submittedAt: nowLabel() });
    setSuccess(id);
    setForm({ location: "", date: "", waste: "Biodegradable", description: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  if (success)
    return (
      <div className="report-success">
        <span>
          <Icon name="check" size={34} />
        </span>
        <small>REPORT RECEIVED</small>
        <h1>Thank you for letting us know.</h1>
        <p>
          Your missed-collection report was saved locally and is ready for demonstration
          administrator review.
        </p>
        <div>
          <small>REPORT REFERENCE</small>
          <strong>{success}</strong>
          <StatusBadge status="Pending" />
        </div>
        <button className="primary-button" onClick={() => setSuccess("")}>
          Submit another report
        </button>
      </div>
    );
  return (
    <>
      <PageHeader
        eyebrow="Missed collection reporting"
        title="Report a Problem"
        text="Report a missed household waste collection within Lapasan for administrator review."
      />
      <div className="report-layout">
        <form className="report-form" onSubmit={submit}>
          <div className="form-intro">
            <span>
              <Icon name="flag" />
            </span>
            <div>
              <h2>Missed collection details</h2>
              <p>All fields are required. This form only accepts locations within Lapasan.</p>
            </div>
          </div>
          <label>
            Location within Lapasan
            <div className="location-input">
              <Icon name="pin" size={18} />
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Street, sitio, or nearby landmark"
              />
              <span>Lapasan</span>
            </div>
          </label>
          <div className="form-row">
            <label>
              Date of missed collection
              <input
                required
                type="date"
                max={isoDate(new Date())}
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </label>
            <label>
              Type of waste
              <select
                value={form.waste}
                onChange={(e) => setForm({ ...form, waste: e.target.value as WasteType })}
              >
                <option>Biodegradable</option>
                <option>Recyclable</option>
                <option>Residual</option>
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea
              required
              minLength={10}
              rows={5}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what happened and include any useful details..."
            />
            <small>Minimum 10 characters. Do not include sensitive personal information.</small>
          </label>
          <button className="primary-button" type="submit">
            Submit missed-collection report <Icon name="arrow" size={17} />
          </button>
        </form>
        <aside>
          <div className="help-card">
            <Icon name="info" />
            <h3>Before submitting</h3>
            <ul>
              <li>Confirm that the collection time has already passed.</li>
              <li>Enter a specific location within Lapasan.</li>
              <li>Submit one report per missed collection.</li>
            </ul>
          </div>
          <div className="scope-card">
            <Icon name="pin" />
            <div>
              <strong>Lapasan-only prototype</strong>
              <p>Reports outside Lapasan are not supported by BasuTrack.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

function AboutPage({ go }: { go: (p: Page) => void }) {
  return (
    <div className="about-page">
      <section className="about-hero-card">
        <div className="about-hero-content">
          <span className="about-location-tag">
            <Icon name="pin" size={17} /> Lapasan, Cagayan de Oro City
          </span>
          <h1>BASUTRACK</h1>
          <p className="about-tagline">“A cleaner community starts with informed residents.”</p>
          <p className="about-hero-copy">
            A dedicated collection schedule and status platform created for households in Barangay
            Lapasan.
          </p>
        </div>
        <div className="about-wave" aria-hidden="true" />
      </section>

      <section className="about-intro">
        <span className="about-eyebrow">
          <Icon name="shield" size={17} /> About BasuTrack
        </span>
        <h2>What is BasuTrack?</h2>
        <p>
          BasuTrack is a community-focused garbage collection information platform for Lapasan. It
          helps residents check collection schedules, follow administrator-posted status updates,
          receive reminder previews, and report missed pickups through one clear and accessible
          website.
        </p>
      </section>

      <section className="about-grid">
        <article>
          <span>
            <Icon name="calendar" />
          </span>
          <h3>Clear collection schedules</h3>
          <p>
            View collection dates, pickup times, waste categories, and important preparation notes
            in one place.
          </p>
        </article>
        <article>
          <span>
            <Icon name="truck" />
          </span>
          <h3>Transparent status updates</h3>
          <p>
            Follow Scheduled, Ongoing, Completed, or Delayed updates posted by the demonstration
            administrator.
          </p>
        </article>
        <article>
          <span>
            <Icon name="bell" />
          </span>
          <h3>Timely resident reminders</h3>
          <p>
            Use in-app notices and clearly labeled simulated SMS previews to prepare waste before
            collection.
          </p>
        </article>
      </section>

      <section className="about-process">
        <div className="about-section-heading">
          <span className="about-eyebrow">
            <Icon name="recycle" size={17} /> How it works
          </span>
          <h2>From schedule to collection</h2>
          <p>Four simple steps help Lapasan residents stay ready and informed.</p>
        </div>
        <div className="about-steps">
          {[
            [
              "01",
              "Check the schedule",
              "Open BasuTrack to see the next collection date and time.",
            ],
            ["02", "Prepare your waste", "Separate waste by category and follow the posted notes."],
            ["03", "Track the update", "Check the administrator-posted collection status."],
            [
              "04",
              "Report a concern",
              "Submit a missed-collection report when a pickup is not completed.",
            ],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-purpose">
        <article>
          <span>
            <Icon name="info" size={22} />
          </span>
          <div>
            <small>OUR VISION</small>
            <h3>A cleaner, better-informed Lapasan</h3>
            <p>
              Residents can easily access reliable collection information and take part in keeping
              streets and shared spaces clean.
            </p>
          </div>
        </article>
        <article>
          <span>
            <Icon name="flag" size={22} />
          </span>
          <div>
            <small>OUR MISSION</small>
            <h3>Make collection information easier to act on</h3>
            <p>
              Present schedules, updates, reminders, and resident reports in a simple digital
              experience designed around the needs of the community.
            </p>
          </div>
        </article>
      </section>

      <section className="scope-section">
        <div>
          <span>PROTOTYPE SCOPE</span>
          <h2>Built exclusively for Lapasan</h2>
          <p>
            BasuTrack does not include a barangay selector and does not cover locations outside
            Lapasan, Cagayan de Oro City. Demonstration schedules must be replaced with verified
            information from barangay personnel before public use.
          </p>
        </div>
        <ul>
          <li>
            <Icon name="check" /> LocalStorage prototype persistence
          </li>
          <li>
            <Icon name="check" /> Administrator-managed information
          </li>
          <li>
            <Icon name="check" /> Database-ready data structure
          </li>
          <li>
            <Icon name="check" /> Future SMS gateway support
          </li>
        </ul>
      </section>

      <section className="about-cta">
        <div>
          <span>READY FOR THE NEXT PICKUP?</span>
          <h2>Check Lapasan’s collection schedule today.</h2>
        </div>
        <button onClick={() => go("home")}>
          View next collection <Icon name="arrow" size={17} />
        </button>
      </section>
    </div>
  );
}

function AdminLogin({ onLogin, go }: { onLogin: () => void; go: (p: Page) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "basutrack") onLogin();
    else setError("Incorrect demo credentials. Use the credentials shown below.");
  };
  return (
    <div className="login-page">
      <button className="back-button" onClick={() => go("home")}>
        <Icon name="arrow" className="flip" size={17} /> Back to resident site
      </button>
      <div className="login-card">
        <Logo onClick={() => go("home")} />
        <span className="login-icon">
          <Icon name="shield" size={28} />
        </span>
        <h1>Administrator login</h1>
        <p>Manage Lapasan demonstration schedules, statuses, announcements, and reports.</p>
        <form onSubmit={submit}>
          <label>
            Username
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
          {error && (
            <div className="login-error">
              <Icon name="alert" size={15} />
              {error}
            </div>
          )}
          <button className="primary-button">
            Sign in to dashboard <Icon name="arrow" size={17} />
          </button>
        </form>
        <div className="demo-credentials">
          <span>DEMO ADMIN CREDENTIALS</span>
          <p>
            Username: <strong>admin</strong>
          </p>
          <p>
            Password: <strong>basutrack</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({
  schedules,
  setSchedules,
  announcements,
  setAnnouncements,
  reports,
  setReports,
  logout,
  go,
}: {
  schedules: Schedule[];
  setSchedules: (v: Schedule[]) => void;
  announcements: Announcement[];
  setAnnouncements: (v: Announcement[]) => void;
  reports: MissedReport[];
  setReports: (v: MissedReport[]) => void;
  logout: () => void;
  go: (p: Page) => void;
}) {
  const [tab, setTab] = useState<"overview" | "schedules" | "announcements" | "reports">(
    "overview",
  );
  const [editId, setEditId] = useState("");
  const [toast, setToast] = useState("");
  const emptySchedule = {
    date: "",
    time: "07:00",
    waste: "Biodegradable" as WasteType,
    status: "Scheduled" as CollectionStatus,
    note: "",
  };
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    message: "",
    type: "Update" as Announcement["type"],
  });
  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const saveSchedule = (e: FormEvent) => {
    e.preventDefault();
    if (editId)
      setSchedules(
        schedules.map((s) =>
          s.id === editId ? { ...s, ...scheduleForm, updatedAt: nowLabel() } : s,
        ),
      );
    else
      setSchedules([
        ...schedules,
        { ...scheduleForm, id: `SCH-${Date.now().toString().slice(-5)}`, updatedAt: nowLabel() },
      ]);
    setScheduleForm(emptySchedule);
    setEditId("");
    notify(editId ? "Schedule updated on resident pages" : "Schedule added to resident pages");
  };
  const editSchedule = (s: Schedule) => {
    setEditId(s.id);
    setScheduleForm({ date: s.date, time: s.time, waste: s.waste, status: s.status, note: s.note });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const removeSchedule = (id: string) => {
    if (window.confirm("Delete this demonstration schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
      notify("Schedule deleted");
    }
  };
  const updateStatus = (id: string, status: CollectionStatus) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, status, updatedAt: nowLabel() } : s)));
    notify("Collection status updated for residents");
  };
  const postAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    setAnnouncements([
      ...announcements,
      { ...announcementForm, id: `ANN-${Date.now().toString().slice(-5)}`, createdAt: nowLabel() },
    ]);
    setAnnouncementForm({ title: "", message: "", type: "Update" });
    notify("Announcement published to resident dashboard");
  };
  const updateReport = (id: string, status: ReportStatus) => {
    setReports(reports.map((r) => (r.id === id ? { ...r, status } : r)));
    notify("Report status updated");
  };
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo onClick={() => go("home")} />
        <div className="admin-role">
          <span>AD</span>
          <div>
            <strong>Demo Administrator</strong>
            <small>Lapasan collection manager</small>
          </div>
        </div>
        <nav>
          {[
            ["overview", "home", "Overview"],
            ["schedules", "calendar", "Schedules"],
            ["announcements", "megaphone", "Announcements"],
            ["reports", "flag", "Missed reports"],
          ].map(([id, icon, label]) => (
            <button
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id as typeof tab)}
              key={id}
            >
              <Icon name={icon as IconName} />
              {label}
              {id === "reports" && <i>{reports.filter((r) => r.status === "Pending").length}</i>}
            </button>
          ))}
        </nav>
        <div className="admin-side-footer">
          <button onClick={() => go("home")}>
            <Icon name="arrow" className="flip" size={16} /> Resident website
          </button>
          <button onClick={logout}>
            <Icon name="logout" size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <span>BASUTRACK ADMINISTRATION</span>
            <h1>
              {tab === "overview" ? "Dashboard overview" : tab[0].toUpperCase() + tab.slice(1)}
            </h1>
          </div>
          <div className="admin-header-badge">
            <i /> Local prototype
          </div>
        </header>
        <div className="admin-content">
          <DemoBanner />
          {tab === "overview" && (
            <AdminOverview
              schedules={schedules}
              reports={reports}
              announcements={announcements}
              setTab={setTab}
            />
          )}{" "}
          {tab === "schedules" && (
            <section>
              <PageHeader
                eyebrow="Schedule management"
                title="Collection Schedules"
                text="Add, edit, delete, and update collection information shown to residents."
              />
              <div className="admin-editor-layout">
                <form className="admin-form" onSubmit={saveSchedule}>
                  <h2>{editId ? "Edit schedule" : "Add collection schedule"}</h2>
                  <div className="form-row">
                    <label>
                      Date
                      <input
                        required
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                      />
                    </label>
                    <label>
                      Time
                      <input
                        required
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                      />
                    </label>
                  </div>
                  <label>
                    Waste category
                    <select
                      value={scheduleForm.waste}
                      onChange={(e) =>
                        setScheduleForm({ ...scheduleForm, waste: e.target.value as WasteType })
                      }
                    >
                      <option>Biodegradable</option>
                      <option>Recyclable</option>
                      <option>Residual</option>
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      value={scheduleForm.status}
                      onChange={(e) =>
                        setScheduleForm({
                          ...scheduleForm,
                          status: e.target.value as CollectionStatus,
                        })
                      }
                    >
                      <option>Scheduled</option>
                      <option>Ongoing</option>
                      <option>Completed</option>
                      <option>Delayed</option>
                    </select>
                  </label>
                  <label>
                    Resident note
                    <textarea
                      required
                      rows={3}
                      value={scheduleForm.note}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, note: e.target.value })}
                      placeholder="Collection instructions or update"
                    />
                  </label>
                  <div className="form-actions">
                    {editId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditId("");
                          setScheduleForm(emptySchedule);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                    <button className="primary-button">
                      {editId ? "Save changes" : "Add schedule"}
                    </button>
                  </div>
                </form>
                <div className="admin-data-list">
                  <div className="admin-list-title">
                    <h2>Published schedules</h2>
                    <span>{schedules.length} total</span>
                  </div>
                  {[...schedules]
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((s) => (
                      <article key={s.id}>
                        <div className="admin-item-main">
                          <WasteBadge type={s.waste} />
                          <strong>
                            {formatDate(s.date, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}{" "}
                            · {s.time}
                          </strong>
                          <small>
                            {s.id} · Updated {s.updatedAt}
                          </small>
                        </div>
                        <select
                          value={s.status}
                          onChange={(e) => updateStatus(s.id, e.target.value as CollectionStatus)}
                          aria-label={`Status for ${s.id}`}
                        >
                          <option>Scheduled</option>
                          <option>Ongoing</option>
                          <option>Completed</option>
                          <option>Delayed</option>
                        </select>
                        <button onClick={() => editSchedule(s)} aria-label="Edit schedule">
                          <Icon name="edit" size={17} />
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => removeSchedule(s.id)}
                          aria-label="Delete schedule"
                        >
                          <Icon name="trash" size={17} />
                        </button>
                      </article>
                    ))}
                </div>
              </div>
            </section>
          )}
          {tab === "announcements" && (
            <section>
              <PageHeader
                eyebrow="Resident communication"
                title="Announcements"
                text="Publish collection reminders, changes, and delay notices to the resident dashboard."
              />
              <div className="admin-editor-layout">
                <form className="admin-form" onSubmit={postAnnouncement}>
                  <h2>Post an announcement</h2>
                  <label>
                    Announcement type
                    <select
                      value={announcementForm.type}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          type: e.target.value as Announcement["type"],
                        })
                      }
                    >
                      <option>Update</option>
                      <option>Reminder</option>
                      <option>Delay</option>
                    </select>
                  </label>
                  <label>
                    Title
                    <input
                      required
                      value={announcementForm.title}
                      onChange={(e) =>
                        setAnnouncementForm({ ...announcementForm, title: e.target.value })
                      }
                      placeholder="Short announcement title"
                    />
                  </label>
                  <label>
                    Message
                    <textarea
                      required
                      minLength={10}
                      rows={5}
                      value={announcementForm.message}
                      onChange={(e) =>
                        setAnnouncementForm({ ...announcementForm, message: e.target.value })
                      }
                      placeholder="Write the resident announcement..."
                    />
                  </label>
                  <button className="primary-button">Publish announcement</button>
                </form>
                <div className="admin-data-list">
                  <div className="admin-list-title">
                    <h2>Published announcements</h2>
                    <span>{announcements.length} total</span>
                  </div>
                  {[...announcements].reverse().map((a) => (
                    <article key={a.id}>
                      <span className={`announcement-icon ${a.type.toLowerCase()}`}>
                        <Icon
                          name={
                            a.type === "Delay"
                              ? "alert"
                              : a.type === "Reminder"
                                ? "bell"
                                : "megaphone"
                          }
                          size={17}
                        />
                      </span>
                      <div className="admin-item-main">
                        <strong>{a.title}</strong>
                        <p>{a.message}</p>
                        <small>
                          {a.type} · {a.createdAt}
                        </small>
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setAnnouncements(announcements.filter((x) => x.id !== a.id));
                          notify("Announcement removed");
                        }}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}
          {tab === "reports" && (
            <section>
              <PageHeader
                eyebrow="Resident submissions"
                title="Missed-Collection Reports"
                text="Review reports and mark each item as Pending, Acknowledged, or Resolved."
              />
              <div className="reports-admin-table">
                <div className="admin-list-title">
                  <h2>Submitted reports</h2>
                  <span>{reports.length} total</span>
                </div>
                {reports.length ? (
                  reports.map((r) => (
                    <article key={r.id}>
                      <div className="report-id">
                        <strong>{r.id}</strong>
                        <small>{r.submittedAt}</small>
                      </div>
                      <div>
                        <span>Location</span>
                        <strong>{r.location}, Lapasan</strong>
                      </div>
                      <div>
                        <span>Missed date</span>
                        <strong>
                          {formatDate(r.date, { month: "short", day: "numeric", year: "numeric" })}
                        </strong>
                      </div>
                      <WasteBadge type={r.waste} />
                      <p>{r.description}</p>
                      <select
                        value={r.status}
                        onChange={(e) => updateReport(r.id, e.target.value as ReportStatus)}
                      >
                        <option>Pending</option>
                        <option>Acknowledged</option>
                        <option>Resolved</option>
                      </select>
                    </article>
                  ))
                ) : (
                  <div className="empty-state">
                    <Icon name="flag" size={30} />
                    <h3>No reports submitted</h3>
                    <p>Resident missed-collection reports will appear here.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
      {toast && (
        <div className="toast">
          <Icon name="check" size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function AdminOverview({
  schedules,
  reports,
  announcements,
  setTab,
}: {
  schedules: Schedule[];
  reports: MissedReport[];
  announcements: Announcement[];
  setTab: (t: "overview" | "schedules" | "announcements" | "reports") => void;
}) {
  const stats = [
    { label: "Total schedules", value: schedules.length, icon: "calendar", tone: "green" },
    {
      label: "Ongoing / delayed",
      value: schedules.filter((s) => s.status === "Ongoing" || s.status === "Delayed").length,
      icon: "truck",
      tone: "blue",
    },
    {
      label: "Pending reports",
      value: reports.filter((r) => r.status === "Pending").length,
      icon: "flag",
      tone: "orange",
    },
    { label: "Announcements", value: announcements.length, icon: "megaphone", tone: "purple" },
  ];
  return (
    <>
      <div className="admin-stats">
        {stats.map((s) => (
          <article key={s.label}>
            <span className={s.tone}>
              <Icon name={s.icon as IconName} />
            </span>
            <div>
              <small>{s.label}</small>
              <strong>{s.value}</strong>
              <p>Demo data</p>
            </div>
          </article>
        ))}
      </div>
      <div className="admin-overview-grid">
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span>COLLECTION OPERATIONS</span>
              <h2>Recent schedules</h2>
            </div>
            <button onClick={() => setTab("schedules")}>
              Manage all <Icon name="arrow" size={15} />
            </button>
          </div>
          {schedules.slice(0, 4).map((s) => (
            <div className="overview-row" key={s.id}>
              <span className={`waste-dot ${s.waste.toLowerCase()}`} />
              <div>
                <strong>{s.waste} collection</strong>
                <small>
                  {formatDate(s.date, { month: "short", day: "numeric" })} · {s.time}
                </small>
              </div>
              <StatusBadge status={s.status} />
            </div>
          ))}
        </section>
        <section className="admin-panel">
          <div className="admin-panel-head">
            <div>
              <span>RESIDENT CONCERNS</span>
              <h2>Latest reports</h2>
            </div>
            <button onClick={() => setTab("reports")}>
              View reports <Icon name="arrow" size={15} />
            </button>
          </div>
          {reports.length ? (
            reports.slice(0, 4).map((r) => (
              <div className="overview-row" key={r.id}>
                <span className="report-mini">
                  <Icon name="flag" size={16} />
                </span>
                <div>
                  <strong>{r.location}, Lapasan</strong>
                  <small>
                    {r.id} · {r.waste}
                  </small>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))
          ) : (
            <div className="empty-state compact">
              <Icon name="check" />
              <h3>No resident reports yet</h3>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [schedules, setSchedules] = useStoredState<Schedule[]>(
    "basutrack-schedules",
    initialSchedules,
  );
  const [announcements, setAnnouncements] = useStoredState<Announcement[]>(
    "basutrack-announcements",
    initialAnnouncements,
  );
  const [reports, setReports] = useStoredState<MissedReport[]>("basutrack-reports", []);
  const [smsEnabled, setSmsEnabled] = useStoredState("basutrack-sms-simulation", false);
  const [adminSession, setAdminSession] = useStoredState("basutrack-admin-session", false);
  const go = (target: Page) => {
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const addReport = (report: MissedReport) => setReports([...reports, report]);
  if (page === "admin-login")
    return (
      <AdminLogin
        go={go}
        onLogin={() => {
          setAdminSession(true);
          go("admin");
        }}
      />
    );
  if (page === "admin") {
    if (!adminSession) return <AdminLogin go={go} onLogin={() => setAdminSession(true)} />;
    return (
      <AdminDashboard
        schedules={schedules}
        setSchedules={setSchedules}
        announcements={announcements}
        setAnnouncements={setAnnouncements}
        reports={reports}
        setReports={setReports}
        logout={() => {
          setAdminSession(false);
          go("home");
        }}
        go={go}
      />
    );
  }
  const pageContent: Record<string, ReactNode> = {
    home: (
      <Home
        schedules={schedules}
        announcements={announcements}
        go={go}
        smsEnabled={smsEnabled}
        setSmsEnabled={setSmsEnabled}
      />
    ),
    schedule: <SchedulePage schedules={schedules} />,
    track: <TrackPage schedules={schedules} />,
    report: <ReportPage onSubmit={addReport} />,
    about: <AboutPage go={go} />,
  };
  return (
    <Layout page={page} go={go} unread={announcements.length}>
      {pageContent[page]}
    </Layout>
  );
}
