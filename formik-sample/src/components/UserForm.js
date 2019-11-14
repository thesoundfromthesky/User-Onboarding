import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function UserForm(props) {
  const { errors, touched, isSubmitting, status } = props;
  const [users, setUsers] = useState([]);
  useEffect(
    _ => {
      status && setUsers(perv => [...perv, status]);
    },
    [status]
  );
  return (
    <>
      <Form>
        <Field type="text" name="name" placeholder="Name" />
        {touched.name && errors.name && <p>{errors.name}</p>}
        <Field type="password" name="password" placeholder="Password" />
        {touched.password && errors.password && <p>{errors.password}</p>}
        <Field type="email" name="email" placeholder="Email" />
        {touched.email && errors.email && <p>{errors.email}</p>}
        <label>
          Terms of Service
          <Field type="checkbox" name="tos" />
          {touched.tos && errors.tos && <p>{errors.tos}</p>}
        </label>
        <button type="submit" disabled={isSubmitting}>
          Submit
        </button>
      </Form>
      {users.map(user => (
        <ol key={user.id}>
          <li>Name: {user.name}</li>
          <li>Email: {user.email}</li>
          <li>createdAt: {user.createdAt.slice(0, 10)}</li>
        </ol>
      ))}
    </>
  );
}

const UserFormWithFormik = withFormik({
  mapPropsToValues({ name, password, email, tos }) {
    return {
      name: name || "",
      password: password || "",
      email: email || "",
      tos: tos || false
    };
  },
  validationSchema: Yup.object().shape({
    name: Yup.string()
      .matches(/[a-zA-Z]+/i, "invalid Name")
      .required("name is required"),
    email: Yup.string()
      .email("invalid Email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be minimum 6 characters")
      .required("Passoword is required"),
    tos: Yup.boolean().oneOf([true], "Must agree Terms of Service")
  }),
  handleSubmit(values, { resetForm, setSubmitting, setStatus }) {
    console.log(values);
    axios
      .post("https://reqres.in/api/users/", values)
      .then(res => {
        console.log(res, "success");
        setStatus(res.data);
        resetForm();
      })
      .catch(err => console.log(err.response))
      .finally(setSubmitting(false));
  }
})(UserForm);

export default UserFormWithFormik;
