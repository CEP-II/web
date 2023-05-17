import { Formik, Field, Form, FormikHelpers, FieldProps } from 'formik';
import styles from './stdColors.module.css'
import Image from 'next/image'
import axios from 'axios'
import mypic from '../pictures/logo.png'
import Link from 'next/link';
import { useState } from 'react';
import {Variables} from '../data/globalVariable';
import Cookies from 'js-cookie';
import Toggle from "react-switch";
import {Switch} from 'antd';

const admin = true;

interface Values {
  username: string;
  password: string;
  isAdmin: boolean;
}

  export default function LoginForm() {
    const [loginSuccess, setLoginSuccess] = useState<boolean>(true);

    
    //this function will handle the login
    //send http request to the backend and get token if login is successful
    const handleSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {

      if(values.isAdmin == true)
      {
        //if the user we send to the admin url to login and if its a normal citezen we send to the citizen url
       
        console.log("admin login");
        
        axios.post(Variables.API_URL + '/admin/login', {
          username: values.username,
          password: values.password
        })
        //if the login is successful we get a token
        .then(response => {       
          //saves the token in a cookie and sets the expiration date to 10 minutes
          Cookies.set('token', response.data.token, { expires: 1/24 });
          

          console.log(Cookies.get('token'));

          //if we get a token we set the loginSuccess state to true
          if (response.data.token) {
            // Passwords match, login successful
            console.log('Login successful!');
            
            setLoginSuccess(true);
            //redirect to the showData page
            window.location.href = '/timestamps';
            
          } 
          else {
            // Passwords don't match, login failed
            console.log('Incorrect password ');
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
          console.log('error in post request');
          //removes from the password box
          values.password = '';
          //make the password box text red for 2 seconds
          setLoginSuccess(false);
          
          setTimeout(() => {
            setLoginSuccess(true);
          }, 2000);


          //trying creating user
          

        });
        
      }
      else
      {
        console.log("citizen login");
        axios.post(Variables.API_URL + '/citizen/login', {
          email: values.username,
          password: values.password
        })
        //if the login is successful we get a token
        .then(response => {       
          //saves the token in a cookie and sets the expiration date to 10 minutes
          Cookies.set('token', response.data.token, { expires: 1/24 });
          Cookies.set('citizenId', response.data.id, { expires: 1/24 });
          console.log(Cookies.get('token'));
          


         

          //if we get a token we set the loginSuccess state to true
          if (response.data.token) {
            // Passwords match, login successful
            console.log('Login successful!');
            
            setLoginSuccess(true);
            //redirect to the showData page
           window.location.href = '/citizenPage';
            
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
      

  }



  return (
    //this is the login form
    <div >
      <div >
        <div className="d-flex justify-content-center align-items-start" style={{padding: '5%'}}>
        <Image src={mypic} alt="" width="400" height="400" />
        </div>
      
      <div className="d-flex justify-content-center align-items-start" >
      <Formik
        initialValues={{
          username: '',
          password: '',
          isAdmin: false, // use "isAdmin" instead of "Admin"
        }}
        //handle summit that is called when the user clicks the login button
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
        <Form>
   
        
      
          <div className="mb-2">
            <Field className="form-control" id="username" name="username" placeholder="email" aria-describedby="usernameHelp" style={{ width: '300px' }} />
          </div>
      
          <div className="mb-4">
            <Field className={`form-control ${loginSuccess ? '' : 'is-invalid'}`} id="password" name="password" placeholder="Password" type="password" style={{ width: '300px' }}/>
            {loginSuccess === false && <div className="invalid-feedback">Incorrect password or username</div>}
          </div>

          <div className="d-flex justify-content-center">
  <button type="submit" className={`btn btn-primary mr-3 ${styles.color_button}`} style={{ marginRight: '15px', height: '60%' }} disabled={isSubmitting}>
    Login
  </button>

  <div style={{ display: 'flex', alignItems: 'center' }}>
  <Field name="isAdmin">
    {({ field: { value }, form: { setFieldValue } }) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Switch
          
          style={{ marginTop: '10px' }}
          checked={value}
          onChange={(value) => {
            setFieldValue('isAdmin', value);
            setFieldValue('username', value ? 'admin' : '');
          }}
        />
        <label style={{ marginTop: '8px', marginLeft: '5px' }} htmlFor="isAdmin">Admin</label>
      </div>
    )}
  </Field>
</div>
</div>

   

      </Form>
      
        )}
      </Formik>
      </div>
    </div>
    </div>
  );
};





