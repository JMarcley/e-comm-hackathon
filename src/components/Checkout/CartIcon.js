import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Statistic } from 'semantic-ui-react';

export default class Checkout extends Component {
  static propTypes = {
    media: PropTypes.string.isRequired,
    checkout: PropTypes.func.isRequired,
    number: PropTypes.number.isRequired
  }

  state = {
    className: "animate-out"
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ className: nextProps.number > 0 ? "animate-in" : "animate-out" });
  }

  handleCheckout(e) {
    e.preventDefault();
    this.props.checkout();
  }

  render() {
    const { number, checkout, media } = this.props;
    const { className } = this.state;

    return (
      <div>
        <a className={"checkout-icon".concat(' ', className)} onClick={checkout}>
          {number > 0 &&
            <Statistic size={media === "mobile/tablet" ? "mini" : "small"}>
              <Statistic.Value>
                <Icon name='shopping cart' />
                {number}
              </Statistic.Value>
              <Statistic.Label>Checkout</Statistic.Label>
            </Statistic>
          }
        </a>
      </div>
    )
  }
}
