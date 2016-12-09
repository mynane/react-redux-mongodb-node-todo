import React, { Component, PropTypes } from 'react';
import { Upload, Button, Icon, message } from 'antd';
import ArticleApi from '../../../api/article';
import './listItem.css';

let uploadUrl = '/common/upload';
const props = {
  name: 'file',
  action: uploadUrl,
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

export default class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            watch: this.props.listData.watch
        };
        this.goDetail = this.goDetail.bind(this);
    }
        onDetail(id) {
        this.props.router.push('/detail?id=' + id);
    }
    goDetail() {
        let watch = ++this.state.watch;
        let id = this.props.listData._id;
        ArticleApi.addWatch( id, watch,() => {
            this.setState({'watch': watch});
        });
        this.props.router.push('/detail?id=' + id);
        
    }

    render() {
        const listData = this.props.listData;
        return (
            <div>
                <div><a href="javascript:;" onClick={this.goDetail}>标题<span>{listData.title}</span></a> 用户<span>{listData.user.phone}</span></div>
                <div>{listData.content}</div>
                <div><span>{this.state.watch}</span>人看过 <span>{listData.commentNumber}</span>条评论</div>
                <Upload {...props}>
                    <Button type="ghost">
                    <Icon type="upload" /> Click to Upload
                    </Button>
                </Upload>
            </div>
        );
    }
}