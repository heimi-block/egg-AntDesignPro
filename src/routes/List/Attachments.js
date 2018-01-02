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
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
const FormItem = Form.Item;
const { TextArea } = Input;

// 上传单个文件配置
const propsUploadForSingle = {
  name: 'file',
  action: 'http://localhost:7001/api/upload',
  headers: {
    authorization: `Bearer ${window.localStorage.getItem('X-TOKEN')}`,
  },
};

// 上传多个文件配置
const propsUploadForMultiple = {
  name: 'file',
  multiple: true,
  action: 'http://localhost:7001/api/uploads',
  headers: {
    authorization: `Bearer ${window.localStorage.getItem('X-TOKEN')}`,
  },
};

// 重新上传文件配置
const propsUploadForReupload = {
  name: 'file',
  // action: '//jsonplaceholder.typicode.com/posts/:id',
  showUploadList: false,
  headers: {
    authorization: `Bearer ${window.localStorage.getItem('X-TOKEN')}`,
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
    currentAttachment: {},
  };


  componentDidMount() {
    this.props.dispatch({
      type: 'attachments/fetch',
      payload: {
        currentPage: 1,
      },
    });
  }

  // 上传单个文件实现
  onChangeUploadForSingle = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // 上传成功后，重新加载数据
      const { dispatch } = this.props;
      // 2秒后重新请求数据
      setTimeout(dispatch({
        type: 'attachments/fetch',
        payload: {
          count: 8,
        },
      }), 2000);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  // 上传多个文件实现
  onChangeUploadForMultiple = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // 上传成功后，重新加载数据
      const { dispatch } = this.props;
      // 2秒后重新请求数据
      setTimeout(dispatch({
        type: 'attachments/fetch',
        payload: {
          count: 8,
        },
      }), 2000);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  // 重新上传文件实现
  onChangeUploadForReupload = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      // 上传成功后，重新加载数据
      const { dispatch } = this.props;
      // 2秒后重新请求数据
      setTimeout(dispatch({
        type: 'attachments/fetch',
        payload: {
          count: 8,
        },
      }), 2000);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
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
    this.props.dispatch({
      type: 'attachments/remove',
      payload: {
        id: e,
      },
    });
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
  // 处理编辑
  handleEdit = (e) => {
    console.log(111, e);
    this.setState({
      currentAttachment: e,
    });
    this.handleModalVisible(true);
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
    this.props.dispatch({
      type: 'attachments/add',
      payload: {
        url: this.state.addInputValueForURL,
      },
    });
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

  handleClick = (e) => {
    console.log('click ', e);
    // this.setState({
    //   current: e.key,
    // })
  }

  fetchMore = () => {
    this.props.dispatch({
      type: 'list/appendFetch',
      payload: {
        count: 10,
      },
    });
  }

  render() {
    const { attachments: { attachments, loading }, form } = this.props;
    const { getFieldDecorator } = form;
    const { modalVisible, modalVisibleForUrlUpload, currentAttachment } = this.state;

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

    const loadMore = attachments.length > 0 ? (
      <div style={{ textAlign: 'center', marginTop: 16, borderTop: '1px solid #e8e8e8' }}>
        {/* <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48, marginTop: 24 }}>
          {loading ? <span><Icon type="loading" /> 加载中...</span> : '加载更多'}
        </Button> */}
        <Tooltip placement="rightTop" title="加载更多"> <Button shape="circle" icon="down" size="sm" style={{ marginTop: 24 }}/> </Tooltip>
      </div>
    ) : null;

    return (
      <div className={styles.filterCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <Row gutter={16}>
              <Col lg={8} md={10} sm={10} xs={24}>
                <FormItem
                  {...formItemLayout}
                >
                  <Upload {...propsUploadForSingle} onChange={this.onChangeUploadForSingle}>
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
                  <Upload {...propsUploadForMultiple} onChange={this.onChangeUploadForMultiple}>
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
          </Form>
        </Card>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          loadMore={loadMore}
          dataSource={attachments}
          renderItem={item => (
            <List.Item key={item._id} style={{ marginBottom: 24, borderBottom: 'none' }}>
              <Card
                hoverable
                cover={<img alt={item.filename} src={`http://localhost:7001/public/${item.url}`} height={154} />}
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <Upload {...propsUploadForReupload} onChange={this.onChangeUploadForReupload} action={`http://localhost:7001/api/upload/${item._id}`}>
                    <Tooltip title="重新上传"><Icon type="reload" /></Tooltip>
                  </Upload>,
                  <Tooltip onClick={() => this.handleEdit(item)} title="编辑"><Icon type="edit" /></Tooltip>,
                  <Tooltip onClick={() => this.handleCopyURLtoClipboard(`http://localhost:7001/public/${item.url}`)} title="复制URL"><Icon type="link" /></Tooltip>,
                  <Tooltip onClick={() => this.handleDelete(item._id)} title="删除"><Icon type="delete" /></Tooltip>,
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
                getFieldDecorator('filename', {
                initialValue: currentAttachment ? currentAttachment.filename : '',
                })(<Input disabled={this.state.disabled} />)
            }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="描述"
            >
              {
                getFieldDecorator('extra', {
                  initialValue: currentAttachment ? currentAttachment.extra : '',
                })(<TextArea style={{ minHeight: 32 }} rows={2} />)
              }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="URL"
            >
              {
                getFieldDecorator('url', {
                initialValue: currentAttachment ? currentAttachment.url : '',
                })(<Input addonAfter={<Tooltip placement="rightTop" title="复制到剪贴板"> <Icon type="link" style={{ cursor: 'pointer' }} onClick={() => this.handleCopyURLtoClipboard(`http://localhost:7001/public/${currentAttachment ? currentAttachment.filename : ''}`)} /> </Tooltip>} />)
            }
            </FormItem>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="文件类型"
            >
              {
               getFieldDecorator('extname', {
              initialValue: currentAttachment ? currentAttachment.extname : '',
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
               getFieldDecorator('createdAt', {
              initialValue: moment(currentAttachment ? currentAttachment.createdAt : '', 'YYYY-MM-DD HH:mm:ss'),
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
