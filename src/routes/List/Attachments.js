import React, { PureComponent } from 'react';
import numeral from 'numeral';
import copy from 'copy-to-clipboard';
import moment from 'moment';
import { connect } from 'dva';
import { Upload, Row, Col, Form, Card, Select, Icon, Input, Avatar, Button, message, DatePicker, Modal, List, Tooltip, Dropdown, Menu } from 'antd';

import StandardFormRow from '../../components/StandardFormRow';
import TagSelect from '../../components/TagSelect';

import styles from './Attachments.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

// 上传单个文件
const propsForSingleUpload = {
  name: 'file',
  // multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
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
// 上传多个文件
const propsForMultiUpload = {
  name: 'file',
  multiple: true,
  action: '//jsonplaceholder.typicode.com/posts/',
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
// 重新上传文件即更新操作
const propsForReUpload = {
  name: 'file',
  // multiple: true,
  // action: '//jsonplaceholder.typicode.com/posts/222',
  showUploadList: false,
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

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(state => ({
  attachments: state.attachments,
}))

export default class FilterCardList extends PureComponent {
  state = {
    addInputValueForName: '',
    addInputValueForURL: '',
    disabled: true,
    modalVisibleForUrlUpload: false,
    modalVisible: false,
  };


  componentDidMount() {
    this.props.dispatch({
      type: 'attachments/fetch',
      payload: {
        count: 8,
      },
    });
  }

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields((err) => {
        if (!err) {
          // eslint-disable-next-line
          dispatch({
            type: 'attachments/fetch',
            payload: {
              count: 8,
            },
          });
        }
      });
    }, 0);
  }

  // 复制图片URL到剪贴板
  handleCopyURLtoClipboard = (e) => {
    // console.log('URL:', e);
    copy(e);
    message.success('复制URL到剪贴板成功');
  }

  // 删除选中文件
  handleDelete = (e) => {
    console.log('id:', e);
    console.log('payload:', this.state.addInputValueForName);
    // this.props.dispatch({
    //   type: 'role/delete',
    //   payload: {
    //     name: this.state.addInputValueForName,
    //   },
    // });
  }

  // 编辑模态框-控制器
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  // 上传模态框-控制器
  handleModalVisibleForUrlUpload = (flag) => {
    this.setState({
      modalVisibleForUrlUpload: !!flag,
    });
  }

  // 添加单个数据
  handleAdd = () => {
    // this.props.dispatch({
    //   type: 'role/add',
    //   payload: {
    //     name: this.state.addInputValueForName,
    //   },
    // });
    // message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }


  // 通过URL添加文件
  handleUrlUpload = () => {
    // this.props.dispatch({
    //   type: 'role/add',
    //   payload: {
    //     name: this.state.addInputValueForName,
    //   },
    // });
    message.success('添加成功');
    this.handleModalVisibleForUrlUpload(false);
    // this.setState({
    //   modalVisibleForUrlUpload: false,
    // });
  }

  // 处理添加单个数据表单的Name值--做准备-->添加单个数据
  handleAddInputForName = (e) => {
    this.setState({
      addInputValueForName: e.target.value,
    });
  }

  // 处理上传文件通过URL
  handleAddInputForUrlUpload = (e) => {
    this.setState({
      addInputValueForURL: e.target.value,
    });
  }

  render() {
    const { attachments: { attachments, loading }, form } = this.props;
    const { getFieldDecorator } = form;
    const { modalVisible, modalVisibleForUrlUpload } = this.state;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3d menu item</a>
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect onChange={this.handleFormSubmit} expandable>
                    <TagSelect.Option value="cat2">图像</TagSelect.Option>
                    <TagSelect.Option value="cat3">文档</TagSelect.Option>
                    <TagSelect.Option value="cat4">视频</TagSelect.Option>
                    <TagSelect.Option value="cat5">音频</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow
              title="其它选项"
              grid
              last
            >
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem
                    {...formItemLayout}
                  >
                    <Upload {...propsForSingleUpload}>
                      <Button style={{ marginLeft: 8 }}>
                      上传单个文件
                      </Button>
                    </Upload>
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem
                    {...formItemLayout}
                  >
                    <Upload {...propsForMultiUpload}>
                      <Button style={{ marginLeft: 8 }}>
                      上传多个文件
                      </Button>
                    </Upload>
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem
                    {...formItemLayout}
                  >
                    <Button onClick={() => this.handleModalVisibleForUrlUpload(true)} style={{ marginLeft: 8 }}>
                       通过URL添加
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={attachments}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                hoverable
                cover={<img alt={item.title} src={item.cover} height={154} />}
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <Upload {...propsForReUpload} action="//jsonplaceholder.typicode.com/posts/">
                    <Tooltip title="重新上传"><Icon type="reload" /></Tooltip>
                  </Upload>,
                  <Tooltip onClick={() => this.handleModalVisible(true)} title="编辑"><Icon type="edit" /></Tooltip>,
                  <Tooltip onClick={() => this.handleCopyURLtoClipboard(item.cover)} title="复制URL"><Icon type="link" /></Tooltip>,
                  <Tooltip onClick={() => this.handleDelete(item.cover)} title="删除"><Icon type="delete" /></Tooltip>,
                  // <Dropdown overlay={itemMenu}><Icon type="ellipsis" /></Dropdown>,
                ]}
              />
            </List.Item>
          )}
        />
        <Modal
          title="编辑媒体"
          visible={modalVisible}
          onOk={() => this.handleAdd()}
          onCancel={() => this.handleModalVisible()}
        >
          <Form onSubmit={this.handleAdd}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="文件名"
            >
              {
                getFieldDecorator('fileName', {
                initialValue: 'avatar.png',
                })(<Input disabled={this.state.disabled} />)
            }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="描述"
            >
              {
                getFieldDecorator('competitor', {
                  initialValue: '',
                  rules: [{
                    required: true,
                    message: '请填入网络图片地址URLxxxx',
                  }],
                })(<TextArea style={{ minHeight: 32 }} rows={2} />)
              }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="URL"
            >
              {
                getFieldDecorator('customerName', {
                initialValue: 'https://cxcat.files.wordpress.com/2017/12/e6bc94e7a4bae69687e7a8bf.png',
                })(<Input addonAfter={<Tooltip placement="rightTop" title="复制到剪贴板"> <Icon type="link" style={{ cursor: 'pointer' }} onClick={() => this.handleCopyURLtoClipboard('https://cxcat.files.wordpress.com/2017/12/e6bc94e7a4bae69687e7a8bf.png')} /> </Tooltip>} />)
            }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="文件类型"
            >
              {
               getFieldDecorator('date-time-picker', {
              initialValue: 'PNG',
            })(
              <Input disabled={this.state.disabled} />
          )}
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="上传日期"
            >
              {
               getFieldDecorator('date-time-picker', {
              initialValue: moment('2017-12-29 01:30:32', 'YYYY-MM-DD HH:mm:ss'),
            })(
              <DatePicker disabled={this.state.disabled} style={{ width: '100%' }} showTime format="YYYY-MM-DD HH:mm:ss" />
          )}
            </FormItem>
          </Form>
        </Modal>
        <Modal
          title="通过URL添加网络图片"
          visible={modalVisibleForUrlUpload}
          onOk={() => this.handleUrlUpload()}
          onCancel={() => this.handleModalVisibleForUrlUpload()}
        >
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="URL地址"
          >
            {
                getFieldDecorator('fileNameXXURL', {
                  rules: [{
                    required: true,
                    message: '请填入网络图片地址URL',
                  }],
                })(<Input onChange={this.handleAddInputForUrlUpload} />)
            }
          </FormItem>
        </Modal>
      </div>
    );
  }
}
