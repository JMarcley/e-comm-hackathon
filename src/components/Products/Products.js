import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import request from 'axios';
import { config } from '../../config';
import ProductItem from './ProductItem';
import './Products.css';

export default class Products extends Component {
  static propTypes = {
    media: PropTypes.string,
    addItemToCart: PropTypes.func.isRequired
  }

  static defaultProps = {
    media: "mobile/tablet"
  }

  state = {
    products: []
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.media !== this.props.media) {
  //     this.setState({ media: nextProps.media });
  //   }
  // }

  componentDidMount() {
    request({
      method: 'GET',
      url: config.baseURL + 'inventory/getInventory'
    }).then(response => {
      this.setState({
        products: response.data.items
      });
    });
  }

  render() {
    const { media, addItemToCart } = this.props;
    const { products } = this.state;

    return (
      <div className="product-list">
        <Card.Group itemsPerRow={media === "computer" ? 3 : 1}>

          {products.map(product =>
            <ProductItem key={product.itemId} item={product} media={media} addItemToCart={addItemToCart} />
          )}
        </Card.Group>
      </div>
    )
  }
}
