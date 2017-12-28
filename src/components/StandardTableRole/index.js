import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Divider, Popconfirm } from 'antd';
import UpdateModal from './modal';
import styles from './index.less';

class StandardTableRole extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  // 接收删除单个数据
  deleteHandler = (id) => {
    const { handleRemove } = this.props;
    handleRemove(id);
  }
  // 接收修改单个数据
  editHandler = (id, values) => {
    const { handleUpdate } = this.props;
    handleUpdate(id, values);
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建日期',
        dataIndex: 'createdAt',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <div>
            <UpdateModal record={record} onOk={this.editHandler.bind(null, record._id)}>
              <a>修改</a>
            </UpdateModal>
            <Divider type="vertical" />
            <Popconfirm title="确定要删除吗?" onConfirm={() => this.deleteHandler(record._id)}>
              <a href="">删除</a>
            </Popconfirm>
          </div>
        ),
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={loading}
          rowKey={record => record.key}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTableRole;
