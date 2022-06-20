import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/user/login.vue';
import HomeLayout from '../layouts/HomeLayout';
import Store from '../store/index';

Vue.use(VueRouter);

const routes = [{
    path: '/login',
    name: 'login',
    component: Login,
},
    {
        path: '/HomeLayout',
        name: 'HomeLayout',
        component: HomeLayout,
        redirect: '/welcome',
        children: [{
            path: '/NotFound',
            name: 'NotFound',
            component: () =>
                import ('../views/other/NotFound'),
        },
            {
                path: '/welcome',
                name: 'welcome',
                component: () =>
                    import ('../views/other/welcome'),
            },
            {
                path: '/users',
                name: 'users',
                component: () =>
                    import ('../views/user/users'),
            },
            {
                path: '/roles',
                name: 'roles',
                component: () =>
                    import ('../views/rights/roles'),
            },
            {
                path: '/rights',
                name: 'rights',
                component: () =>
                    import ('../views/rights/rightList'),
            },
            {
                path: '/goods',
                name: 'goods',
                component: () =>
                    import ('../views/goods/goodsList'),
            },
            {
                path: '/params',
                name: 'params',
                component: () =>
                    import ('../views/goods/params'),
            },
            {
                path: '/categories',
                name: 'categories',
                component: () =>
                    import ('../views/goods/categories'),
            },
            {
                path: '/orders',
                name: 'orders',
                component: () =>
                    import ('../views/order/orderList'),
            },
            {
                path: '/reports',
                name: 'reports',
                component: () =>
                    import ('../views/other/reports'),
            }
        ],
    },
    {
        path: '*',
        name: '404',
        redirect: '/NotFound',
    },
];

const router = new VueRouter({
    routes,
});
router.beforeEach((to, from, next) => {
    if (to.path === '/login' && Store.getters.getToken) {
        return next('/HomeLayout');
    }
    if (to.path !== '/login' && !Store.getters.getToken) {
        return next('/login');
    }
    next();
});
export default router;
