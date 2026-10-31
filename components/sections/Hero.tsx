import { ArrowDown, ArrowUpRight } from "lucide-react";
import styles from "./Journey.module.css";
export function Hero() {
  return (
    <section id="spawn" className={styles.hero}>
      <div className={styles.heroCopy}>
        <p className="eyebrow">RAO’S WANDERING LOG / CHAPTER 01</p>
        <p className={styles.hello}>Hey, I’m Rao.</p>
        <h1>
          Taking the
          <br />
          scenic route<span>.</span>
        </h1>
        <p className={styles.fullName}>MUHAMMAD AAMIR SAIFI</p>
        <p className={styles.intro}>
          Computer Science student.
          <br />
          Curious builder. Habitual side-quest taker.
        </p>
        <p className={styles.hook}>
          An adventurer that gets into way too many side-quests because he just
          doesn’t know if there’s a main quest.
        </p>
        <div className={styles.heroActions}>
          <a href="#journal" className="button">
            Begin the journey <ArrowDown size={16} />
          </a>
          <a className="text-link" href="#quests">
            Explore the work <ArrowUpRight size={15} />
          </a>
        </div>
        <div className={styles.stats}>
          <div>
            <span>CLASS</span>
            <strong>CS Student</strong>
          </div>
          <div>
            <span>STATUS</span>
            <strong className={styles.statusBeacon}>
              <span className={styles.beaconDot} aria-hidden="true" /> Exploring
            </strong>
          </div>
          <div>
            <span>MAIN QUEST</span>
            <strong>???</strong>
          </div>
        </div>
      </div>
      <a href="#journal" className={styles.scrollHint}>
        <span>THE WORLD UNFOLDS BELOW</span>
        <ArrowDown size={17} />
      </a>
    </section>
  );
}
