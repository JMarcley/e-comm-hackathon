import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'semantic-ui-react';
import ProductImage from './ProductImage';

export default class ProductItem extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    media: PropTypes.string.isRequired,
    addItemToCart: PropTypes.func.isRequired
  }

  state = {
    item: {}
  }

  // componentDidMount() {
  //
  // }

  handleAddItemToCart() {
    this.props.addItemToCart(this.props.item);
  }

  render() {
    const { item, media } = this.props;

    return (
      <Card>
        <ProductImage item={item} media={media} />
        <Card.Content>
          <Card.Header>{item.name}</Card.Header>
          <Card.Description>
            {item.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          {item.inStock
            ?
            <Button basic color='green' onClick={this.handleAddItemToCart.bind(this)}>
              Add to Cart
            </Button>
            :
            <Button disabled basic>
              Item out of stock
            </Button>
          }
          <span style={{ paddingLeft: '21px' }}>${item.price}</span>
        </Card.Content>
      </Card>

    )
  }
}
