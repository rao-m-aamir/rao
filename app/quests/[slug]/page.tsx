import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Compass,
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Scroll,
  Layers,
  Wrench,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, projectParams } from "@/lib/projects";
import { projects } from "@/content/projects";
import { PixelWorld } from "@/components/world/PixelWorld";
import styles from "@/components/quests/QuestPage.module.css";

export const generateStaticParams = () => projectParams();
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = getProject((await params).slug);
  return {
    title: p?.title ?? "Trail not found",
    description: p?.summary,
  };
}

export default async function Quest({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  // Find next project in circular order
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject =
    projects[(currentIndex + 1) % projects.length] ?? projects[0];

  const themeClass =
    project.accent === "wood" ? styles.themeWood : styles.themeMint;

  return (
    <div className={`${styles.questContainer} ${themeClass}`}>
      {/* Living 8-bit background canvas */}
      <PixelWorld />

      {/* Sticky Top HUD Header */}
      <header className={styles.headerHUD}>
        <Link href="/" className={styles.brandLink}>
          <Compass size={22} aria-hidden="true" />
          <span>
            rao.
            <span className={styles.brandSub}>
              WANDERING LOG / QUEST RECORD
            </span>
          </span>
        </Link>
        <div className={styles.hudActions}>
          <Link href="/#quests" className={styles.backButton}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to the quest board</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main" className={styles.questMain}>
        {/* Quest Hero Card */}
        <div className={styles.questHero}>
          <div className={styles.categoryBadge}>
            <Sparkles size={14} aria-hidden="true" />
            <span>QUEST RECORD / {project.category}</span>
          </div>

          <h1 className={styles.questTitle}>{project.title}</h1>
          <p className={styles.leadSummary}>{project.summary}</p>

          <div className={styles.stackList} aria-label="Technologies used">
            {project.stack.map((item) => (
              <span key={item} className={styles.stackPill}>
                {item}
              </span>
            ))}
          </div>

          {/* Quick Nav Ribbon */}
          <nav className={styles.navRibbon} aria-label="Quest sections">
            <a href="#brief" className={styles.navPill}>
              <Scroll size={14} aria-hidden="true" /> The Brief
            </a>
            <a href="#mechanics" className={styles.navPill}>
              <Wrench size={14} aria-hidden="true" /> Quest Mechanics
            </a>
            <a href="#notes" className={styles.navPill}>
              <Layers size={14} aria-hidden="true" /> Field Notes
            </a>
            {project.collaborators && (
              <a href="#party" className={styles.navPill}>
                <Users size={14} aria-hidden="true" /> The Party
              </a>
            )}
            {project.media?.length ? (
              <a href="#gallery" className={styles.navPill}>
                Gallery
              </a>
            ) : null}
          </nav>
        </div>

        {/* Section 01: Quest Brief */}
        <section id="brief" className={styles.questSection}>
          <span className={styles.sectionEyebrow}>01 / QUEST BRIEF</span>
          <h2 className={styles.sectionTitle}>A little context.</h2>
          <p className={styles.sectionBody}>{project.problem}</p>

          {project.contribution && (
            <div className={styles.contributionBox}>
              <span className={styles.sectionEyebrow}>MY JOURNEY</span>
              <h3>My contribution.</h3>
              <p>{project.contribution}</p>
            </div>
          )}
        </section>

        {/* Section 02: Quest Mechanics */}
        <section id="mechanics" className={styles.questSection}>
          <span className={styles.sectionEyebrow}>02 / QUEST MECHANICS</span>
          <h2 className={styles.sectionTitle}>What’s inside.</h2>

          <div className={styles.featureGrid}>
            {project.features.map((feature, idx) => (
              <article key={feature.title} className={styles.featureCard}>
                <span className={styles.featureIndex}>
                  [ FEATURE 0{idx + 1} ]
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Section 03: Field Notes & Flow Pipeline */}
        <section id="notes" className={styles.questSection}>
          <span className={styles.sectionEyebrow}>03 / FIELD NOTES</span>
          <h2 className={styles.sectionTitle}>Under the surface.</h2>

          {/* Visual Data Flow Pipeline */}
          {project.flow && project.flow.length > 0 && (
            <div>
              <span className={styles.sectionEyebrow}>EXECUTION PIPELINE</span>
              <div className={styles.flowPipeline}>
                {project.flow.map((step, idx) => (
                  <div key={step} style={{ display: "contents" }}>
                    <div className={styles.flowStep}>{step}</div>
                    {idx < project.flow.length - 1 && (
                      <span className={styles.flowArrow} aria-hidden="true">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Architecture Notes List */}
          <div className={styles.notesList}>
            {project.notes.map((note) => (
              <div key={note} className={styles.noteItem}>
                <span className={styles.noteBullet} aria-hidden="true">
                  ◆
                </span>
                <span>{note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Loot Acquired (Lessons) */}
        {project.lessons?.length ? (
          <section className={styles.questSection}>
            <span className={styles.sectionEyebrow}>LOOT ACQUIRED</span>
            <h2 className={styles.sectionTitle}>What I took away.</h2>
            <div className={styles.lootList}>
              {project.lessons.map((lesson) => (
                <div key={lesson} className={styles.lootItem}>
                  <Sparkles size={16} className={styles.lootIcon} />
                  <span>{lesson}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Section: The Party (Collaborators) */}
        {project.collaborators && (
          <section id="party" className={styles.questSection}>
            <span className={styles.sectionEyebrow}>THE PARTY</span>
            <h2 className={styles.sectionTitle}>Built with company.</h2>
            <div className={styles.partyBox}>
              {project.collaborators.map((name) => (
                <div key={name} className={styles.partyMember}>
                  {name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Gallery if media exists */}
        {project.media?.length ? (
          <section id="gallery" className={styles.questSection}>
            <span className={styles.sectionEyebrow}>FROM THE FIELD</span>
            <h2 className={styles.sectionTitle}>A closer look.</h2>
            <div className="project-gallery">
              {project.media.map((media) => (
                <figure key={media.src}>
                  <a href={media.src} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      sizes="(max-width: 600px) 100vw, 50vw"
                    />
                  </a>
                  <figcaption>{media.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {/* Footer Actions & Next Quest */}
        <footer className={styles.questFooter}>
          {/* Source / Demo Actions */}
          {(project.sourceUrl || project.demoUrl) && (
            <div className={styles.destinationsGrid}>
              {project.sourceUrl && (
                <a
                  className={styles.destButtonSecondary}
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source <ArrowUpRight size={16} />
                </a>
              )}
              {project.demoUrl && (
                <a
                  className={styles.destButtonPrimary}
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try the project <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          )}

          {/* Next Quest Card */}
          {nextProject && nextProject.slug !== project.slug && (
            <div className={styles.nextQuestCard}>
              <div>
                <span className={styles.sectionEyebrow}>NEXT SIDE QUEST</span>
                <h4>{nextProject.title}</h4>
                <p>{nextProject.summary}</p>
              </div>
              <Link
                href={`/quests/${nextProject.slug}`}
                className={styles.destButtonPrimary}
                aria-label={`Explore ${nextProject.title}`}
              >
                Inspect Quest <ArrowRight size={16} />
              </Link>
            </div>
          )}

          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link href="/#quests" className={styles.destButtonSecondary}>
              <ArrowLeft size={16} /> Return to the quest board
            </Link>
          </div>

          <p className={styles.footerSignoff}>
            There’s always another side quest.
          </p>
        </footer>
      </main>
    </div>
  );
}
