import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("@/view/user/login/UserLogin.vue"),
    },
    {
      path: "/register",
      component: () => import("@/view/user/register/UserRegister.vue"),
    },
    {
      path: "/update_password",
      component: () => import("@/view/user/update_password/UpdatePassword.vue"),
    },
    {
      path: "/main",
      component: () => import("@/view/main/MainPage.vue"),
      children: [
        {
          path: "/aaa",
          component: () => import("@/view/main/children/AaaA.vue"),
        },
        {
          path: "/update",
          component: () => import("@/view/main/children/UpdateInfo.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("@/view/NotFound.vue"),
    },
  ],
});

export default router;
