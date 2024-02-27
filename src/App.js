import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsPage from "./components/ProductsPage";
import Nav from './components/Nav';
import { Container, Col, Row, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import ProductSearchFrom from "./components/ProductSearchFrom";
import FilterDropDown from "./components/FilterDropDown";
import { fetchByAction } from "./api";

const filterProductsById = (products) => {
  const uniqueProducts = [];
  const uniqueIds = {};
  
  products.forEach((product) => {
    if (!uniqueIds[product.id]) {
      uniqueProducts.push(product);
      uniqueIds[product.id] = true;
    }
  });
  return uniqueProducts;
};

function App() {
  const itemsPerPage = 50;
  const totalElements = 8000;
  const lastPageNumber = Math.ceil(totalElements / itemsPerPage);
  
  const initialProductsIdsSlice = { offset: 0, limit: 100};
  const initialFilteredProductsIdsSlice = { start: 0, end: 50};
  
  const [products, setProducts] = useState([]);
  
  const [productsIdsSlice, setProductIdsSlice] = useState(initialProductsIdsSlice);
  const [filteredProductsIdsSlice, setFilteredProductIdsSlice] = useState(initialFilteredProductsIdsSlice);
  
  const [filters, setFilters] = useState({});
  const [filterNames, setFilterNames] = useState([]); //'product', 'price', 'brand'
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  
  
  const [loading, setLoading] = useState(false);
  const [isProductFountByFilter, setIsProductFoundByFilter] = useState(true);
  
  useEffect(() => {
    const fetchProductsByFilter = async (filteredProductsIdsSlice) => {
      setLoading(true);
      setIsLastPage(false);
      setIsProductFoundByFilter(true);
    
      const makeFilteredRequest = async () => {
        if (Object.keys(filters).length > 0) {
          const { start, end } = filteredProductsIdsSlice;
          let catchError;
          try {
            const result = await fetchByAction('filter', { ...filters }) || [];
            if (result.length === 0) {
              setIsProductFoundByFilter(false);
              setLoading(false);
              return;
            }
            const lastPageNumber = result.length;
            const slice = result.slice(start, end);
            if (start < lastPageNumber) {
              const filteredProducts = await fetchByAction('get_items', { ids: slice }) || [];
              if (filteredProducts.length < 50) {
                setIsLastPage(true);
              }
              setProducts(filterProductsById(filteredProducts));
            }
          } catch (error) {
            catchError = error;
            console.log('Идентификатор ошибки: ', error.response?.data);
            console.log('Повторный запрос...');
            await makeFilteredRequest();
          } finally {
            if (!catchError) setLoading(false);
          }
        } else {
          setLoading(false);
        }
      };
    
      await makeFilteredRequest();
    };
    const fetchProducts = async (ids) => {
      const makeRequest = async () => {
        try {
          const productIndexes = await fetchByAction('get_ids', ids) || [];
          const products = await fetchByAction('get_items', { ids: productIndexes });
          const productsFilteredById = filterProductsById(products) || [];
          setProducts(productsFilteredById.slice(0, 50));
          setLoading(false);
        } catch (error) {
          console.log('Идентификатор ошибки: ', error.response?.data);
          console.log('Повторный запрос...');
          await makeRequest();
        }
      };
      
      setIsLastPage(false);
      setIsProductFoundByFilter(true)
      setLoading(true);
      if (ids.offset < totalElements) {
        await makeRequest();
      } else {
        setLoading(false);
      }
    };
    if (Object.keys(filters).length > 0) {
      fetchProductsByFilter(filteredProductsIdsSlice);
    } else {
      fetchProducts(productsIdsSlice);
    }
  }, [filteredProductsIdsSlice, productsIdsSlice, filters])
  
  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const start = (currentPage - 1) * itemsPerPage;
      const end = currentPage * itemsPerPage;
      setFilteredProductIdsSlice({start, end});
    } else {
      const offset = (currentPage - 1) * initialProductsIdsSlice.limit / 2;
      setProductIdsSlice((prev) => ({ ...prev, offset }));
    }
  }, [currentPage]);
  
  useEffect(() => {
    const fetchFields = async() => {
      try {
        const result = await fetchByAction('get_fields') || [];
        setFilterNames(result);
      } catch (error) {
          console.log('Идентификатор ошибки: ', error.response?.data);
          fetchFields();
      }
    }
    fetchFields();
  }, []);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    if (currentPage === lastPageNumber) {
      setIsLastPage(true);
    }
  };
  
  return (
    <Container fluid className={loading ? 'disabled-app' : ''}>
      <Nav />
      {filterNames.includes('product') && <Row className="mt-5 mb-3 d-flex justify-content-center">
        <Col lg={7}>
          <ProductSearchFrom setFilters={setFilters} setCurrentPage={setCurrentPage}/>
        </Col>
      </Row>}
      
      <Row className="mb-3 mt-3">
        <Col className="d-flex gap-3">
          {filterNames
            .filter(item => !item.toLowerCase().includes('product'))
            .map((filterName, index) => (
              <FilterDropDown
                key={index}
                filterName={filterName}
                filters={filters}
                setFilters={setFilters}
                setCurrentPage={setCurrentPage}
                setProductIdsSlice={setProductIdsSlice}
                setFilteredProductIdsSlice={setFilteredProductIdsSlice}
              />
            ))
          }
          {Object.keys(filters).some((filter) => filter) ? (
            <Button
              className="text-decoration-underline fw-semibold border-0"
              variant="nofill-body"
              onClick={() => {
                setFilters({});
                setProductIdsSlice(initialProductsIdsSlice);
                setFilteredProductIdsSlice(initialFilteredProductsIdsSlice);
              }}
            >
              Сбросить фильтры
            </Button>
          ) : null}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          {!isProductFountByFilter && 'По Вашему запросу ничего не найдено...'}
        </Col>
      </Row>
      {isProductFountByFilter && <ProductsPage
        loading={loading}
        isLastPage={isLastPage}
        currentPage={currentPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        products={products}
        setProducts={setProducts}
        isProductFountByFilter={isProductFountByFilter}
      />}
    </Container>
  );
}

export default App;
