import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import './menu.css';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class LeftMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        console.log('click ', e);
        this.setState({
        current: e.key,
        });
    }
    render() {
        return (
            <Menu onClick={this.handleClick}
                style={{ width: 240 }}
                defaultOpenKeys={['sub1']}
                selectedKeys={[this.state.current]}
                mode="inline"
            >
                <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
                    {
                        this.props.menuList.map((item, index) => {
                            return (<Menu.Item key={item.id}><Link to={item.link}>{item.name}</Link></Menu.Item>);
                        })
                    }
                </SubMenu>
            </Menu>
            // <Menu onClick={this.handleClick}
            //     style={{ width: 240 }}
            //     defaultOpenKeys={['sub1']}
            //     selectedKeys={[this.state.current]}
            //     mode="inline"
            // >
            //     <SubMenu key="sub1" title={<span><Icon type="mail" /><span>Navigation One</span></span>}>
            //     <MenuItemGroup title="Item 1">
            //         <Menu.Item key="1">Option 1</Menu.Item>
            //         <Menu.Item key="2">Option 2</Menu.Item>
            //     </MenuItemGroup>
            //     <MenuItemGroup title="Item 2">
            //         <Menu.Item key="3">Option 3</Menu.Item>
            //         <Menu.Item key="4">Option 4</Menu.Item>
            //     </MenuItemGroup>
            //     </SubMenu>
            //     <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>Navigation Two</span></span>}>
            //     <Menu.Item key="5">Option 5</Menu.Item>
            //     <Menu.Item key="6">Option 6</Menu.Item>
            //     <SubMenu key="sub3" title="Submenu">
            //         <Menu.Item key="7">Option 7</Menu.Item>
            //         <Menu.Item key="8">Option 8</Menu.Item>
            //     </SubMenu>
            //     </SubMenu>
            //     <SubMenu key="sub4" title={<span><Icon type="setting" /><span>Navigation Three</span></span>}>
            //     <Menu.Item key="9">Option 9</Menu.Item>
            //     <Menu.Item key="10">Option 10</Menu.Item>
            //     <Menu.Item key="11">Option 11</Menu.Item>
            //     <Menu.Item key="12">Option 12</Menu.Item>
            //     </SubMenu>
            // </Menu>
        );
    }
}

export default LeftMenu;