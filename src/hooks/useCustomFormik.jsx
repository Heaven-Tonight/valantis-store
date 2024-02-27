import { useFormik } from 'formik';

const useCustomFormik = ({ initialValues, onSubmit }) => {
  return useFormik({
    initialValues,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values);
      resetForm();
    },
  });
};

export default useCustomFormik;