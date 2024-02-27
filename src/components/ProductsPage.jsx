import { Col, Row, Button, Spinner } from "react-bootstrap";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";
import ProductCard from "./ProductCard";

const ProductsPage = ({ loading, products, handlePrevPage, handleNextPage, currentPage, isLastPage}) => {
  
  return (
    <>
      <Row className="mt-3 mb-3">
        <Col lg={12} >
          <div className="d-flex justify-content-center justify-content-sm-end gap-4">
            <Button
              className="shadow"
              variant="danger"
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading || Array.isArray(products) && products.length === 0}
            >
              <ArrowLeft className="me-2" />
              Назад
            </Button>
            <Button
              className="shadow"
              variant="danger"
              type="button"
              onClick={handleNextPage}
              disabled={isLastPage || loading || products.length === 0}
            >
              Вперед
              <ArrowRight className="ms-2" />
            </Button>
          </div>
        </Col>
      </Row>
      
      {loading && <Row className="mb-3">
        <Col lg={12} className="d-flex justify-content-center">
          <Spinner variant="danger" animation="border" />
        </Col>
      </Row>}
      <Row className="gy-4 mb-5">
        { products.map(({ brand, id, price, product }, index) =>
          <ProductCard
            key={index}
            brand={brand}
            id={id}
            price={price}
            product={product}
            loading={loading}
          />)}
      </Row>
      
      {Array.isArray(products) && products.length > 0 && <Row className="mt-3 mb-3">
        <Col lg={12}>
          <div className="d-flex justify-content-end gap-4">
            <Button
              className="shadow"
              variant="danger"
              type="button"
              onClick={handlePrevPage}
              disabled={currentPage === 1 || loading || Array.isArray(products) && products.length === 0}
            >
              <ArrowLeft className="me-2" />
              Назад
            </Button>
            <Button
              className="shadow"
              variant="danger"
              type="button"
              onClick={handleNextPage}
              disabled={isLastPage || loading || products.length === 0}
            >
              Вперед
              <ArrowRight className="ms-2" />
            </Button>
          </div>
        </Col>
      </Row>}
    </>
  );
};

export default ProductsPage;
