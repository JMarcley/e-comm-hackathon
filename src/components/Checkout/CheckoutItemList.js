import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import './Checkout.css';

import ProductImage from '../Products/ProductImage';

export default class CheckoutItemList extends Component {
  static propTypes = {
    cart: PropTypes.array.isRequired,
    updateCart: PropTypes.func.isRequired
  }

  // static defaultProps = {
  //   cart: []
  // }
  //
  // state = {
  //   cart: []
  // }

  componentDidMount() {
    // this.setState({
    //   cart:
    //     this.props.cart.map((obj, i, arr) => {
    //       const ct = arr.filter(o => o.itemId === obj.itemId).length;
    //       const isDupe = arr.map(o => o.itemId).indexOf(obj.itemId) < i;
    //       return {...obj, qtyOrdered: !isDupe ? ct : 0}
    //      })
    //     .filter(item => item.qtyOrdered > 0)
    //   });
  }

  handleAddSubtractItems(op, item) {
    const newCart =
      this.props.cart
        .map(obj => obj.itemId === item.itemId ? { qtyOrdered: op === "add" ? obj.qtyOrdered++ : obj.qtyOrdered--, ...obj } : obj )
        .filter(item => item.qtyOrdered > 0);
    this.props.updateCart( newCart )
  }



  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.cart.length !== this.props.cart.length) {
  //   }
  // }

  // toggleCheckout() {
  //   this.setState({ isCheckingOut: !this.state.isCheckingOut });
  // }

  render() {
    const { cart } = this.props;

    return (
      <div>
        {cart.length === 0 && <h3>There are no items in your cart</h3>}
        {cart.map(item =>
          <div key={item.itemId + 1} className="checkout-item">
            <div className="checkout-item-details">
              <ProductImage item={item} />
              <p>{item.name}</p>
            </div>
            <div className="checkout-item-qty">
              <Button className="qty-btn" icon basic onClick={() => this.handleAddSubtractItems("add", item)}>
                <Icon name="plus" />
              </Button>
              <p className="item-qty"><span className="item-qty-num">{item.qtyOrdered}</span></p>
              <Button className="qty-btn" icon basic onClick={() => this.handleAddSubtractItems("subtract", item)}>
                <Icon name="minus" />
              </Button>
            </div>
            <div className="checkout-item-price">
              {`Price $${item.qtyOrdered * item.price}`}
            </div>
            <div className="divider"></div>
          </div>
        )}
        {cart.length !== 0 && <p className="checkout-total">Total ${cart.reduce((acc, cv) => acc + cv.qtyOrdered * cv.price, 0)}</p>}
      </div>
    )
  }
}
