import { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Drawer, Dropdown, Space, App } from 'antd';
import { useNavigate } from 'react-router';
import './app.header.scss';
import { Link } from 'react-router-dom';
import { useCurrentApp } from 'components/context/app.context';
import ManageAccount from '../client/account';
import { LoginOutlined } from '@ant-design/icons';
import { logoutAPI } from '@/services/api';

interface IProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
}

const AppHeader = (props: IProps) => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
    const {
        isAuthenticated, user, setUser, setIsAuthenticated
    } = useCurrentApp();
    const { message } = App.useApp();

    const handleLogout = async () => {
        const res = await logoutAPI();
        if (res && +res.statusCode === 200) {
            console.log("run")
            setUser(null);
            setIsAuthenticated(false)
            localStorage.removeItem("access_token");
            message.success("Logout successfully");
            navigate('/');
        }
    }

    const navigate = useNavigate();

    let items = [
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenManageAccount(true)}
            >Account management</label>,
            key: 'account',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Logout</label>,
            key: 'logout',
        },

    ];
    if (user?.role?.name === 'admin') {
        items.unshift({
            label: <Link to='/admin'>Admin page</Link>,
            key: 'admin',
        })
    }

    return (
        <>
            <div className="header-container">
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <span onClick={() => navigate('/')}>
                                    <FaReact className='rotate icon-react' />Read Cycle</span>

                                <VscSearchFuzzy className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="Which book do you want to search for below ?"
                                value={props.searchTerm}
                                onChange={(e) => props.setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item mobile">
                                <Divider type='vertical' />
                            </li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span className="navigation__login" onClick={() => navigate('/login')}>
                                        <LoginOutlined /> Login
                                    </span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <Space className='navigation__user' >
                                            {user?.name}
                                        </Space>
                                    </Dropdown>
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            
            <Drawer
                title="Menu"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Account management</p>
                <Divider />

                <p onClick={() => handleLogout()}>Logout</p>
                <Divider />
            </Drawer>

            <ManageAccount
                isModalOpen={openManageAccount}
                setIsModalOpen={setOpenManageAccount}
            />

        </>
    )
};

export default AppHeader;