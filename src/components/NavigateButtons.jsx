import {Button, Col} from "react-bootstrap";
import {ArrowLeft, ArrowRight} from "react-bootstrap-icons";

const NavigateButtons = ({ handlePrevPage, currentPage, loading, isProductFountByFilter, isLastPage, handleNextPage}) => {
  return (
    <Col lg={12} >
      <div className="d-flex justify-content-center justify-content-sm-end gap-4">
        <Button
          className="shadow"
          variant="danger"
          type="button"
          onClick={handlePrevPage}
          disabled={currentPage === 1 || loading || !isProductFountByFilter}
        >
          <ArrowLeft className="me-2" />
          Назад
        </Button>
        <Button
          className="shadow"
          variant="danger"
          type="button"
          onClick={handleNextPage}
          disabled={isLastPage || loading || !isProductFountByFilter }
        >
          Вперед
          <ArrowRight className="ms-2" />
        </Button>
      </div>
    </Col>
  );
}

export default NavigateButtons;
