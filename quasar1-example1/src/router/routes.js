/*
 * @Descripttion: []
 * @Copyright: Copyright by Iswoter
 * @Author: Iseven Monkey <iswoter@gmail.com>
 * @LastEditors: Iseven Monkey <iswoter@gmail.com>
 * @LastEditTime: 2022-07-06 15:07:12
 * @FilePath: /quasar-v1/src/router/routes.js
 */
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/Index.vue") },
      { path: "tab2", component: () => import("pages/Tab2.vue") },
      { path: "tab3", component: () => import("pages/Tab4.vue") },
      { path: "tab4", component: () => import("pages/Tab4.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
