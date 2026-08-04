import type { Metadata } from "next";

import styles from "./oss-homepage.module.css";

export const metadata: Metadata = {
  title: "OSS homepage proof candidate",
  description:
    "An isolated non-production Online Scope Studio homepage candidate built from a Tessli research pack.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

const servicePaths = [
  {
    index: "01",
    title: "Launch and modernise",
    body: "Clear, fast websites that establish trust, explain the offer, and give campaigns a dependable destination.",
    scope: "Strategy · UI/UX · WordPress · Next.js",
  },
  {
    index: "02",
    title: "Sell and operate",
    body: "Commerce systems designed around catalogue, payments, fulfilment, reporting, and the work your team handles after launch.",
    scope: "Shopify · Custom commerce · Integrations",
  },
  {
    index: "03",
    title: "Automate and measure",
    body: "Connected workflows that remove repeat tasks, improve hand-offs, and make useful operating data easier to act on.",
    scope: "Automation · CRM · Analytics · AI workflows",
  },
  {
    index: "04",
    title: "Build custom products",
    body: "Focused internal tools and customer-facing applications for needs that no template or disconnected stack can solve well.",
    scope: "React · Next.js · Supabase · APIs",
  },
] as const;

const projects = [
  {
    name: "ScopeQR",
    type: "Product utility",
    summary:
      "A focused QR creation product designed around speed, clarity, and a low-friction public workflow.",
    tags: ["Product design", "Next.js", "Utility UX"],
  },
  {
    name: "Daddy Official",
    type: "Commerce implementation",
    summary:
      "A Shopify storefront for a fragrance brand, translating catalogue and purchase needs into a clear commerce experience.",
    tags: ["Shopify", "Commerce", "Storefront"],
  },
  {
    name: "BrandScope",
    type: "System in development",
    summary:
      "An internal brand-research and workflow system being developed as a structured tool rather than a collection of ad-hoc documents.",
    tags: ["Research system", "Workflow", "Product build"],
  },
] as const;

const processSteps = [
  {
    title: "Understand the operation",
    body: "We map the business goal, audience, existing stack, bottlenecks, and what success must look like after launch.",
  },
  {
    title: "Shape the right system",
    body: "We define the smallest useful scope, technical approach, interface direction, and the decisions that should remain flexible.",
  },
  {
    title: "Build in reviewable parts",
    body: "Design and development move through visible checkpoints, with working behaviour tested before polish becomes expensive.",
  },
  {
    title: "Launch, learn, support",
    body: "We help the system go live, resolve real-world issues, and stay available for the next improvement rather than disappearing at hand-off.",
  },
] as const;

const capabilities = [
  "Website engineering",
  "Shopify and commerce",
  "Custom web applications",
  "Business automation",
  "AI-enabled workflows",
  "Analytics and measurement",
  "SEO and maintenance",
  "UI/UX systems",
] as const;

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M4 12 12 4M5 4h7v7" fill="none" stroke="currentColor" />
    </svg>
  );
}

function SystemMap() {
  return (
    <div aria-hidden="true" className={styles.systemMap}>
      <div className={styles.mapGrid} />
      <div className={`${styles.mapNode} ${styles.mapNodeWeb}`}>Web</div>
      <div className={`${styles.mapNode} ${styles.mapNodeCommerce}`}>
        Commerce
      </div>
      <div className={`${styles.mapNode} ${styles.mapNodeAutomation}`}>
        Automation
      </div>
      <div className={`${styles.mapNode} ${styles.mapNodeProduct}`}>
        Products
      </div>
      <div className={`${styles.mapNode} ${styles.mapNodeData}`}>Data</div>
      <div className={styles.mapCore}>
        <span>OSS</span>
        <small>technical partner</small>
      </div>
      <span className={`${styles.mapLine} ${styles.mapLineOne}`} />
      <span className={`${styles.mapLine} ${styles.mapLineTwo}`} />
      <span className={`${styles.mapLine} ${styles.mapLineThree}`} />
      <span className={`${styles.mapLine} ${styles.mapLineFour}`} />
      <span className={`${styles.mapLine} ${styles.mapLineFive}`} />
      <div className={styles.mapCaption}>
        One connected view of the work—not five disconnected vendors.
      </div>
    </div>
  );
}

export default function OssHomepageProofPage() {
  return (
    <main
      className={styles.page}
      data-oss-proof="ready"
      data-proof-candidate="first"
      id="main-content"
    >
      <div className={styles.proofNotice} role="note">
        <span>Proof candidate · not the live OSS website</span>
        <span>Slice 5.2</span>
      </div>

      <header className={styles.header} id="proof-top">
        <a className={styles.brand} href="#proof-top" aria-label="Online Scope Studio proof home">
          <span className={styles.brandMark}>OS</span>
          <span>
            Online Scope
            <strong>Studio</strong>
          </span>
        </a>
        <nav aria-label="Candidate navigation" className={styles.navigation}>
          <a href="#proof-services">Services</a>
          <a href="#proof-work">Work</a>
          <a href="#proof-process">Process</a>
        </nav>
        <a className={styles.headerAction} href="#proof-contact">
          Start a project
          <ArrowIcon />
        </a>
      </header>

      <section className={styles.hero} aria-labelledby="oss-proof-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Web · commerce · automation · products</p>
          <h1 id="oss-proof-title">
            Your business needs a technical partner, not another hand-off.
          </h1>
          <p className={styles.heroSummary}>
            Online Scope Studio designs and builds the websites, systems, and
            workflows that help growing businesses operate with more clarity.
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#proof-contact">
              Discuss your project
              <ArrowIcon />
            </a>
            <a className={styles.secondaryAction} href="#proof-work">
              See selected work
            </a>
          </div>
          <dl className={styles.heroPrinciples}>
            <div>
              <dt>One partner</dt>
              <dd>Across design, development, and automation</dd>
            </div>
            <div>
              <dt>Built in context</dt>
              <dd>Around the way your business actually works</dd>
            </div>
            <div>
              <dt>Longer horizon</dt>
              <dd>Launch support and the next useful improvement</dd>
            </div>
          </dl>
        </div>
        <SystemMap />
      </section>

      <section className={styles.statement} aria-label="Positioning statement">
        <p>
          From the public website to the workflows behind it, we connect the
          customer experience with the operational system that has to support
          it.
        </p>
        <span>Strategy to support</span>
      </section>

      <section
        className={styles.section}
        id="proof-services"
        aria-labelledby="services-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>What we help build</p>
          <h2 id="services-title">Choose the business problem, not the platform.</h2>
          <p>
            The stack follows the job. Each engagement starts with what must
            improve for the customer or the team—not a pre-selected template.
          </p>
        </div>
        <div className={styles.serviceGrid}>
          {servicePaths.map((service) => (
            <article className={styles.serviceCard} key={service.index}>
              <span>{service.index}</span>
              <h3>{service.title}</h3>
              <p>{service.body}</p>
              <small>{service.scope}</small>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.workSection}`}
        id="proof-work"
        aria-labelledby="work-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>Selected work</p>
          <h2 id="work-title">Evidence of range, without invented results.</h2>
          <p>
            Three different kinds of build: a public utility, a commerce
            storefront, and an internal research system in active development.
          </p>
        </div>
        <div className={styles.workList}>
          {projects.map((project, index) => (
            <article className={styles.workItem} key={project.name}>
              <div className={styles.workNumber}>0{index + 1}</div>
              <div className={styles.workBody}>
                <p>{project.type}</p>
                <h3>{project.name}</h3>
                <span>{project.summary}</span>
              </div>
              <ul aria-label={`${project.name} disciplines`}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.processSection}`}
        id="proof-process"
        aria-labelledby="process-title"
      >
        <div className={styles.sectionHeading}>
          <p className={styles.sectionLabel}>How the partnership works</p>
          <h2 id="process-title">Small enough to stay accountable. Structured enough to scale.</h2>
        </div>
        <ol className={styles.processList}>
          {processSteps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.capabilitySection} aria-labelledby="capability-title">
        <div>
          <p className={styles.sectionLabel}>Capability depth</p>
          <h2 id="capability-title">The right specialists and systems, held together by one context.</h2>
          <p>
            Tools change. The valuable part is retaining the decisions,
            constraints, and operating knowledge across each piece of work.
          </p>
        </div>
        <ul>
          {capabilities.map((capability) => (
            <li key={capability}>
              <span>{capability}</span>
              <ArrowIcon />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.partnerSection} aria-labelledby="partner-title">
        <div className={styles.partnerIntro}>
          <p className={styles.sectionLabel}>Why a technical partner</p>
          <h2 id="partner-title">Fewer gaps between the idea, the build, and the work after launch.</h2>
        </div>
        <div className={styles.partnerPoints}>
          <article>
            <span>01</span>
            <h3>Context compounds</h3>
            <p>
              The next improvement starts with what has already been learned,
              rather than another vendor rediscovering the business.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Trade-offs stay visible</h3>
            <p>
              Scope, speed, maintenance, and quality decisions are discussed as
              one system instead of hidden inside separate deliverables.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Support has a path</h3>
            <p>
              Launch is a checkpoint. The relationship can continue through
              fixes, measurement, maintenance, and the next useful build.
            </p>
          </article>
        </div>
      </section>

      <section className={styles.contactSection} id="proof-contact" aria-labelledby="contact-title">
        <div>
          <p className={styles.sectionLabel}>Start with the problem</p>
          <h2 id="contact-title">What should work better in your business six months from now?</h2>
        </div>
        <div className={styles.contactPanel}>
          <p>
            Bring the goal, the current setup, and the bottleneck. We will help
            shape the smallest useful next step.
          </p>
          <a href="#proof-top">
            Consultation path — proof only
            <ArrowIcon />
          </a>
          <small>
            This candidate intentionally does not submit a form or contact an
            external service.
          </small>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>Online Scope Studio · proof candidate</span>
        <a href="#proof-top">Back to top</a>
      </footer>
    </main>
  );
}
