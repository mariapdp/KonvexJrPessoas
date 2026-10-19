import { createFileRoute } from "@tanstack/react-router";
import { KonvexApp } from "@/components/KonvexApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Konvex Jr · Gente & Cultura" },
      {
        name: "description",
        content:
          "Aplique 1:1, PDI, Feedback 360 e Pesquisa de Clima para diretorias, gerências, membros e trainees.",
      },
      { property: "og:title", content: "Konvex Jr · Gente & Cultura" },
      {
        property: "og:description",
        content: "Aplique 1:1, PDI, Feedback 360 e Pesquisa de Clima na Konvex Jr.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KonvexApp,
});
