import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-routes';

export default class Routes extends Component {

  static propTypes = {
    routes: PropTypes.object,
    routeOptions: PropTypes.object
  };

  render() {
    const { routes, routeOptions } = this.props;

    return renderRoutes(routes, routeOptions);
  }
}
