import { Route, Switch } from "wouter";
import Dashboard from "@/pages/Dashboard";
import PrayerJournal from "@/pages/PrayerJournal";
import HabitTracker from "@/pages/HabitTracker";
import Devotionals from "@/pages/Devotionals";
import BibleReadingPlan from "@/pages/BibleReadingPlan";
import SpiritualMentor from "@/pages/SpiritualMentor";
import Settings from "@/pages/Settings";
import About from "@/pages/About";
import AboutDeveloper from "@/pages/AboutDeveloper";
import Dedication from "@/pages/Dedication";
import Feedback from "@/pages/Feedback";
import DreamsInterpreter from "@/pages/DreamsInterpreter";
import { HolyBible } from "@/pages/HolyBible";
import Search from "@/pages/Search";
import NotFound from "@/pages/NotFound";
import BottomNavigation from "./BottomNavigation";

/**
 * AppStack - Navigation for authenticated users
 * Contains: Dashboard, Prayer, Habits, Devotionals, Bible, Mentor, Settings, Search, etc.
 */
export default function AppStack() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 pb-24">
        <Switch>
          {/* Main app routes */}
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/prayers" component={PrayerJournal} />
          <Route path="/habits" component={HabitTracker} />
          <Route path="/devotionals" component={Devotionals} />
          <Route path="/bible" component={BibleReadingPlan} />
          <Route path="/mentor" component={SpiritualMentor} />
          <Route path="/settings" component={Settings} />
          <Route path="/about" component={About} />
          <Route path="/about-developer" component={AboutDeveloper} />
          <Route path="/dedication" component={Dedication} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/dreams" component={DreamsInterpreter} />
          <Route path="/holy-bible" component={HolyBible} />
          <Route path="/search" component={Search} />
          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {/* Bottom navigation for authenticated users */}
      <BottomNavigation />
    </div>
  );
}
