import {Button, Form, InputGroup} from "react-bootstrap";
import {Search} from "react-bootstrap-icons";
import useCustomFormik from "../hooks/useCustomFormik";

const ProductSearchFrom = ({ setFilters, setCurrentPage}) => {
  const productNameFormik = useCustomFormik({
    initialValues: { productName: '' },
    onSubmit: async (values) => {
      setFilters({ product: values.productName });
      setCurrentPage(1);
    },
  });
  
  return (
    <Form onSubmit={productNameFormik.handleSubmit}>
      <InputGroup className="mb-3">
        <Form.Control
          required={true}
          aria-label="название продукта..."
          aria-describedby="basic-addon2"
          name="productName"
          placeholder="Введите название продукта"
          value={productNameFormik.values.productName}
          onChange={productNameFormik.handleChange}
        />
        <Button
          type="submit"
          variant="outline-dark"
          id="button-addon2"
        >
          <Search />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default ProductSearchFrom;
