import { Formik, Field, Form, FormikHelpers } from 'formik';
import styles from './login-form.module.css'
import Image from 'next/image'
import axios from 'axios'
import mypic from '../pictures/logo.png'
import Link from 'next/link';
import { useState } from 'react';
import {Variables} from '../data/globalVariable';
import Cookies from 'js-cookie';

interface Values {
  username: string;
  password: string;
}

  export default function LoginForm() {
    const [loginSuccess, setLoginSuccess] = useState<boolean>(true);

    //this function will handle the login
    //send http request to the backend and get token if login is successful
    const handleSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
      axios.post(Variables.API_URL + '/admin/login', {
        username: values.username,
        password: values.password
      })
      //if the login is successful we get a token
      .then(response => {
        console.log(response.data.token)
        
        //saves the token in a global variable
        var token = response.data.token;
        
        //saves the token in a cookie and sets the expiration date to 10 minutes
        Cookies.set('token', response.data.token, { expires: 1/24/6 });

        //if we get a token we set the loginSuccess state to true
        if (response.data.token) {
          // Passwords match, login successful
          console.log('Login successful!');
          setLoginSuccess(true);
          //redirect to the data page after login is successful
          //and the token is saved in the cookie
          //call the hoc to check if the token is valid
          window.location.href = '/data';
          
        } 
        else {
          // Passwords don't match, login failed
          console.log('Incorrect password');
          //removes from the password box
          values.password = '';
          //make the password box text red for 2 seconds
          setLoginSuccess(false);

          setTimeout(() => {
            setLoginSuccess(true);
          }, 2000);
        }
        setSubmitting(false);
      })
      .catch(error => {
        // Handle error
        console.log(error);
        setSubmitting(false); 

        // Passwords don't match, login failed
        console.log('Incorrect password');
        //removes from the password box
        values.password = '';
        //make the password box text red for 2 seconds
        setLoginSuccess(false);
        
        setTimeout(() => {
          setLoginSuccess(true);
        }, 2000);

      });
    }


  return (
    //this is the login form
    <div className={styles.login_box}>
      <div className="d-flex justify-content-center" align-items-start>
        <Image src={mypic} alt="" width="800" height="250" />
      </div>
      <h1 className="display-6 mb-3">Login</h1>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        //handle summit that is called when the user clicks the login button
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-2">
              <Field className="form-control" id="username" name="username" placeholder="Username" aria-describedby="usernameHelp" />
            </div>
            <div className="mb-4">
              <Field className={`form-control ${loginSuccess ? '' : 'is-invalid'}`} id="password" name="password" placeholder="Password" type="password" />
              {loginSuccess === false && <div className="invalid-feedback">Incorrect password or username</div>}
            </div>
            {/* Put a button for login in the center under the password box*/}
            <div className="d-flex justify-content-center">
              {/*this is the login button, it is disabled when the user is submitting*/}
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};





