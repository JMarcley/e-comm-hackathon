import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Loader, Dimmer } from 'semantic-ui-react';
// import request from 'axios';
import './Checkout.css';
import { config } from '../../config';

import CartIcon from './CartIcon';
import CheckoutItemList from './CheckoutItemList';
import OrderDetails from './OrderDetails';

export default class Checkout extends Component {
  static propTypes = {
    media: PropTypes.string,
    cart: PropTypes.array.isRequired,
    updateCart: PropTypes.func.isRequired
  }

  static defaultProps = {
    media: "mobile/tablet"
  }

  state = {
    orderDetails: {},
    isCheckingOut: false,
    itemsConfirmed: false,
    isSubmitting: false,
    orderResponse: {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cart.length !== this.props.cart.length) {
    }
  }

  toggleCheckout() {
    this.setState({ isCheckingOut: !this.state.isCheckingOut });
    this.setState({ itemsConfirmed: !this.state.isCheckingOut ? false : this.state.itemsConfirmed });
    this.setState({ orderResponse: {} });
  }

  toggleItemsConfirmed() {
    this.setState({ itemsConfirmed: !this.itemsConfirmed });
  }

  updateOrderDetails(orderDetails) {
    this.setState({
      orderDetails: {
        merchantId: config.merchantId,
        orderItems: this.props.cart,
        promotion: {
          ...orderDetails.promoApplied,
          orderSubtotal: orderDetails.orderTotals.subtotal
        },
        taxTotal: orderDetails.orderTotals.tax,
        shippingTotal: orderDetails.orderTotals.shipping,
        merchantOrderReference: "generate ref",
        orderDate: Math.floor(Date.now() / 1000),
        signature: "user or guest token"
      }
    });
  }

  mockOrderResponse(bool, orderDetails) {
    const orderSuccessResponse = {
      "transactionId": "Some Reference-TID435",
      "submittedOrder": orderDetails,
      "status": "Success",
      "message": "Successfully recieved Some Reference, dated 10/15/2018 2:29:59 PM, valued at $17.97 (1797)"
    }
    const orderFailResponse = {
      "submittedOrder": orderDetails,
      "status": "Fail",
      "message": "The order failed. Please try again."
    }
    //sucess
    if (bool) {
      return orderSuccessResponse
    } else {
      return orderFailResponse
    }
  }

  submitOrder() {
    this.setState({ isSubmitting: true });

    // Mock POST
    setTimeout(() => {
      const response = this.mockOrderResponse(Math.random() > 0.25, this.state.orderDetails);

      if (response.status === "Success") {
        this.setState({ orderResponse : response });
        this.props.updateCart([]);
        this.setState({ isSubmitting: false });
      } else {
        this.setState({ orderResponse : response });
        this.setState({ isSubmitting: false });
      }
    }, 1000);

    // Real POST
    // request({
    //   method: 'POST',
    //   url: config.baseURL + 'order',
    //   data: JSON.stringify(this.state.orderDetails)
    // }).then(response => {
    //   console.log(response);
    // }).catch(err => {
    //   console.log(err);
    // });
  }

  render() {
    const { cart, media, updateCart } = this.props;
    const { isCheckingOut, itemsConfirmed, orderResponse, isSubmitting } = this.state;

    return (
      <div>
        <CartIcon
          checkout={this.toggleCheckout.bind(this)}
          number={cart.length > 0 ? cart.reduce((acc, cv) => acc + cv.qtyOrdered, 0) : 0}
          media={media} />
        <Modal centered dimmer open={isCheckingOut} closeOnDimmerClick={false} size="fullscreen">
          <Modal.Header>{!itemsConfirmed ? "Confirm Items to Purchase" : "Order Options" }</Modal.Header>
          <Modal.Content>
            {!itemsConfirmed && !isSubmitting && !orderResponse.message &&
              <CheckoutItemList cart={cart} updateCart={updateCart} />}
            {itemsConfirmed && !isSubmitting && !orderResponse.message &&
              <OrderDetails cart={cart} updateOrderDetails={this.updateOrderDetails.bind(this)}/>}
            {isSubmitting && <Dimmer active><Loader /></Dimmer>}
            {orderResponse.message && <div>
              <p>{orderResponse.status}</p>
              <p>{orderResponse.message}</p>
              </div>}
          </Modal.Content>
          <Modal.Actions>
            <Button basic onClick={this.toggleCheckout.bind(this)}>
              {orderResponse.message ? "Ok" : "Cancel"}
            </Button>
            {!itemsConfirmed && !orderResponse.message &&
              <Button color="blue" onClick={this.toggleItemsConfirmed.bind(this)}>
                Continue
              </Button>}
            {itemsConfirmed && !orderResponse.message &&
              <Button color="blue" onClick={this.submitOrder.bind(this)}>
                Submit Order
              </Button>}
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}
