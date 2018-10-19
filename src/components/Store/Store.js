import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Products from '../Products/Products';
import Checkout from '../Checkout/Checkout';

export default class Store extends Component {
  static propTypes = {
    media: PropTypes.string
  }

  static defaultProps = {
    media: "mobile/tablet"
  }

  state = {
    cart: JSON.parse(global.localStorage.getItem("cart")) || []
  }

  addItemToCart(item) {
    const newCart =
      this.state.cart.map(obj => obj.itemId).indexOf(item.itemId) > -1 // check if item is in cart
        ?
        this.state.cart.map( obj => obj.itemId === item.itemId ? { ...obj, qtyOrdered: obj.qtyOrdered + 1 } : obj ) // increment qty on item matching itemId
        :
        [...this.state.cart, { ...item, qtyOrdered: 1 }]; // add item to cart
    this.updateCart(newCart);
  }

  updateCart(newCart) {
    this.setState({ cart: newCart });

    //persist cart in storage
    global.localStorage.setItem("cart", JSON.stringify(newCart));
  }

  render() {
    const { media } = this.props;
    const { cart } = this.state;

    return (
      <div className="product-list">
        <Checkout cart={cart} media={media} updateCart={this.updateCart.bind(this)}/>
        <Products media={media} addItemToCart={this.addItemToCart.bind(this)} />
      </div>
    )
  }
}
