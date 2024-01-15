import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/menu/room_list",
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
          path: "/update",
          component: () => import("@/view/main/children/UpdateInfo.vue"),
        },
        {
          path: "/menu",
          component: () => import("@/view/main/children/UserMenu.vue"),
          children: [
            {
              path: "room_list",
              component: () => import("@/view/main/children/menu/RoomList.vue"),
            },
            {
              path: "book_record",
              component: () => import("@/view/main/children/menu/BookRecord.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("@/view/NotFound.vue"),
    },
  ],
});

router.beforeEach((to) => {
  //路由守卫：登陆成功(有token)才能进入main页面
  const token = localStorage.getItem("refresh_token");
  if (to.path.startsWith("/menu") && !token) {
    return "/login";
  }
});

export default router;
