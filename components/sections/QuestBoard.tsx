import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import styles from "./Journey.module.css";
export function QuestBoard() {
  return (
    <section id="quests" className={styles.quests}>
      <div className={styles.sectionTop}>
        <div>
          <p className="eyebrow">03 / A STOP AT THE TRAVELLERS’ GUILD</p>
          <h2>The quest board.</h2>
        </div>
        <p>
          A couple of paths worth sharing.
          <br />
          Real problems. A little curiosity. Lots learned.
        </p>
      </div>
      <div className={styles.projectGrid}>
        {projects.map((project, index) => (
          <article key={project.slug} className={styles.project}>
            <div className={styles.projectTop}>
              <span className="eyebrow">QUEST / 0{index + 1}</span>
              <span aria-hidden="true">✦</span>
            </div>
            <div className={styles.projectCopy}>
              <p className="eyebrow">{project.category}</p>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="tags">
                {project.stack.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <Link
                className={styles.projectLink}
                href={`/quests/${project.slug}`}
                aria-label={`Explore ${project.title}`}
              >
                Open quest record <ArrowUpRight size={20} />
              </Link>
              {project.sourceUrl ? (
                <a
                  className={styles.projectLink}
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project repository <ArrowUpRight size={20} />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
