import {Card, Col} from "react-bootstrap";

const ProductCard = ({ brand, id, price, product, loading }) => {
  
  return (
    <Col lg={4} sm={6}>
      <Card className={`shadow bg-body-tertiary h-100 card-hover ${loading ? 'disabled-card' : ''}`}>
        <Card.Header style={{"background": "#e8b7b7"}}>{product}</Card.Header>
        <Card.Body className="mt-auto">
          <div>
            <span><b>Артикул</b>{`: `}</span>
            <span>{id}</span>
          </div>
          <Card.Text><b>Цена</b>: {price} руб.</Card.Text>
          <Card.Text><b>Бренд</b>: {brand}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
};

export default ProductCard;
