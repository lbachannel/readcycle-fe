import React, { useEffect, useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space } from 'antd';
import { Outlet, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import type { MenuProps } from 'antd';
type MenuItem = Required<MenuProps>['items'][number];

const { Content, Footer, Sider } = Layout;


const LayoutAdmin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('');
    const {
        user, isAuthenticated
    } = useCurrentApp();

    const location = useLocation();

    const items: MenuItem[] = [
        {
            label: <Link to='/admin'>Dashboard</Link>,
            key: '/admin',
            icon: <AppstoreOutlined />,

        },
        {
            label: <span>Manage Users</span>,
            key: '/admin/user',
            icon: <UserOutlined />,
            children: [
                {
                    label: <Link to='/admin/user'>CRUD</Link>,
                    key: '/admin/user',
                    icon: <TeamOutlined />,
                },
            ]
        },
        {
            label: <Link to='/admin/book'>Manage Books</Link>,
            key: '/admin/book',
            icon: <ExceptionOutlined />
        },
        {
            label: <Link to='/admin/order'>Manage Orders</Link>,
            key: '/admin/order',
            icon: <DollarCircleOutlined />
        },

    ];


    useEffect(() => {
        const active: any = items.find(item => location.pathname === (item!.key as any)) ?? "/admin";
        setActiveMenu(active.key)
    }, [location])


    const itemsDropdown = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
            >Account management</label>,
            key: 'account',
        },
        {
            label: <Link to={'/'}>Home</Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
            >Log out</label>,
            key: 'logout',
        },

    ];

    if (isAuthenticated === false) {
        return (
            <Outlet />
        )
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role?.name;
        if (role === "user") {
            return (
                <Outlet />
            )
        }
    }

    return (
        <>
            <Layout
                style={{ minHeight: '100vh' }}
                className="layout-admin"
            >
                <Sider
                    theme='light'
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                        Admin
                    </div>
                    <Menu
                        // defaultSelectedKeys={[activeMenu]}
                        selectedKeys={[activeMenu]}
                        mode="inline"
                        items={items}
                        onClick={(e) => setActiveMenu(e.key)}
                    />
                </Sider>
                <Layout>
                    <div className='admin-header' style={{
                        height: "50px",
                        borderBottom: "1px solid #ebebeb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 15px",

                    }}>
                        <span>
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </span>
                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                            <Space style={{ cursor: "pointer" }}>
                                {user?.name}
                            </Space>
                        </Dropdown>
                    </div>
                    <Content style={{ padding: '15px' }}>
                        <Outlet />
                    </Content>
                    <Footer style={{ padding: 0, textAlign: "center" }}>
                        © Copyright belongs to AnLB | Powered by AnLB
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default LayoutAdmin;