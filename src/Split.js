import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Split extends PureComponent {

  static propTypes = {
    SplitLoadingComponent: PropTypes.func.isRequired,
    SplitErrorComponent: PropTypes.func.isRequired,
    loadSplitComponentForPath: PropTypes.func.isRequired,
    splitComponentPath: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    const { SplitLoadingComponent } = props;
    this.state = {
      SplitComponent: SplitLoadingComponent,
      splitError: null,
      splitErrorInfo: null
    };
  }

  componentWillMount() {
    const { loadSplitComponentForPath, splitComponentPath } = this.props;

    const that = this;

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
    const { loadSplitComponentForPath, splitComponentPath, ...otherProps } = this.props;
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
