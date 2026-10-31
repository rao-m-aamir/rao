import {
  Code2,
  PenTool,
  Users,
  Compass,
  Trophy,
  Signpost,
  Eye,
} from "lucide-react";
import { skills, interests, achievements, sideQuests } from "@/content/world";
import styles from "./Journey.module.css";
export function Journal() {
  return (
    <section id="journal" className={styles.journal}>
      <div className={styles.journalAside}>
        <p className="eyebrow">02 / MEET THE TRAVELLER</p>
      </div>
      <div>
        <h2>
          Curiosity is
          <br />
          my compass.
        </h2>
        <p>
          I’m Rao, a Computer Science student with an inconvenient tendency to
          become interested in things at the Institute of Space Technology.
        </p>
        <p>
          That has taken me through software development, Android, AI, web
          products, competitive programming, creative work, and community. I
          like turning “what if?” into something you can actually use.
        </p>
        <p>
          These days, I’m leading ventures and product launches at{" "}
          <strong>AFRIUM</strong> and running social media and marketing at{" "}
          <strong>DevCore</strong>.
        </p>
        <p>
          I’m still figuring out whether these paths lead to a main quest.
          <br />
          <strong>
            Until then, I’m building things and following the trail.
          </strong>
        </p>
        <div className={styles.currentPaths}>
          <span className="eyebrow">CURRENT PATHS</span>
          <div className="tags">
            {[
              "Software",
              "AI",
              "Product",
              "Creative work",
              "Community",
            ].map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export function Training() {
  const icons = [Code2, PenTool, Users];
  return (
    <section id="training" className={styles.training}>
      <div className={styles.sectionTop}>
        <div>
          <p className="eyebrow">04 / TOOLS FOR THE ROAD</p>
          <h2>The training grounds.</h2>
        </div>
        <p>
          A mixed inventory.
          <br />
          Every adventure calls for something different.
        </p>
      </div>
      <div className={styles.skills}>
        {skills.map((group, i) => {
          const Icon = icons[i];
          return (
            <article key={group.name}>
              <Icon size={25} strokeWidth={1.3} />
              <h3>{group.name}</h3>
              <p>{group.note}</p>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>
                    <span>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
export function Milestone() {
  return (
    <section id="milestone" className={styles.milestone}>
      <div className={styles.trophy}>
        <Trophy size={58} strokeWidth={1.1} />
        <span>II</span>
      </div>
      <div>
        <p className="eyebrow">05 / A STONE ALONG THE WAY</p>
        <h2>A little milestone.</h2>
        {achievements.map((a) => (
          <div key={a.title} className={styles.milestoneEntry}>
            <p>
              <strong>
                {a.result} — {a.title}
              </strong>
            </p>
            <span className={styles.milestoneNote}>{a.context}</span>
          </div>
        ))}
      </div>
      <p className={styles.milestoneQuote}>
        Some quests come
        <br />
        with a small trophy.
      </p>
    </section>
  );
}
export function SidePaths() {
  return (
    <section id="side-paths" className={styles.sidePaths}>
      <div>
        <p className="eyebrow">06 / FOLLOWING THE DETOURS</p>
        <h2>
          The interesting
          <br />
          way around.
        </h2>
        <p>
          Design experiments, tiny programs, visual stories,
          <br className={styles.desktopBreak} /> and whatever catches my
          attention next.
        </p>
      </div>
      <div className={styles.sideEmpty}>
        <Signpost size={42} strokeWidth={1} />
        {sideQuests.length ? (
          sideQuests.map((q) => (
            <article key={q.title}>
              <h3>
                {q.href ? <a href={q.href}>{q.title}</a> : q.title}
              </h3>
              <p>{q.description}</p>
            </article>
          ))
        ) : (
          <>
            <span className="eyebrow">SIDE QUESTS</span>
            <h3>
              More strange paths
              <br />
              are being explored.
            </h3>
            <p>Field notes coming when there’s a story to tell.</p>
            <span className={styles.dottedTrail}>· · · · ·</span>
          </>
        )}
      </div>
    </section>
  );
}
export function Unexplored() {
  return (
    <section id="unexplored" className={styles.unexplored}>
      <p className="eyebrow">07 / BEYOND THE EDGE OF THE MAP</p>
      <h2>Unexplored territory.</h2>
      <p>Whatever piques my curiosity.</p>
      <div className={styles.interests}>
        {interests.map((name, i) => (
          <div key={name}>
            {i === 0 ? (
              <Compass size={20} />
            ) : i === 1 ? (
              <Eye size={20} />
            ) : (
              <Users size={20} />
            )}
            <span>{name}</span>
            <small>YET TO EXPLORE</small>
          </div>
        ))}
      </div>
    </section>
  );
}
