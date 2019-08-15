import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Split extends PureComponent {

  static propTypes = {
    SplitLoadingComponent: PropTypes.func.isRequired,
    SplitErrorComponent: PropTypes.func.isRequired,
    loadSplitComponentForPath: PropTypes.func.isRequired,
    getSplitComponentForPath: PropTypes.func,
    splitComponentPath: PropTypes.string.isRequired,
    splitErrorCallback: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { getSplitComponentForPath, splitComponentPath, SplitLoadingComponent, splitLoadDelay } = props;
    let SplitComponent = SplitLoadingComponent;
    if ((splitLoadDelay === void 0 || splitLoadDelay === 0) && getSplitComponentForPath) {
      const splitComponent = getSplitComponentForPath(splitComponentPath);
      if (splitComponent && splitComponent.default) {
        SplitComponent = splitComponent.default;
      }
      else if (splitComponent) {
        SplitComponent = splitComponent;
      }
    };
    this.state = {
      SplitComponent,
      splitError: null,
      splitErrorInfo: null
    };
  }

  componentDidMount() {
    const { loadSplitComponentForPath, splitComponentPath, SplitLoadingComponent } = this.props;
    const { SplitComponent } = this.state;

    const that = this;

    if (SplitComponent === SplitLoadingComponent) {
      loadSplitComponentForPath(
        splitComponentPath,
        component => {
          if (component && component.default) {
            that.setSplitComponent(component.default);
          }
          else if (component) {
            that.setSplitComponent(component);
          }
          else {
            console.error(`Split error for '${splitComponentPath}' - the loaded component was invalid: `, (typeof component), component);
            that.setSplitError({ message: 'the loaded component type was invalid', type: (typeof component) }, { component });
          }
        },
        loadingError => {
          console.error(`Split error for '${splitComponentPath}' - a loading error occurred: `, loadingError);
          that.setSplitError(loadingError);
        }
      );
    }
  }

  setSplitComponent(SplitComponent) {
    if (!this._unmounted) {
      const { splitLoadDelay } = this.props;
      if (splitLoadDelay !== void 0 && splitLoadDelay > 0) {
        if (splitLoadDelay !== Number.Infinity && splitLoadDelay !== Number.POSITIVE_INFINITY) {
          if (!this._unmounted) {
            setTimeout(() => {
              this.setState({ SplitComponent, splitError: null, splitErrorInfo: null });
            }, splitLoadDelay);
          }
        }
      }
      else {
        this.setState({ SplitComponent, splitError: null, splitErrorInfo: null });
      }
    }
  }

  setSplitError(splitError, splitErrorInfo = null) {
    const { splitErrorCallback } = this.props;
    if (splitErrorCallback) {
      splitErrorCallback(splitError, splitErrorInfo);
    }
    if (!this._unmounted) {
      const { SplitErrorComponent } = this.props;
      this.setState({ SplitComponent: SplitErrorComponent, splitError, splitErrorInfo });
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
  }


  componentDidCatch(error, info) {
    const { splitComponentPath } = this.props;
    console.error(`Split error for '${splitComponentPath}' - an error was caught: `, error, info);
    this.setSplitError(error, info);
  }

  render() {
    const { loadSplitComponentForPath, splitComponentPath, splitErrorCallback, ...otherProps } = this.props;
    const { SplitComponent, splitError, splitErrorInfo } = this.state;
    // Leave the SplitLoadingComponent and SplitErrorComponent props for children to use
    let childProps = {
      ...otherProps
    };
    if (splitError !== null || splitErrorInfo !== null) {
      childProps.splitError = splitError;
      childProps.splitErrorInfo = splitErrorInfo;
    }
    return (
      <SplitComponent {...childProps}/>
    );
  }
}
