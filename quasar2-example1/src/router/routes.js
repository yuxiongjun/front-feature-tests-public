const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/tab2", component: () => import("pages/Tab2Page.vue") },
      { path: "/tab3", component: () => import("pages/Tab3Page.vue") },
      { path: "/tab4", component: () => import("pages/Tab4Page.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
