import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Input, List } from 'semantic-ui-react';
import request from 'axios';
import './Checkout.css';
import { config } from '../../config';

export default class OrderDetails extends Component {
  static propTypes = {
    updateOrderDetails: PropTypes.func.isRequired
  }

  // static defaultProps = {
  //   cart: []
  // }
  //
  state = {
    shippingOptions: [],
    shipKey: 0,
    promoLoading: false,
    promoApplied: {},
    promoField: "",
    orderTotals: {
      subtotal: 0,
      promo: 0,
      shipping: 0,
      tax: 0
    }
  }

  componentDidMount() {
    request({
      method: 'GET',
      url: config.baseURL + 'shipping'
    }).then(response => {
      this.setState({
        promoLoading: false,
        promoApplied: {},
        promoField: "",
        orderTotals: {
          subtotal: this.props.cart.reduce((acc, cv) => cv.qtyOrdered * cv.price + acc, 0),
          promo: 0,
          shipping: response.data.sort((a, b) => b.shipCost - a.shipCost)[this.state.shipKey].shipCost,
          tax: 0.1 * this.props.cart.reduce((acc, cv) => cv.qtyOrdered * cv.price + acc, 0)
        },
        shippingOptions: response.data.sort((a, b) => b.shipCost - a.shipCost)
      });
      this.props.updateOrderDetails({
        promoApplied: {},
        orderTotals: {
          subtotal: this.props.cart.reduce((acc, cv) => cv.qtyOrdered * cv.price + acc, 0),
          promo: 0,
          shipping: response.data.sort((a, b) => b.shipCost - a.shipCost)[this.state.shipKey].shipCost,
          tax: 0.1 * this.props.cart.reduce((acc, cv) => cv.qtyOrdered * cv.price + acc, 0)
        }
      });
    });
  }

  selectShippingOption(key) {
    this.setState({
      shipKey: key,
      orderTotals: {
        ...this.state.orderTotals,
        shipping: this.state.shippingOptions[key].shipCost
      }
    });
    this.props.updateOrderDetails({
      ...this.state,
      shipKey: key,
      orderTotals: {
        ...this.state.orderTotals,
        shipping: this.state.shippingOptions[key].shipCost
      }
    })
  }

  handlePromoChange(e, target) {
    e.preventDefault()
    this.setState({ promoField: target.value });
  }

  handleSubmitPromo() {
    this.setState({ promoLoading: true });
    request({
      method: 'GET',
      url: config.baseURL + 'promo/' + this.state.promoField
    }).then(response => {
      //validate Promo
      const promoApplied = this.validatePromo(response.data, this.props.cart);
      this.setState({
        promoApplied: promoApplied,
        orderTotals: {
          ...this.state.orderTotals,
          promo: this.promoAmount(promoApplied, this.state.orderTotals.subtotal),
          tax: 0.1 * ( this.state.orderTotals.subtotal + this.state.orderTotals.promo )
        }
      });
      this.props.updateOrderDetails({
        promoApplied: promoApplied,
        orderTotals: {
          ...this.state.orderTotals,
          promo: this.promoAmount(promoApplied, this.state.orderTotals.subtotal),
          tax: 0.1 * ( this.state.orderTotals.subtotal + this.state.orderTotals.promo )
        }
      });
      this.setState({ promoLoading: false });
    });
  }

  validatePromo(promo, cart) {
    if (!promo) {
      return { errorMsg: "Invalid Promo Code" }
    }
    if (Object.keys(promo).length === 0) {
      return { errorMsg: "Invalid Promo Code" }
    }
    if (!promo.start || !promo.end) {
      return { errorMsg: "Invalid Promo Code" }
    }

    const now = new Date();
    const start = new Date(promo.start);
    const end = new Date(promo.end);
    const cartValue = cart.reduce((acc, cv) => cv.qtyOrdered * cv.price + acc, 0);

    if (now.getTime() < start.getTime()) {
      return { errorMsg: "Promo Not Active Yet" }
    }
    else if (now.getTime() > end.getTime()) {
      return { errorMsg: "Promo Expired" }
    }
    else if (cartValue < promo.minimumOrderValue) {
      return { errorMsg: "Order Subtotal must be greater than: $" + promo.minimumOrderValue + "." }
    } else {
      return { ...promo, errorMsg: "" }
    }
  }

  promoAmount(promo, subtotal) {
    let amount = 0;
    if (promo.promotionName === "Fixed Value Promo") {
      amount = -promo.promoAmt;
    } else if (promo.promotionName === "Percentage Value Promo") {
      amount = subtotal * ( - promo.promoAmt / 100 );
    } else {
      amount = 0;
    }
    return amount
  }

  render() {
    const { shipKey, shippingOptions, promoLoading, promoApplied, orderTotals } = this.state;

    return (
      <div>
        <div className="flex-parent flex-row">
          <div className="flex-child flex-parent flex-column just-space">
            <h3 className="flex-child">Select Shipping Option</h3>
            <div className="shipping">
              <Button
                icon
                fluid
                color={shipKey === 0 ? "green" : "grey"}
                inverted={shipKey === 0}
                active={shipKey === 0}
                basic={shipKey !== 0}
                onClick={() => this.selectShippingOption(0)}>
                <Icon name="ship" />
                <p>International</p>
              </Button>
              <p></p>
              <Button
                icon
                fluid
                color={shipKey === 1 ? "green" : "grey"}
                inverted={shipKey === 1}
                active={shipKey === 1}
                basic={shipKey !== 1}
                onClick={() => this.selectShippingOption(1)}>
                <Icon name="shipping" />
                <p>Domsetic</p>
              </Button>
            </div>
          </div>
          <div className="flex-child promo">
            <Input loading={promoLoading} placeholder='Enter Promo Code' onChange={this.handlePromoChange.bind(this)}/>
            <Button onClick={this.handleSubmitPromo.bind(this)}>Apply</Button>
            <p className="success-message">
              {promoApplied && promoApplied.promotionName && 'Promo Applied'}
            </p>
            <p className="error-message">
              {promoApplied && promoApplied.errorMsg && `Promo error: ${promoApplied.errorMsg}`}
            </p>
          </div>
          <div className="flex-child order-detail-total" >
            <List divided>
              <List.Item>
                <List.Content floated="right">
                  ${orderTotals.subtotal}
                </List.Content>
                <List.Content>
                  Subtotal
                </List.Content>
              </List.Item>
              {shippingOptions.length > 0 && <List.Item>
                <List.Content floated="right">
                  ${orderTotals.shipping}
                </List.Content>
                <List.Content>
                  Shipping
                </List.Content>
              </List.Item>}
              {orderTotals.promo < 0 && <List.Item>
                <List.Content floated="right">
                  -${-orderTotals.promo.toFixed(2)}
                </List.Content>
                <List.Content>
                  Promo: {promoApplied.promotionName}
                </List.Content>
              </List.Item>}
              <List.Item>
                <List.Content floated="right">
                  ${orderTotals.tax.toFixed(2)}
                </List.Content>
                <List.Content>
                  Tax: 10%
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content floated="right">
                  <strong>
                    ${(orderTotals.subtotal + orderTotals.promo + orderTotals.tax + orderTotals.shipping).toFixed(2)}
                  </strong>
                </List.Content>
                <List.Content>
                  <strong>Total</strong>
                </List.Content>
              </List.Item>
            </List>
          </div>
        </div>
      </div>
    )
  }
}
