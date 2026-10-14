import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";
import "@/lib/booking/api";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: () => (
      <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
        <p className="text-sm">Page not found</p>
      </div>
    ),
  });
}

