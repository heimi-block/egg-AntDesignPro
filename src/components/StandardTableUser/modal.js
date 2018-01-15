import { connect } from 'dva';
import React, { Component } from 'react';
import { Modal, Form, Select, Input } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@connect(state => ({
  user: state.user,
}))

class UpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  showModelHandler = (e) => {
    if (e) e.stopPropagation();
    this.setState({
      visible: true,
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  okHandler = () => {
    const { onOk } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        onOk(values);
        this.hideModelHandler();
      }
    });
  };

  render() {
    const { children } = this.props;

    console.log(this.props);
    // 对象的析构赋值 变量名与属性名不一致，必须写成这样 const { user: {data} } = { data: data }
    const { user: { data } } = this.props; // 处理下拉角色列表
    const roleOptions = [];
    for (const option of data.roleOptions) {
      roleOptions.push(<Option key={option._id}>{option.name}</Option>);
    }

    const { getFieldDecorator } = this.props.form;
    const { mobile, role } = this.props.record;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <span>
        <span onClick={this.showModelHandler}>
          { children }
        </span>
        <Modal
          title="修改用户"
          visible={this.state.visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
        >
          <Form onSubmit={this.okHandler}>
            <FormItem
              {...formItemLayout}
              label="账号"
            >
              {
                getFieldDecorator('mobile', {
                  initialValue: mobile,
                })(<Input />)
              }
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="角色"
            >
              {
                getFieldDecorator('role', {
                  rules: [{
                  required: true, message: '请选择用户角色',
                }],
                initialValue: role ? role.name : '',
                })(<Select style={{ width: '100%' }} placeholder="请选择用户角色">{roleOptions}</Select>)
              }
            </FormItem>
          </Form>
        </Modal>
      </span>
    );
  }
}

export default Form.create()(UpdateModal);
