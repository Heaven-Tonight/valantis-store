import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductsPage from "./components/ProductsPage";
import Nav from './components/Nav';
import { Container, Col, Row, Button } from "react-bootstrap";
import {useState, useEffect, useCallback } from "react";
import ProductSearchFrom from "./components/ProductSearchFrom";
import FilterDropDown from "./components/FilterDropDown";
import { fetchByAction } from "./api";

function App() {
  const [productsIdss, setProductsIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [filterNames, setFilterNames] = useState([]); //'product', 'price', 'brand'
  const [currentPage, setCurrentPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [isProductFountByFilter, setIsProductFoundByFilter] = useState(true);
  
  const fetchProducts = useCallback(async () => {
    setIsLastPage(false);
    setIsProductFoundByFilter(true);
    setLoading(true);
    
    if (Object.keys(filters).length > 0) {
      const limit = 50;
      try {
        const productIds = await fetchByAction('filter', { ...filters }) || [];
        
        if (productIds.length === 0) {
          setIsProductFoundByFilter(false);
          setProducts([]);
          return;
        }
        
        if (Math.ceil(productIds.length / 50) === currentPage) {
          setIsLastPage(true);
        }
        
        const totalPages = Math.ceil(productIds.length / limit);
        const pageIndex = currentPage - 1;
        
        if (pageIndex < totalPages) {
          const pageIds = productIds.slice(pageIndex * limit, (pageIndex + 1) * limit);
          const products = await fetchByAction('get_items', { ids: pageIds });
          setProducts(products);
          setIsLastPage(pageIndex + 1 === totalPages);
        } else {
          setIsLastPage(true);
        }
      } catch (error) {
        if (error.response?.data) {
          console.log('Идентификатор ошибки: ', error.response?.data)
          fetchProducts();
        }
        console.log('FETCH PRODUCTS ERROR', error);
      } finally {
        setLoading(false);
      }
    }
    else {
      let uniqueProducts = [];
      let attempts = 0;
      const maxAttempts = 2;
      const offset = (currentPage - 1) * 50 + attempts * 50;
      const params = { offset, limit: 50 };
      
      while (uniqueProducts.length < 50 && attempts < maxAttempts) {
        try {
          const productsIds = await fetchByAction('get_ids', params);
          if ((productsIds && productsIds.length < 50) || (Math.ceil(Array.isArray(productsIdss) && productsIdss.length / 50) === currentPage)) {
            setIsLastPage(true);
          }
          
          const filteredIds = [...new Set(productsIds)];
          
          if (filteredIds.length > 0) {
            
            const res = await fetchByAction('get_items', { ids: filteredIds });
            uniqueProducts = [...new Set([...uniqueProducts, ...(res || [])])];
          }
          
        } catch (error) {
          if (error?.response?.data) {
            console.log('Идентификатор ошибки: ', error.response?.data)
            fetchProducts();
          }
          console.log('FETCH PRODUCTS ERROR', error);
          break;
        } finally {
          setLoading(false);
        }
        attempts++;
      }
      setProducts(uniqueProducts.slice(0, 50));
    }
  }, [currentPage, filters]);
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, filters, fetchProducts]);
  
  useEffect(() => {
    const fetchFields = async() => {
      try {
        const result = await fetchByAction('get_fields');
        setFilterNames(result);
      } catch (error) {
        if (error?.response?.data) {
          console.log('Идентификатор ошибки: ', error.response?.data)
          fetchFields();
        }
        console.error("FETCHING FIELDS ERROR:", error.message);
      }
      
    }
    fetchFields();
    
    const fetchProductsIds = async() => {
      try {
        const result = await fetchByAction('get_ids');
        setProductsIds([...new Set(result)]);
      } catch (error) {
        if (error?.response?.data) {
          console.log('Идентификатор ошибки: ', error.response?.data)
          fetchProductsIds();
        }
        console.error("FETCHING IDS ERROR:", error.message);
        // throw error;
      }
    };
    fetchProductsIds();
  }, []);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };
  
  return (
    <Container fluid>
      <Nav />
      {Array.isArray(filterNames) && filterNames.includes('product') && <Row className="mt-5 mb-3 d-flex justify-content-center">
        <Col lg={7}>
          <ProductSearchFrom setFilters={setFilters} setCurrentPage={setCurrentPage}/>
        </Col>
      </Row>}
      
      <Row className="mb-3 mt-3">
        <Col className="d-flex gap-3">
          {Array.isArray(filterNames) && filterNames
            .filter(item => !item.toLowerCase().includes('product'))
            .map((filterName, index) => (
              <FilterDropDown
                key={index}
                filterName={filterName}
                filters={filters}
                setFilters={setFilters}
                setCurrentPage={setCurrentPage}
              />
            ))
          }
          {Object.keys(filters).some((filter) => filter) ? (
            <Button
              className="text-decoration-underline fw-semibold border-0"
              variant="nofill-body"
              onClick={() => {
                setFilters({});
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
      <ProductsPage
        loading={loading}
        isLastPage={isLastPage}
        currentPage={currentPage}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        products={products}
        setProducts={setProducts}
      />
    </Container>
  );
}

export default App;
