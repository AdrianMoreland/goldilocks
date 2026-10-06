import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // A living preview of the site components for development; never part of the production build.
  ...(process.env.NODE_ENV === "production" ? [] : [route("components", "routes/components.tsx")]),
] satisfies RouteConfig;
