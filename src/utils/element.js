/**
 * @module element-ui组件注册
 *
 *
 */
import {
    Alert,
    Aside,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    Cascader,
    Col,
    Container,
    Dialog,
    Empty,
    Form,
    FormItem,
    Header,
    Icon,
    Input,
    Main,
    Menu,
    MenuItem,
    MenuItemGroup,
    MessageBox,
    Option,
    Pagination,
    Row,
    Select,
    Submenu,
    Switch,
    Table,
    TableColumn,
    TabPane,
    Tabs,
    Tag,
    Timeline,
    TimelineItem,
    Tooltip,
    Tree,
    Upload,
} from 'element-ui';
import myTable from '@/components/Table';
import myDialog from '@/components/Dialog';
import myForm from '@/components/From';
import myDform from '@/components/DialogForm';
import mySearch from '@/components/Search';

export default {
    /**
     * 安装组件
     * @param Vue 是vue
     */
    install(Vue) {
        Vue.prototype.$confirm = (msg, title = '提示') => {
            return new Promise((resolve, reject) => {
                MessageBox.confirm(msg, title, {
                    beforeClose(action, instance) {
                        if (action === 'confirm') {
                            return resolve(instance.close);
                        }
                        if (action === 'cancel') {
                            reject();
                            return instance.close();
                        }
                    },
                });
            });
        };
        [mySearch, myTable, myDform, myDialog, myForm].forEach((com) =>
            Vue.component(com.name, com)
        );
        [
            Timeline,
            TimelineItem,
            Aside,
            Breadcrumb,
            BreadcrumbItem,
            Button,
            Card,
            Col,
            Container,
            Dialog,
            Empty,
            Form,
            FormItem,
            Header,
            Icon,
            Input,
            Main,
            Menu,
            MenuItem,
            MenuItemGroup,
            Option,
            Pagination,
            Row,
            Select,
            Submenu,
            Switch,
            Table,
            TableColumn,
            Tabs,
            Tag,
            Tooltip,
            Tree,
            Upload,
            Alert,
            Cascader,
            TabPane,
        ].forEach((component) => Vue.use(component));
    },
};
