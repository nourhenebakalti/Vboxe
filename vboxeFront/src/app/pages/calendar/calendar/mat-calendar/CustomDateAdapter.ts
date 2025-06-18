import { NativeDateAdapter } from "@angular/material/core";

export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    // Si un autre format est nécessaire, tu peux le gérer ici
    // Utiliser Intl.DateTimeFormat pour obtenir le format initial
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
    }).format(date);
    // Ajouter un espace entre le mois et l'année
    return formattedDate.replace(" ", "  ");
  }
  // Personnaliser l'affichage des jours de la semaine (par exemple : "Lun", "Mar")
  override getDayOfWeekNames(style: "short" | "narrow" | "long"): string[] {
    return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  }
}
