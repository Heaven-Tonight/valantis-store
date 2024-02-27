import { Col, Row, Spinner } from "react-bootstrap";
import ProductCard from "./ProductCard";
import NavigateButtons from "./NavigateButtons";

const ProductsPage = ({ loading, products, handlePrevPage, handleNextPage, currentPage, isLastPage, isProductFountByFilter }) => {
  
  return (
    <>
      <Row className="mt-3 mb-3">
       <NavigateButtons
         handlePrevPage={handlePrevPage}
         currentPage={currentPage}
         loading={loading}
         isProductFountByFilter={isProductFountByFilter}
         isLastPage={isLastPage}
         handleNextPage={handleNextPage}
       />
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
        <NavigateButtons
          handlePrevPage={handlePrevPage}
          currentPage={currentPage}
          loading={loading}
          isProductFountByFilter={isProductFountByFilter}
          isLastPage={isLastPage}
          handleNextPage={handleNextPage}
        />
      </Row>}
    </>
  );
};

export default ProductsPage;
