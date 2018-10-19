import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'semantic-ui-react';

export default class ProductImage extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    media: PropTypes.string
  }

  static defaultProps = {
    media: "mobile/tablet"
  }

  state = {
    itemHasImage: false,
    imageSrc: null
  }

  componentDidMount() {
    this.setState({
      itemHasImage: this.props.item.image ? true : false,
      imageSrc: this.props.media === "mobile/tablet" ? require("../../no-image-200.png") : require("../../no-image-400.png")
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.media !== this.props.media) {
      this.setState({
        imageSrc: nextProps.media === "mobile/tablet" ? require("../../no-image-200.png") : require("../../no-image-400.png")
      });
    }
  }

  // static defaultProps = {
  //
  // }

  // state = {
  //   item: {}
  // }

  render() {
    const { item } = this.props;
    const { imageSrc, itemHasImage } = this.state;

    return (
      <div>
        {itemHasImage ?
          <Image
            className="product-image"
            src={item.image.src}
            alt={item.image.alt || item.description || item.name || "item has no image"} />
          :
          <Image
            className="product-image"
            src={imageSrc}
            alt={item.description || item.name || "item has no image"} />
        }
      </div>
    )
  }
}
