import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-routes';

import Split from './Split';

function addSplitComponentsForPaths(routes, splitComponentForPath) {
  if (routes) {
    return routes.map(route => {
      if (route.componentPath !== void 0) {
        route = {
          ...route,
          component: splitComponentForPath(route.componentPath)
        }
      }
      if (route.routes !== void 0) {
        route = {
          ...route,
          routes: addSplitComponentsForPaths(route.routes, splitComponentForPath)
        };
      }
      return route;
    })
  }
}

export default class SplitRoutes extends Component {

  static propTypes = {
    routes: PropTypes.array,
    routeOptions: PropTypes.object,
    loadSplitComponentForPath: PropTypes.func,
    splitErrorCallback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.routes = addSplitComponentsForPaths(props.routes, this.splitComponentForPath);
  }

  splitComponentForPath = (splitComponentPath) => {
    const { loadSplitComponentForPath, splitErrorCallback } = this.props;
    const splitProps = {
      splitComponentPath,
      loadSplitComponentForPath,
      splitErrorCallback
    }
    return props => (
      <Split {...props} {...splitProps} />
    );
  }

  render() {
    const { routeOptions = {}, routes, loadSplitComponentForPath, splitErrorCallback, ...otherProps } = this.props;
    const optionExtraProps = routeOptions.extraProps ? {...routeOptions.extraProps} : {};
    const extraProps = {...otherProps, ...optionExtraProps};
    return renderRoutes(this.routes, {...routeOptions, extraProps});
  }
}