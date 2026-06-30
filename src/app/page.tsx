import { getEventConfig } from "@/lib/event-config";
import { LandingPage } from "@/components/sections/landing-page";

export default async function HomePage() {
  const config = await getEventConfig();
  return <LandingPage config={config} />;
}
