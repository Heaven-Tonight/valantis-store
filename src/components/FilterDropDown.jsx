import {Button, Dropdown, Form} from "react-bootstrap";
import useCustomFormik from "../hooks/useCustomFormik";
import {useState} from "react";

const FilterDropDown = ({ filterName, filters, setFilters, setCurrentPage, setProductIdsSlice, setFilteredProductIdsSlice }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const initialProductsIdsSlice = { offset: 0, limit: 50};
  const initialFilteredProductsIdsSlice = { start: 0, end: 50};
  
  const formik = useCustomFormik({
    initialValues: { [filterName]: '' },
    onSubmit: (values) => {
      const data = {
        [filterName]: filterName === 'price' ? Number(values[filterName]) : values[filterName],
      }
      setProductIdsSlice(initialProductsIdsSlice);
      setFilteredProductIdsSlice(initialFilteredProductsIdsSlice);
      setFilters(data);
      setShowDropdown(false);
      setCurrentPage(1);
    },
  });
  
  return (
    <Dropdown show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
      <Dropdown.Toggle
        variant={filters[filterName] ? "dark" : "outline-dark"}
        id="dropdown-basic"
      >
        {filterName}
      </Dropdown.Toggle>
      
      <Dropdown.Menu>
        <Form onSubmit={formik.handleSubmit}>
          <div className="d-flex flex-column">
            <Form.Control
              required={true}
              autoFocus
              name={`${filterName}`}
              className="mx-3 my-2 w-auto"
              placeholder={`Type the ${filterName}`}
              value={formik.values[filterName]}
              onChange={formik.handleChange}
            />
            <div className="text-end py-2 px-2">
              <Button
                type="submit"
                variant="danger"
              >
                Применить
              </Button>
            </div>
          </div>
        </Form>
      </Dropdown.Menu>
    </Dropdown>
  )
};

export default FilterDropDown;