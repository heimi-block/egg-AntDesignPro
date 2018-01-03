import React, { Component } from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { connect } from 'dva';
import { Input } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getRoutes } from '../../utils/utils';

@connect()
export default class SearchList extends Component {
  state = {
    currentKey: 'all',
  };

  handleFormSubmitSearch = (e) => {
    const { dispatch } = this.props;
    const key = this.state.currentKey;
    if (key === 'all') {
      dispatch({
        type: 'attachments/fetch',
        payload: {
          currentPage: 1,
          search: e,
        },
      });
    } else {
      dispatch({
        type: 'attachments/fetch',
        payload: {
          currentPage: 1,
          search: e,
          kind: key,
        },
      });
    }
  }

  handleTabChange = (key) => {
    const { dispatch, match } = this.props;
    this.setState({
      currentKey: key,
    });
    window.localStorage.setItem('currentKey', key);
    switch (key) {
      case 'all':
        // dispatch(routerRedux.push(`${match.url}/articles`));
        dispatch({
          type: 'attachments/fetch',
          payload: {
            currentPage: 1,
          },
        });
        break;
      case 'image':
        dispatch({
          type: 'attachments/fetch',
          payload: {
            currentPage: 1,
            kind: 'image',
          },
        });
        break;
      case 'document':
        dispatch({
          type: 'attachments/fetch',
          payload: {
            currentPage: 1,
            kind: 'document',
          },
        });
        break;
      case 'video':
        dispatch({
          type: 'attachments/fetch',
          payload: {
            currentPage: 1,
            kind: 'video',
          },
        });
        break;
      case 'audio':
        dispatch({
          type: 'attachments/fetch',
          payload: {
            currentPage: 1,
            kind: 'audio',
          },
        });
        break;
      default:
        break;
    }
  }

  render() {
    const tabList = [{
      key: 'all',
      tab: '全部',
    }, {
      key: 'image',
      tab: '图像',
    }, {
      key: 'document',
      tab: '文档',
    }, {
      key: 'video',
      tab: '视频',
    }, {
      key: 'audio',
      tab: '音频',
    }];

    const mainSearch = (
      <div style={{ textAlign: 'center' }}>
        <Input.Search
          placeholder="请输入"
          enterButton="搜索"
          size="large"
          onSearch={this.handleFormSubmitSearch}
          style={{ width: 522 }}
        />
      </div>
    );

    const { match, routerData, location } = this.props;
    const routes = getRoutes(match.path, routerData);

    return (
      <PageHeaderLayout
        title="搜索列表"
        content={mainSearch}
        tabList={tabList}
        activeTabKey={this.state.currentKey}
        onTabChange={this.handleTabChange}
      >
        <Switch>
          {
            routes.map(item =>
              (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              )
            )
          }
        </Switch>
      </PageHeaderLayout>
    );
  }
}
