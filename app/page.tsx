import { Navigation } from "@/components/ui/Navigation";
import { Hero } from "@/components/sections/Hero";
import { QuestBoard } from "@/components/sections/QuestBoard";
import {
  Journal,
  Training,
  Milestone,
  SidePaths,
} from "@/components/sections/TrailSections";
import { Campfire } from "@/components/sections/Campfire";
import { PixelWorld } from "@/components/world/PixelWorld";
import styles from "@/components/sections/Journey.module.css";
export default function Home() {
  return (
    <div className={styles.journey}>
      <PixelWorld />
      <Navigation />
      <main id="main">
        <Hero />
        <Journal />
        <QuestBoard />
        <Training />
        <Milestone />
        <SidePaths />
        <Campfire />
      </main>
    </div>
  );
}
