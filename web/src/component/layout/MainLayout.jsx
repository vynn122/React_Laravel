import React, { useEffect, useState } from "react";
import {
  DashboardOutlined,
  DesktopOutlined,
  DownOutlined,
  FileOutlined,
  LogoutOutlined,
  PieChartOutlined,
  RocketFilled,
  SettingOutlined,
  ShoppingOutlined,
  ShopTwoTone,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./MainLayout.css";
import { Breadcrumb, Dropdown, Input, Layout, Menu, Space, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";
import ImgUser from "../../assets/image.png";
import { IoIosNotifications } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { profileStore } from "../../store/profileStore";
import config from "../../utils/config";

const { Header, Content, Footer, Sider } = Layout;

const items = [
  {
    key: "",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    children: null,
  },
  {
    key: "role",
    label: "Role",
    icon: <RocketFilled />,
    children: null,
  },
  {
    key: "brand",
    label: "Brand",
    icon: <ShopTwoTone />,
    children: null,
  },
  {
    key: "customer",
    label: "Customer",
    icon: <UserOutlined />,
    children: null,
  },
  {
    key: "product",
    label: "Product",
    icon: <ShoppingOutlined />,
    children: [
      {
        key: "product/category",
        label: "Category",
        icon: <FileOutlined />,
        children: null,
      },
      {
        key: "product/category1",
        label: "Stock",
        icon: <DesktopOutlined />,
        children: null,
      },
      {
        key: "product/category2",
        label: "Stock1",
        icon: <DesktopOutlined />,
        children: null,
      },
    ],
  },
];
const dropDownItems = [
  {
    key: "1",
    label: "My Account",
    disabled: true,
  },
  {
    type: "divider",
  },
  {
    key: "profile",
    label: "Profile",
    extra: "👤",
  },
  {
    key: "Logout",
    label: "Logout",
    extra: <LogoutOutlined />,
    danger: true,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
  },
];
/*
    --defaultSelectedKeys={[""]} vea base ler key vea jg oy select na mun dak doch key name in items[]
    and item.key we use it as a route path
 */
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();

  const onClickMenu = (item) => {
    navigate(item.key);
  };
  const { profile, logout } = profileStore();
  useEffect(() => {
    if (!profile) {
      navigate("/login");
    }
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          onClick={onClickMenu}
        />
      </Sider>
      <Layout>
        <div className="admin-header">
          <div className="admin-header-g1">
            <div>
              <img className="admin-logo" src={Logo} alt="Logo" />
            </div>
            <div>
              <div className="txt-brand-name">COOL</div>
              <div>Computer & Phone Shop</div>
            </div>
            <div>
              <Input.Search
                style={{ width: 180, marginLeft: 15, marginTop: 10 }}
                size="large"
                placeholder="Search"
              />
            </div>
          </div>
          <Dropdown
            menu={{
              items: dropDownItems,
              onClick: (item) => {
                if (item.key == "Logout") {
                  navigate("/login");
                  logout();
                }
                alert(item.key);
              },
            }}
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <div className="admin-header-g2">
                  <div>
                    <div className="txt-username">{profile?.name}</div>
                    <div>Admin</div>
                  </div>

                  {profile?.profile?.image ? (
                    <img
                      className="img-user"
                      src={config.IMAGE_PATH + profile?.profile?.image}
                      alt="User Image"
                    />
                  ) : (
                    <img className="img-user" src={ImgUser} alt="User Image" />
                  )}
                </div>
                {/* <DownOutlined /> */}
              </Space>
            </a>
          </Dropdown>
        </div>
        <Content
          style={{
            margin: "10px",
          }}
        >
          <div
            className="admin-body"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainLayout;
